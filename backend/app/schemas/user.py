from pydantic import BaseModel, EmailStr , Field
from app.models.user import UserRole


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    nom: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)   # ← minimum 8 caractères
    role: UserRole


class UserResponse(BaseModel):
    id_user: int
    nom: str
    email: str
    role: UserRole

    class Config:
        from_attributes = True