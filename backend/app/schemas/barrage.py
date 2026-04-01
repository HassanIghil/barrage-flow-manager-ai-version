# backend/app/schemas/barrage.py

from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional

class BarrageBase(BaseModel):
    nom: str = Field(..., max_length=50)
    capacite_max: Decimal = Field(..., gt=0)
    niveau_actuel: Decimal = Field(..., ge=0)
    seuil_critique: Decimal = Field(..., ge=0)

class BarrageCreate(BarrageBase):
    pass

class BarrageResponse(BarrageBase):
    id_barrage: int
    
    class Config:
        from_attributes = True
