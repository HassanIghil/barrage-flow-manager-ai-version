from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#clé secrete 
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY manquante dans .env — arrêt de l'application")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

bearer_scheme = HTTPBearer(
    bearerFormat="JWT",
    description="Paste a bearer token obtained from POST /api/auth/login.",
)

#hacher le password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

#comprer le pasword saisi avec le hash en BD
def verify_password(plain_password: str, stored_password: str) -> bool:
    return pwd_context.verify(plain_password, stored_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("sub") is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

#Verifier le role 
def require_role(allowed_roles: List[str]):

    def role_checker(
        current_user: dict = Depends(get_current_user)
    ):
        user_role = current_user.get("role", "")
        if user_role.lower() not in [r.lower() for r in allowed_roles]:
            raise HTTPException(
                status_code=403,
                detail=f"Accès refusé — Rôle requis : {allowed_roles}"
            )
        return current_user
    return role_checker