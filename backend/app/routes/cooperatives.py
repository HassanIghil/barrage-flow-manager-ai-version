# backend/app/routes/cooperatives.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db
from app.core.security import get_current_user
from app.routes.dependencies import RoleChecker

router = APIRouter(prefix="/api/cooperatives", tags=["Cooperatives"])


@router.get("/", response_model=list)
def list_cooperatives(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retourne toutes les coopératives avec leurs statistiques agrégées.
    Accessible à tous les rôles authentifiés.
    """
    try:
        result = db.execute(
            text("""
                SELECT
                    c.id_coop,
                    c.nom,
                    c.surface_agricole,
                    c.historique_consommation,
                    COUNT(DISTINCT d.id_demande) AS nb_demandes,
                    COALESCE(SUM(r.volume_attribue), 0) AS volume_total_recu
                FROM Cooperative c
                LEFT JOIN Demande_Irrigation d ON c.id_coop = d.id_coop
                LEFT JOIN Repartition r ON c.id_coop = r.id_coop
                GROUP BY c.id_coop, c.nom, c.surface_agricole, c.historique_consommation
                ORDER BY c.nom
            """)
        )
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(RoleChecker(["Directeur", "directeur", "Admin", "admin"]))],
)
def create_cooperative(
    payload: dict,
    db: Session = Depends(get_db),
):
    """
    Crée une nouvelle coopérative agricole. Réservé au Directeur/Admin.
    Body: { nom: str, surface_agricole: float (>0), historique_consommation: float? }
    """
    try:
        nom = payload.get("nom", "").strip()
        surface = payload.get("surface_agricole")
        historique = payload.get("historique_consommation", 0)

        if not nom:
            raise HTTPException(status_code=422, detail="Le nom est requis.")
        if not surface or float(surface) <= 0:
            raise HTTPException(status_code=422, detail="La surface agricole doit être > 0.")

        db.execute(
            text("""
                INSERT INTO Cooperative (nom, surface_agricole, historique_consommation)
                VALUES (:nom, :surface, :historique)
            """),
            {"nom": nom, "surface": float(surface), "historique": float(historique or 0)},
        )
        db.commit()
        return {"message": f"Coopérative '{nom}' créée avec succès."}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création : {str(e)}")


@router.put(
    "/{id_coop}",
    dependencies=[Depends(RoleChecker(["Directeur", "directeur", "Admin", "admin"]))],
)
def update_cooperative(
    id_coop: int,
    payload: dict,
    db: Session = Depends(get_db),
):
    """
    Modifie une coopérative existante. Réservé au Directeur/Admin.
    Body: { nom?: str, surface_agricole?: float, historique_consommation?: float }
    """
    try:
        coop = db.execute(
            text("SELECT id_coop FROM Cooperative WHERE id_coop = :id"),
            {"id": id_coop},
        ).fetchone()
        if not coop:
            raise HTTPException(status_code=404, detail=f"Coopérative #{id_coop} introuvable.")

        fields = []
        params = {"id": id_coop}

        if "nom" in payload and payload["nom"]:
            fields.append("nom = :nom")
            params["nom"] = payload["nom"].strip()
        if "surface_agricole" in payload and payload["surface_agricole"] is not None:
            if float(payload["surface_agricole"]) <= 0:
                raise HTTPException(status_code=422, detail="La surface agricole doit être > 0.")
            fields.append("surface_agricole = :surface")
            params["surface"] = float(payload["surface_agricole"])
        if "historique_consommation" in payload and payload["historique_consommation"] is not None:
            fields.append("historique_consommation = :historique")
            params["historique"] = float(payload["historique_consommation"])

        if not fields:
            raise HTTPException(status_code=422, detail="Aucun champ à mettre à jour.")

        db.execute(
            text(f"UPDATE Cooperative SET {', '.join(fields)} WHERE id_coop = :id"),
            params,
        )
        db.commit()
        return {"message": f"Coopérative #{id_coop} mise à jour avec succès."}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur : {str(e)}")
