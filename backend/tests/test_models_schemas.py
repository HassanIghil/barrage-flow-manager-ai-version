# backend/tests/test_models_schemas.py

import pytest
from decimal import Decimal
from datetime import datetime
from pydantic import ValidationError

# Test SQLAlchemy models
def test_user_model(db_session):
    """Test: db.query(User).first() fonctionne"""
    from app.models.user import User
    
    user = db_session.query(User).first()
    assert user is not None
    assert user.email is not None
    print(f"✅ User trouvé: {user.nom} ({user.email})")

def test_barrage_model(db_session):
    """Test: db.query(Barrage).first() fonctionne"""
    from app.models.barrage import Barrage
    
    barrage = db_session.query(Barrage).first()
    assert barrage is not None
    assert barrage.nom == "Youssef Ibn Tachfine"
    print(f"✅ Barrage trouvé: {barrage.nom}")

# Test Pydantic schemas - Validation positive
def test_release_request_valid():
    """Test: ReleaseRequest avec volume valide"""
    from app.schemas.lacher_eau import ReleaseRequest
    
    request = ReleaseRequest(
        volume_m3=Decimal("50000.00"),
        id_barrage=1,
        motif="Test irrigation"
    )
    assert request.volume_m3 == Decimal("50000.00")
    print("✅ ReleaseRequest valide accepté")

# Test Pydantic schemas - Validation négative (doit rejeter)
def test_release_request_invalid_volume():
    """Test: ReleaseRequest avec volume négatif doit être rejeté"""
    from app.schemas.lacher_eau import ReleaseRequest
    
    with pytest.raises(ValidationError) as exc_info:
        ReleaseRequest(
            volume_m3=Decimal("-10"),  # Volume négatif!
            id_barrage=1,
            motif="Test invalide"
        )
    
    assert "volume_m3" in str(exc_info.value) or "volume" in str(exc_info.value)
    print("✅ ReleaseRequest avec volume négatif correctement rejeté!")
    print(f"   Erreur: {exc_info.value}")

# Test UserLogin
def test_user_login_schema():
    """Test: UserLogin valide"""
    from app.schemas.user import UserLogin
    
    login = UserLogin(
        email="test@barrage.ma",
        password="password123"
    )
    assert login.email == "test@barrage.ma"
    print("✅ UserLogin valide")

# Test avec volume = 0 (doit être rejeté)
def test_release_request_zero_volume():
    """Test: ReleaseRequest avec volume = 0 doit être rejeté"""
    from app.schemas.lacher_eau import ReleaseRequest
    
    with pytest.raises(ValidationError) as exc_info:
        ReleaseRequest(
            volume_m3=Decimal("0"),
            id_barrage=1,
            motif="Test volume zero"
        )
    
    print("✅ ReleaseRequest avec volume=0 correctement rejeté!")

if __name__ == "__main__":
    print("🧪 Tests des modèles et schémas")
    print("=" * 50)
    
    # Test Pydantic (pas besoin de DB)
    test_release_request_valid()
    test_release_request_invalid_volume()
    test_release_request_zero_volume()
    test_user_login_schema()
    
    print("\n" + "=" * 50)
    print("✅ Tous les tests Pydantic passent!")
    print("\nPour tester les modèles SQLAlchemy:")
    print("  pytest backend/tests/test_models_schemas.py -v")