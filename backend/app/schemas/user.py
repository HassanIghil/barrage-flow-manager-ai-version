from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    nom: str
    email: EmailStr
    password: str
    role: UserRole


class UserResponse(BaseModel):
    id_user: int
    nom: str
    email: str
    role: UserRole

    class Config:
        from_attributes = True