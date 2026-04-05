from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
from app.core.security import hash_password, get_current_user
from app.routes.dependencies import RoleChecker

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.post(
    "/register",
    response_model=UserResponse,
    dependencies=[Depends(RoleChecker(["Admin", "admin", "Directeur", "directeur"]))],
)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        nom=user_data.nom,
        email=user_data.email,
        password=hash_password(user_data.password),
        role=user_data.role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.get("/me", response_model=UserResponse)
def me(payload: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    email = payload.get("sub")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get(
    "/",
    response_model=List[UserResponse],
    dependencies=[Depends(RoleChecker(["Admin", "admin", "Directeur", "directeur"]))],
)
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.nom).all()
    return users
