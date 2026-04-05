from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.core.security import get_current_user
from app.middleware.rbac import RoleChecker
from app.models.lacher_eau import LacherEau
from app.schemas.lacher_eau import ReleaseRequest, LacherEauResponse
from datetime import datetime

router = APIRouter(prefix="/api/releases", tags=["Releases"])

# "Ingénieur" = gestionnaire, "Directeur" = admin/Directeur
allowed_create_roles = ["gestionnaire", "Gestionnaire", "admin", "Admin", "Directeur", "directeur"]
allowed_execute_roles = ["admin", "Admin", "Directeur", "directeur"]

@router.post("", response_model=LacherEauResponse, status_code=status.HTTP_201_CREATED)
def create_release(
    release_data: ReleaseRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(RoleChecker(allowed_roles=allowed_create_roles))
):
    """
    Create a new water release request with status 'en_attente' (or 'planifie').
    """
    # Create the release object
    new_release = LacherEau(
        date_lacher=datetime.utcnow(),
        volume=release_data.volume_m3,
        statut='planifie',
        id_barrage=release_data.id_barrage,
        id_user=current_user.get("user_id", 1) # Fallback to 1 if user_id is not in payload
    )
    
    # We try to find the user id from the sub (email) since JWT only stores email and role
    from app.models.user import User
    user = db.query(User).filter(User.email == current_user.get("sub")).first()
    if user:
        new_release.id_user = user.id_user

    db.add(new_release)
    db.commit()
    db.refresh(new_release)
    
    return new_release

@router.put("/{id_lacher}/execute")
def execute_release(
    id_lacher: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(RoleChecker(allowed_roles=allowed_execute_roles))
):
    """
    Execute a planned release. Strict access for Directeur/Admin.
    """
    release = db.query(LacherEau).filter(LacherEau.id_lacher == id_lacher).first()
    
    if not release:
        raise HTTPException(status_code=404, detail="Lâcher d'eau introuvable")
        
    if release.statut == 'termine':
        raise HTTPException(status_code=400, detail="Ce lâcher d'eau a déjà été exécuté")
        
    # Set status to execute/termine
    release.statut = 'termine'
    db.commit()
    
    # Call stored procedure
    try:
        db.execute(text(f"CALL sp_repartir_eau({id_lacher})"))
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la répartition de l'eau: {str(e)}")
        
    return {"message": "Lâcher d'eau exécuté avec succès et réparti entre les coopératives"}
