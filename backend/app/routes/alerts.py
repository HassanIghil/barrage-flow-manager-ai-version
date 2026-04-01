# backend/app/routes/alerts.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("/recent")
def get_recent_alerts(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retourne les alertes critiques récentes, triées par date décroissante.
    """
    try:
        result = db.execute(
            text(
                """
                SELECT id_alerte, type, message, date_
                FROM Alerte
                ORDER BY date_ DESC
                LIMIT 10
                """
            )
        )
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")


@router.get("/critical")
def get_critical_alerts(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retourne uniquement les alertes de type 'niveau_critique', triées par date décroissante.
    """
    try:
        result = db.execute(
            text(
                """
                SELECT id_alerte, type, message, date_, id_barrage
                FROM Alerte
                WHERE type = 'niveau_critique'
                ORDER BY date_ DESC
                LIMIT 10
                """
            )
        )
        rows = result.fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur base de données : {str(e)}")
