# backend/app/schemas/repartition.py

from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Optional


class RepartitionBase(BaseModel):
    id_lacher: int = Field(..., gt=0, description="ID du lâcher d'eau")
    id_coop: int = Field(..., gt=0, description="ID de la coopérative")
    volume_attribue: Decimal = Field(..., gt=0, description="Volume attribué en m³")


class RepartitionCreate(RepartitionBase):
    class Config:
        json_schema_extra = {
            "example": {
                "id_lacher": 1,
                "id_coop": 2,
                "volume_attribue": 20000.00,
            }
        }


class RepartitionUpdate(BaseModel):
    volume_attribue: Decimal = Field(..., gt=0, description="Nouveau volume attribué en m³")

    class Config:
        json_schema_extra = {
            "example": {
                "volume_attribue": 25000.00,
            }
        }


class RepartitionResponse(RepartitionBase):
    id_repartition: int
    # Optional enriched fields from joined queries
    nom_coop: Optional[str] = None
    date_lacher: Optional[str] = None
    statut_lacher: Optional[str] = None

    class Config:
        from_attributes = True
