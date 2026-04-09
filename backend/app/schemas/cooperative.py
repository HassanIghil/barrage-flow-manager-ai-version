# backend/app/schemas/cooperative.py

from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional

class CooperativeBase(BaseModel):
    nom: str = Field(..., max_length=50)
    surface_agricole: Decimal = Field(..., gt=0)
    historique_consommation: Optional[Decimal] = Field(None, ge=0) # >=0 

class CooperativeCreate(CooperativeBase):
    pass

class CooperativeResponse(CooperativeBase):
    id_coop: int
    
    class Config:
        from_attributes = True
