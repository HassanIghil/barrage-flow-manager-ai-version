# backend/app/routes/demandes.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.routes.dependencies import RoleChecker

router = APIRouter(prefix="/api/demandes", tags=["Demandes"])


@router.get("/", response_model=list)
def list_demandes(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retourne toutes les demandes d'irrigation avec les infos utilisateur et coopérative.
    Accessible à tous les rôles authentifiés.
    """
    try:
        result = db.execute(
            text("""
                SELECT
                    d.id_demande,
                    d.date_demande,
                    d.volume_demande,
                    d.statut,
                    u.nom AS nom_user,
                    u.email AS email_user,
                    c.nom AS nom_coop,
                    c.id_coop
                FROM Demande_Irrigation d
                JOIN Utilisateur u ON d.id_user = u.id_user
                JOIN Cooperative c ON d.id_coop = c.id_coop
                ORDER BY d.date_demande DESC
            """)
        )
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_demande(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Crée une nouvelle demande d'irrigation.
    Body: { volume_demande: float (>0), id_coop: int }
    Récupère l'id_user à partir du JWT (email → Utilisateur).
    """
    try:
        volume = payload.get("volume_demande")
        id_coop = payload.get("id_coop")

        if not volume or float(volume) <= 0:
            raise HTTPException(status_code=422, detail="Le volume demandé doit être supérieur à 0.")
        if not id_coop:
            raise HTTPException(status_code=422, detail="La coopérative est requise.")

        # Résoudre id_user depuis email JWT
        email = current_user.get("sub")
        user = db.execute(
            text("SELECT id_user FROM Utilisateur WHERE email = :email"),
            {"email": email},
        ).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable.")

        id_user = user[0]

        # Vérifier que la coopérative existe
        coop = db.execute(
            text("SELECT 1 FROM Cooperative WHERE id_coop = :id"),
            {"id": id_coop},
        ).fetchone()
        if not coop:
            raise HTTPException(status_code=404, detail=f"Coopérative #{id_coop} introuvable.")

        db.execute(
            text("""
                INSERT INTO Demande_Irrigation (date_demande, volume_demande, statut, id_user, id_coop)
                VALUES (:date_demande, :volume, 'en_attente', :id_user, :id_coop)
            """),
            {
                "date_demande": datetime.now(),
                "volume": float(volume),
                "id_user": id_user,
                "id_coop": id_coop,
            },
        )
        db.commit()
        return {"message": "Demande d'irrigation créée avec succès.", "statut": "en_attente"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création : {str(e)}")


@router.put(
    "/{id_demande}/approve",
    dependencies=[Depends(RoleChecker(["Directeur", "directeur", "Admin", "admin"]))],
)
def approve_demande(
    id_demande: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Approuve une demande d'irrigation (Directeur/Admin uniquement).
    """
    try:
        result = db.execute(
            text("SELECT statut FROM Demande_Irrigation WHERE id_demande = :id"),
            {"id": id_demande},
        ).fetchone()
        if not result:
            raise HTTPException(status_code=404, detail=f"Demande #{id_demande} introuvable.")
        if result.statut not in ("en_attente",):
            raise HTTPException(
                status_code=400,
                detail=f"La demande est déjà '{result.statut}' — seules les demandes en attente peuvent être approuvées.",
            )

        db.execute(
            text("UPDATE Demande_Irrigation SET statut = 'approuvee' WHERE id_demande = :id"),
            {"id": id_demande},
        )
        db.commit()
        return {"message": f"Demande #{id_demande} approuvée.", "id_demande": id_demande, "statut": "approuvee"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur : {str(e)}")


@router.put(
    "/{id_demande}/reject",
    dependencies=[Depends(RoleChecker(["Directeur", "directeur", "Admin", "admin"]))],
)
def reject_demande(
    id_demande: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Refuse une demande d'irrigation (Directeur/Admin uniquement).
    """
    try:
        result = db.execute(
            text("SELECT statut FROM Demande_Irrigation WHERE id_demande = :id"),
            {"id": id_demande},
        ).fetchone()
        if not result:
            raise HTTPException(status_code=404, detail=f"Demande #{id_demande} introuvable.")
        if result.statut not in ("en_attente",):
            raise HTTPException(
                status_code=400,
                detail=f"La demande est déjà '{result.statut}'.",
            )

        db.execute(
            text("UPDATE Demande_Irrigation SET statut = 'refusee' WHERE id_demande = :id"),
            {"id": id_demande},
        )
        db.commit()
        return {"message": f"Demande #{id_demande} refusée.", "id_demande": id_demande, "statut": "refusee"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur : {str(e)}")
