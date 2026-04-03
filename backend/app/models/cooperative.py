# backend/app/models/cooperative.py

from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.orm import relationship
from app.core.database import Base

class Cooperative(Base):
    __tablename__ = "Cooperative"
    
    id_coop = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(50), nullable=False, index=True)
    surface_agricole = Column(Numeric(15, 2), nullable=False)
    historique_consommation = Column(Numeric(15, 2), nullable=True)
    
    # Relationships
    demandes_irrigation = relationship("DemandeIrrigation", back_populates="cooperative")
    repartitions = relationship("Repartition", back_populates="cooperative")
