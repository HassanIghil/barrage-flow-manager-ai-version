# backend/app/models/demande_irrigation.py

from sqlalchemy import Column, Integer, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class DemandeStatus(str, enum.Enum):
    EN_ATTENTE = "en_attente"
    APPROUVEE = "approuvee"
    REFUSEE = "refusee"
    EN_COURS = "en_cours"
    TERMINEE = "terminee"

class DemandeIrrigation(Base):
    __tablename__ = "Demande_Irrigation"
    
    id_demande = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date_demande = Column(DateTime, nullable=False)
    volume_demande = Column(Numeric(15, 2), nullable=False)
    statut = Column(Enum(DemandeStatus), nullable=False, default=DemandeStatus.EN_ATTENTE)
    id_user = Column(Integer, ForeignKey("Utilisateur.id_user"), nullable=False)
    id_coop = Column(Integer, ForeignKey("Cooperative.id_coop"), nullable=False)
    
    # Relationships
    utilisateur = relationship("User", back_populates="demandes_irrigation")
    cooperative = relationship("Cooperative", back_populates="demandes_irrigation")
    lachers_eau = relationship("LacherEau", back_populates="demande")
