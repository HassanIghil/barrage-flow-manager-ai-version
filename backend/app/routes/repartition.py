# backend/app/routes/repartition.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.repartition import Repartition
from app.schemas.repartition import RepartitionCreate, RepartitionUpdate, RepartitionResponse

router = APIRouter(prefix="/api/repartitions", tags=["Repartition"])


@router.get("/v/detail", response_model=List[dict])
def get_repartition_view_detail(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retourne les détails des répartitions depuis la vue : v_repartition_detail
    """
    try:
        result = db.execute(text("SELECT * FROM v_repartition_detail"))
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")


@router.post("/trigger/{id_lacher}", status_code=status.HTTP_200_OK)
def trigger_repartition_procedure(
    id_lacher: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Exécute la procédure stockée sp_repartir_eau pour un lâcher donné.
    Ceci calcule et insère automatiquement les répartitions au prorata des surfaces.
    """
    try:
        # On vérifie si des répartitions existent déjà pour éviter les doublons 
        # (La procédure SQL fait des INSERT bruts, elle pourrait échouer sur clé unique si gérée)
        existing = db.execute(
            text("SELECT 1 FROM Repartition WHERE id_lacher = :id LIMIT 1"),
            {"id": id_lacher}
        ).fetchone()
        
        if existing:
            raise HTTPException(
                status_code=400, 
                detail=f"Des répartitions existent déjà pour le lâcher #{id_lacher}"
            )

        db.execute(text("CALL sp_repartir_eau(:id)"), {"id": id_lacher})
        db.commit()
        
        return {"message": f"Répartition générée avec succès pour le lâcher #{id_lacher}"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'exécution : {str(e)}")


@router.get("/", response_model=List[dict])
def list_repartitions(
    id_lacher: int = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Liste toutes les répartitions. Filtre optionnel par lâcher (id_lacher).
    Inclut le nom de la coopérative et les infos du lâcher via JOIN.
    """
    try:
        if id_lacher:
            result = db.execute(
                text("""
                    SELECT r.id_repartition, r.id_lacher, r.id_coop, r.volume_attribue,
                           c.nom AS nom_coop, c.surface_agricole,
                           l.date_lacher, l.statut AS statut_lacher, l.volume AS volume_lacher
                    FROM Repartition r
                    JOIN Cooperative c ON r.id_coop = c.id_coop
                    JOIN Lacher_Eau l ON r.id_lacher = l.id_lacher
                    WHERE r.id_lacher = :id_lacher
                    ORDER BY c.nom
                """),
                {"id_lacher": id_lacher},
            )
        else:
            result = db.execute(
                text("""
                    SELECT r.id_repartition, r.id_lacher, r.id_coop, r.volume_attribue,
                           c.nom AS nom_coop, c.surface_agricole,
                           l.date_lacher, l.statut AS statut_lacher, l.volume AS volume_lacher
                    FROM Repartition r
                    JOIN Cooperative c ON r.id_coop = c.id_coop
                    JOIN Lacher_Eau l ON r.id_lacher = l.id_lacher
                    ORDER BY l.date_lacher DESC, c.nom
                """)
            )
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")


@router.get("/{id_repartition}", response_model=dict)
def get_repartition(
    id_repartition: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retourne une répartition par son ID, avec les détails de la coopérative et du lâcher.
    """
    try:
        result = db.execute(
            text("""
                SELECT r.id_repartition, r.id_lacher, r.id_coop, r.volume_attribue,
                       c.nom AS nom_coop, c.surface_agricole,
                       l.date_lacher, l.statut AS statut_lacher, l.volume AS volume_lacher
                FROM Repartition r
                JOIN Cooperative c ON r.id_coop = c.id_coop
                JOIN Lacher_Eau l ON r.id_lacher = l.id_lacher
                WHERE r.id_repartition = :id
            """),
            {"id": id_repartition},
        )
        row = result.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Répartition introuvable")
        return dict(row._mapping)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_repartition(
    payload: RepartitionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Crée une nouvelle répartition de volume d'eau pour une coopérative.
    Vérifie que le couple (id_lacher, id_coop) n'existe pas déjà.
    """
    try:
        # Check for duplicate
        existing = db.execute(
            text("SELECT id_repartition FROM Repartition WHERE id_lacher = :l AND id_coop = :c"),
            {"l": payload.id_lacher, "c": payload.id_coop},
        ).fetchone()
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Une répartition pour ce lâcher et cette coopérative existe déjà.",
            )

        new_rep = Repartition(
            id_lacher=payload.id_lacher,
            id_coop=payload.id_coop,
            volume_attribue=payload.volume_attribue,
        )
        db.add(new_rep)
        db.commit()
        db.refresh(new_rep)

        return {
            "id_repartition": new_rep.id_repartition,
            "id_lacher": new_rep.id_lacher,
            "id_coop": new_rep.id_coop,
            "volume_attribue": float(new_rep.volume_attribue),
            "message": "Répartition créée avec succès",
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création : {str(e)}")


@router.put("/{id_repartition}", response_model=dict)
def update_repartition(
    id_repartition: int,
    payload: RepartitionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Modifie le volume attribué d'une répartition existante.
    """
    try:
        rep = db.query(Repartition).filter(Repartition.id_repartition == id_repartition).first()
        if rep is None:
            raise HTTPException(status_code=404, detail="Répartition introuvable")

        rep.volume_attribue = payload.volume_attribue
        db.commit()
        db.refresh(rep)

        return {
            "id_repartition": rep.id_repartition,
            "id_lacher": rep.id_lacher,
            "id_coop": rep.id_coop,
            "volume_attribue": float(rep.volume_attribue),
            "message": "Répartition mise à jour avec succès",
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour : {str(e)}")


@router.delete("/{id_repartition}", status_code=status.HTTP_200_OK)
def delete_repartition(
    id_repartition: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Supprime une répartition par son ID.
    """
    try:
        rep = db.query(Repartition).filter(Repartition.id_repartition == id_repartition).first()
        if rep is None:
            raise HTTPException(status_code=404, detail="Répartition introuvable")

        db.delete(rep)
        db.commit()
        return {"message": f"Répartition #{id_repartition} supprimée avec succès"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression : {str(e)}")


@router.get("/summary/by-lacher", response_model=List[dict])
def get_repartition_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Résumé agrégé : pour chaque lâcher, total de volume réparti et nombre de coopératives.
    """
    try:
        result = db.execute(
            text("""
                SELECT l.id_lacher, l.date_lacher, l.volume AS volume_total_lacher,
                       l.statut AS statut_lacher,
                       COUNT(r.id_coop) AS nb_cooperatives,
                       SUM(r.volume_attribue) AS volume_total_reparti
                FROM Lacher_Eau l
                LEFT JOIN Repartition r ON l.id_lacher = r.id_lacher
                GROUP BY l.id_lacher, l.date_lacher, l.volume, l.statut
                ORDER BY l.date_lacher DESC
            """)
        )
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")
