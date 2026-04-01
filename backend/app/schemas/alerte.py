# backend/app/schemas/alerte.py

from pydantic import BaseModel, Field
from datetime import datetime
from app.models.alerte import AlerteType

class AlerteCreate(BaseModel):
    type: AlerteType
    message: str = Field(..., max_length=500)
    date_: datetime
    id_barrage: int

class AlerteResponse(BaseModel):
    id_alerte: int
    type: AlerteType
    message: str
    date_: datetime
    id_barrage: int
    
    class Config:
        from_attributes = True
