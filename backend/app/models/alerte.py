# backend/app/models/alerte.py

from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AlerteType(str, enum.Enum):
    NIVEAU_CRITIQUE = "niveau_critique"
    SEUIL_BAS = "seuil_bas"
    INONDATION_RISQUE = "inondation_risque"
    MAINTENANCE = "maintenance"
    SYSTEME = "systeme"

class Alerte(Base):
    __tablename__ = "Alerte"
    
    id_alerte = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type_alerte = Column(Enum('niveau_critique', 'seuil_bas', 'inondation_risque', 'maintenance', 'systeme'), nullable=False)
    message = Column(String(500), nullable=False)
    date_alerte = Column(DateTime, nullable=False, default=func.now())
    id_barrage = Column(Integer, ForeignKey("Barrage.id_barrage"), nullable=False)
    
    # Relationships
    barrage = relationship("Barrage", back_populates="alertes")
