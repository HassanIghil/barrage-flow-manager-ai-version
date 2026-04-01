import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.core.security import hash_password
from app.main import app
from app.models import user as user_models
from app.models.user import User, UserRole


SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine, tables=[user_models.User.__table__])

    db = TestingSessionLocal()
    db.add_all(
        [
            User(
                nom="Directeur Test",
                email="directeur@barrage.ma",
                password=hash_password("123456"),
                role=UserRole.Directeur,
            ),
            User(
                nom="Gestionnaire Test",
                email="gestionnaire@barrage.ma",
                password=hash_password("123456"),
                role=UserRole.Gestionnaire,
            ),
        ]
    )
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def login(client: TestClient, email: str, password: str) -> str:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def test_root_route(client: TestClient):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "API is running"}


def test_login_success_returns_token_and_role(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"email": "directeur@barrage.ma", "password": "123456"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["role"] == "Directeur"
    assert body["access_token"]


def test_login_rejects_invalid_credentials(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"email": "directeur@barrage.ma", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_me_returns_current_user(client: TestClient):
    token = login(client, "directeur@barrage.ma", "123456")

    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "directeur@barrage.ma"
    assert response.json()["role"] == "Directeur"


def test_me_requires_token(client: TestClient):
    response = client.get("/api/users/me")

    assert response.status_code == 401


def test_register_allows_directeur(client: TestClient):
    token = login(client, "directeur@barrage.ma", "123456")

    response = client.post(
        "/api/users/register",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "nom": "Nouvel Agriculteur",
            "email": "agriculteur@barrage.ma",
            "password": "abcdef",
            "role": "Agriculteur",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "agriculteur@barrage.ma"
    assert body["role"] == "Agriculteur"
    assert "password" not in body


def test_register_rejects_non_directeur(client: TestClient):
    token = login(client, "gestionnaire@barrage.ma", "123456")

    response = client.post(
        "/api/users/register",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "nom": "Utilisateur Refuse",
            "email": "refuse@barrage.ma",
            "password": "abcdef",
            "role": "Agriculteur",
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Access forbidden"


def test_register_rejects_duplicate_email(client: TestClient):
    token = login(client, "directeur@barrage.ma", "123456")

    response = client.post(
        "/api/users/register",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "nom": "Dup User",
            "email": "gestionnaire@barrage.ma",
            "password": "abcdef",
            "role": "Agriculteur",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Email already exists"


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-q"]))
