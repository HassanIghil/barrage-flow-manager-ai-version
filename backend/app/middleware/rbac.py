# backend/app/middleware/rbac.py

from fastapi import Depends, HTTPException
from app.core.security import get_current_user

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user=Depends(get_current_user)):
        # ⚠️ for now we assume token contains role
        user_role = user.get("role") if isinstance(user, dict) else None

        if user_role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Access forbidden")