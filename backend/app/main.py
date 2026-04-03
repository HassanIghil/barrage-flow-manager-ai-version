# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, dashboard, alerts

app = FastAPI(title="Barrage Flow Manager API")

origins = [
    "http://localhost:5173",  # frontend (Vite)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(alerts.router)
from app.routes import releases
app.include_router(releases.router)

@app.get("/")
def root():
    return {"message": "Barrage Flow Manager API is running"}