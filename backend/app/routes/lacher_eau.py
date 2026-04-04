# backend/app/routes/lacher_eau.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime
from decimal import Decimal

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.lacher_eau import LacherEau, LacherStatus
from app.schemas.lacher_eau import ReleaseRequest, LacherEauResponse
from app.routes.dependencies import RoleChecker

router = APIRouter(prefix="/api/releases", tags=["Releases"])


@router.post("/", response_model=LacherEauResponse, status_code=status.HTTP_201_CREATED)
def create_release(
    payload: ReleaseRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Crée un nouveau lacher d'eau.
    - volume_m3: Volume a lacher (doit être > 0)
    - id_barrage: ID du barrage concerné
    - motif: Optionnel (ignoré pour l'instant dans la DB car colonne manquante)
    """
    try:
        # Check if barrage exists
        barrage_exists = db.execute(
            text("SELECT 1 FROM Barrage WHERE id_barrage = :id"), {"id": payload.id_barrage}
        ).fetchone()

        if not barrage_exists:
            raise HTTPException(status_code=404, detail=f"Barrage #{payload.id_barrage} introuvable")

        user_email = current_user.get("sub")
        user = db.execute(
            text("SELECT id_user FROM Utilisateur WHERE email = :email"), {"email": user_email}
        ).fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        id_user = user[0]

        new_release = LacherEau(
            date_lacher=datetime.now(),
            volume=payload.volume_m3,
            statut=LacherStatus.planifie,
            id_user=id_user,
            id_barrage=payload.id_barrage,
            id_demande=None,
        )

        db.add(new_release)
        db.commit()
        db.refresh(new_release)

        return new_release
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du lâcher : {str(e)}")


@router.put("/{id_lacher}/execute", response_model=dict)
def execute_release(
    id_lacher: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        RoleChecker(["Directeur", "directeur", "Admin", "admin"])
    ),
):
    """
    Exécute un lâcher d'eau planifié ou en cours.
    ─ Réservé au Directeur uniquement.
    ─ Met le statut à 'termine'.
    ─ Décrémente le niveau_actuel du barrage correspondant.
    ─ Bloque si le niveau descend sous le seuil critique.
    """
    try:
        # 1. Récupérer le lâcher
        lacher = (
            db.query(LacherEau).filter(LacherEau.id_lacher == id_lacher).first()
        )
        if not lacher:
            raise HTTPException(
                status_code=404, detail=f"Lâcher #{id_lacher} introuvable"
            )

        # 2. Vérifier le statut
        if lacher.statut not in (LacherStatus.planifie, LacherStatus.en_cours):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Ce lâcher est déjà '{lacher.statut.value}' — "
                    "seuls les lâchers planifiés ou en cours peuvent être exécutés."
                ),
            )

        # 3. Récupérer le barrage
        barrage = db.execute(
            text(
                "SELECT id_barrage, niveau_actuel, seuil_critique, capacite_max "
                "FROM Barrage WHERE id_barrage = :id"
            ),
            {"id": lacher.id_barrage},
        ).fetchone()

        if not barrage:
            raise HTTPException(
                status_code=404,
                detail=f"Barrage #{lacher.id_barrage} introuvable",
            )

        niveau_actuel = Decimal(str(barrage.niveau_actuel))
        seuil_critique = Decimal(str(barrage.seuil_critique))
        volume = Decimal(str(lacher.volume))

        # 4. Sécurité : vérifier le seuil critique
        nouveau_niveau = niveau_actuel - volume
        if nouveau_niveau < seuil_critique:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Exécution refusée : le niveau après lâcher ({nouveau_niveau:,.0f} m³) "
                    f"passerait sous le seuil critique ({seuil_critique:,.0f} m³). "
                    "Réduisez le volume ou attendez les précipitations."
                ),
            )

        # 5. Mettre à jour le niveau du barrage
        db.execute(
            text(
                "UPDATE Barrage SET niveau_actuel = :n WHERE id_barrage = :id"
            ),
            {"n": float(nouveau_niveau), "id": lacher.id_barrage},
        )

        # 6. Marquer le lâcher comme terminé
        lacher.statut = LacherStatus.termine
        db.commit()

        return {
            "message": f"Lâcher #{id_lacher} exécuté avec succès.",
            "id_lacher": id_lacher,
            "volume_libere_m3": float(volume),
            "nouveau_niveau_barrage_m3": float(nouveau_niveau),
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Erreur lors de l'exécution : {str(e)}"
        )


@router.get("/", response_model=list)
def list_releases(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Liste tous les lâchers d'eau avec les infos de l'utilisateur et du barrage.
    """
    try:
        result = db.execute(
            text("""
                SELECT
                    l.id_lacher,
                    l.date_lacher,
                    l.volume AS volume_m3,
                    l.statut,
                    l.id_barrage,
                    u.nom AS nom_utilisateur,
                    b.nom AS nom_barrage
                FROM Lacher_Eau l
                JOIN Utilisateur u ON l.id_user = u.id_user
                JOIN Barrage b     ON l.id_barrage = b.id_barrage
                ORDER BY l.date_lacher DESC
            """)
        )
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erreur base de données : {str(e)}"
        )