# backend/app/main.py
from app.routes import auth, users, dashboard, alerts, lacher_eau
from app.routes import repartition

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Barrage Flow Manager API",
    description="API REST pour la gestion et la supervision du barrage.",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",  # frontend (Vite)
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)
app.include_router(repartition.router)
app.include_router(lacher_eau.router)

@app.get("/")
def root():
    return {"message": "API is running"}