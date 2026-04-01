from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole
from sqlalchemy import select

db = SessionLocal()

users = [
    User(
        nom="Mohamed Benali",
        email="directeur@barrage.ma",
        password=hash_password("123456"),
        role=UserRole.admin
    ),
    User(
        nom="Fatima El Amrani",
        email="ingenieur1@barrage.ma",
        password=hash_password("123456"),
        role=UserRole.gestionnaire
    ),
    User(
        nom="Karim Ouazzani",
        email="ingenieur2@barrage.ma",
        password=hash_password("123456"),
        role=UserRole.gestionnaire
    ),
    User(
        nom="Ahmed Tahiri",
        email="operateur@barrage.ma",
        password=hash_password("123456"),
        role=UserRole.technicien
    ),
]

existing_emails = {
    email for email in db.scalars(select(User.email)).all()
}
users_to_insert = [user for user in users if user.email not in existing_emails]

db.add_all(users_to_insert)
db.commit()
db.close()

print(f"Seed completed ({len(users_to_insert)} users added)")
