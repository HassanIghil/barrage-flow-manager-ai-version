# backend/app/models/alerte.py

from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class AlerteType(str, enum.Enum):
    NIVEAU_CRITIQUE = "niveau_critique"
    SEUIL_BAS = "seuil_bas"
    INONDATION_RISQUE = "MAINTENANCE"
    MAINTENANCE = "maintenance"
    SYSTEME = "systeme"

class Alerte(Base):
    __tablename__ = "Alerte"
    
    id_alerte = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(Enum(AlerteType), nullable=False, default=AlerteType.SYSTEME)
    message = Column(String(500), nullable=False)
    date_ = Column(DateTime, nullable=False)
    id_barrage = Column(Integer, ForeignKey("Barrage.id_barrage"), nullable=False)
    
    # Relationships
    barrage = relationship("Barrage", back_populates="alertes")
