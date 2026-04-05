# backend/app/schemas/__init__.py

from .user import UserLogin, UserCreate, UserResponse
from .barrage import BarrageCreate, BarrageResponse
from .lacher_eau import ReleaseRequest, LacherEauCreate, LacherEauResponse
from .cooperative import CooperativeCreate, CooperativeResponse
from .demande_irrigation import DemandeIrrigationCreate, DemandeIrrigationResponse
from .alerte import AlerteCreate, AlerteResponse
from .dashboard import DashboardResponse
from .repartition import RepartitionCreate, RepartitionUpdate, RepartitionResponse
