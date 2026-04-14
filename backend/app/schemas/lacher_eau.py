# backend/app/schemas/lacher_eau.py

from pydantic import BaseModel, Field, validator
from decimal import Decimal
from datetime import datetime
from typing import Optional
from app.models.lacher_eau import LacherStatus

# Schéma pour demander un lâcher d'eau (ReleaseRequest)
class ReleaseRequest(BaseModel):
    volume_m3: Decimal = Field(..., gt=0, description="Volume doit être supérieur à 0")
    id_barrage: int = Field(..., gt=0)
    motif: Optional[str] = Field(None, max_length=500)
    
    @validator('volume_m3')
    def validate_volume_positive(cls, v):
        if v <= 0:
            raise ValueError('Le volume doit être strictement positif')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "volume_m3": 50000.00,
                "id_barrage": 1,
                "motif": "Irrigation planifiée zone Tamaloute"
            }
        }

class LacherEauCreate(BaseModel):
    volume: Decimal = Field(..., gt=0)
    id_demande: Optional[int] = None
    id_user: int = Field(..., gt=0)    # valeurs > 0 uniquement
    id_barrage: int = Field(..., gt=0)    # valeurs > 0 uniquement

class LacherEauResponse(BaseModel):
    id_lacher: int
    date_lacher: datetime
    volume: Decimal
    statut: LacherStatus
    id_demande: Optional[int]
    id_user: int
    id_barrage: int
    
    class Config:
        from_attributes = True
