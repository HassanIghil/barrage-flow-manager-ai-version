# backend/app/schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole

# Schéma pour le login
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "directeur@barrage.ma",
                "password": "motdepasse123"
            }
        }

# Schéma pour la création d'utilisateur
class UserCreate(BaseModel):
    nom: str
    email: EmailStr
    role: UserRole = UserRole.agriculteur

# Schéma de réponse utilisateur
class UserResponse(BaseModel):
    id_user: int
    nom: str
    email: str
    role: UserRole
    
    class Config:
        from_attributes = True
