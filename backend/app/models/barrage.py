# backend/app/models/barrage.py

from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.orm import relationship
from app.core.database import Base

class Barrage(Base):
    __tablename__ = "Barrage"
    
    id_barrage = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(50), nullable=False, index=True)
    capacite_max = Column(Numeric(15, 2), nullable=False)
    niveau_actuel = Column(Numeric(15, 2), nullable=False)
    seuil_critique = Column(Numeric(15, 2), nullable=False)
    
    # Relationships
    lachers_eau = relationship("LacherEau", back_populates="barrage")
    alertes = relationship("Alerte", back_populates="barrage")
