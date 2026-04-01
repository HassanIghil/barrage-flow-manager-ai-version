# backend/app/schemas/demande_irrigation.py

from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime
from app.models.demande_irrigation import DemandeStatus

class DemandeIrrigationCreate(BaseModel):
    volume_demande: Decimal = Field(..., gt=0)
    id_coop: int

class DemandeIrrigationResponse(BaseModel):
    id_demande: int
    date_demande: datetime
    volume_demande: Decimal
    statut: DemandeStatus
    id_user: int
    id_coop: int
    
    class Config:
        from_attributes = True
