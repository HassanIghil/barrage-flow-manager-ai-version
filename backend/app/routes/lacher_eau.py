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

        # Get current user ID (from JWT sub, which is usually the email or ID)
        # Assuming sub is the email, we need the ID.
        # Let's check how current_user is structured in security.py.
        # Actually, in this project, get_current_user returns the payload (dict).
        # We need the user's ID. Let's find the user by email if sub is email.
        
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
            id_demande=None  # Direct release
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

