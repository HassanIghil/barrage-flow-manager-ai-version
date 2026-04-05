from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, dashboard, alerts, repartition, releases

app = FastAPI(title="Barrage Flow Manager API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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
app.include_router(releases.router)


@app.get("/")
def root():
    return {"message": "Barrage Flow Manager API is running"}
