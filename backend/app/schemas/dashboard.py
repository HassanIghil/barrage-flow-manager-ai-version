# backend/app/schemas/dashboard.py

from pydantic import BaseModel
from typing import List
from decimal import Decimal
from datetime import datetime

class DashboardStats(BaseModel):
    total_barrages: int
    total_cooperatives: int
    volume_total_lachers: Decimal
    alertes_actives: int

class RecentActivity(BaseModel):
    type: str
    description: str
    date: datetime

# Ajouter le nouveau shéma précis pour les alerts
class AlerteUrgente(BaseModel):      
    id_alerte: int
    type: str
    message: str
    id_barrage: int

class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_activities: List[RecentActivity]
    alertes_urgentes: List[AlerteUrgente]  