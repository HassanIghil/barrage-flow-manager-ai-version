# backend/app/models/user.py

from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    Admin = "Admin"
    Gestionnaire = "Gestionnaire"
    Agriculteur = "Agriculteur"
    Technicien = "Technicien"
    Directeur = "Directeur"
    admin = "admin"
    gestionnaire = "gestionnaire"
    agriculteur = "agriculteur"
    technicien = "technicien"

class User(Base):
    __tablename__ = "Utilisateur"
    
    id_user = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False, index=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.agriculteur)
    
    # Relationships
    demandes_irrigation = relationship("DemandeIrrigation", back_populates="utilisateur")
    lachers_eau = relationship("LacherEau", back_populates="utilisateur")
