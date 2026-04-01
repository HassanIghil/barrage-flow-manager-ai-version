# backend/app/routes/dashboard.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/overview")
def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retourne les statistiques globales du barrage.
    Exécute la procédure stockée : CALL sp_dashboard_stats()
    """
    try:
        result = db.execute(text("CALL sp_dashboard_stats()"))
        row = result.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Aucune donnée disponible")
        return dict(row._mapping)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")


@router.get("/history")
def get_dashboard_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retourne l'historique des lâchers d'eau.
    Exécute un SELECT sur la vue : v_historique_lachers
    """
    try:
        result = db.execute(text("SELECT * FROM v_historique_lachers"))
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")
