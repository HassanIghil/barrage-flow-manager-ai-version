from fastapi import APIRouter, Depends, HTTPException,Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserLogin
from app.models.user import User
from app.core.security import verify_password, create_access_token

#Initialisation du limiteur par adresse IP
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/login")
#Max 5 tentatives par minute par IP
@limiter.limit("5/minute")
def login(request: Request, user_data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == user_data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role.value
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role.value
    }