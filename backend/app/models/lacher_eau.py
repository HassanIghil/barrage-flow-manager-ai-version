# backend/app/models/lacher_eau.py

from sqlalchemy import Column, Integer, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class LacherStatus(str, enum.Enum):
    PLANIFIE = "planifie"
    EN_COURS = "en_cours"
    TERMINE = "termine"
    ANNULE = "annule"

class LacherEau(Base):
    __tablename__ = "Lacher_Eau"
    
    id_lacher = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date_lacher = Column(DateTime, nullable=False)
    volume = Column(Numeric(15, 2), nullable=False)
    statut = Column(Enum(LacherStatus), nullable=False, default=LacherStatus.PLANIFIE)
    id_demande = Column(Integer, ForeignKey("Demande_Irrigation.id_demande"), nullable=True)
    id_user = Column(Integer, ForeignKey("Utilisateur.id_user"), nullable=False)
    id_barrage = Column(Integer, ForeignKey("Barrage.id_barrage"), nullable=False)
    
    # Relationships
    demande = relationship("DemandeIrrigation", back_populates="lachers_eau")
    utilisateur = relationship("User", back_populates="lachers_eau")
    barrage = relationship("Barrage", back_populates="lachers_eau")
