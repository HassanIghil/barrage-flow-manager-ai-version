# backend/tests/test_dashboard_alerts.py
"""
Tests d'intégration pour les routes Dashboard & Alertes.

⚠️  Ces tests se connectent à la VRAIE base de données MySQL définie dans .env
    DATABASE_URL="mysql+pymysql://root:...@127.0.0.1:3306/barrage_flow_db"

Les tests NE créent PAS et NE suppriment PAS de tables.
Ils lisent uniquement les données insérées par 02_seed_data.sql.

Pour que les tests passent :
  1. Votre base MySQL doit être lancée (127.0.0.1:3306)
  2. Les scripts SQL 01_schema.sql → 05_views.sql doivent avoir été exécutés
  3. pip install python-jose cryptography httpx
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.security import create_access_token

# ─────────────────────────────────────────────
# Client FastAPI — connecté à la vraie base MySQL via .env
# ─────────────────────────────────────────────
client = TestClient(app)


# ─────────────────────────────────────────────
# Token JWT valide pour les requêtes authentifiées
# On génère le token directement (sans passer par /login)
# ─────────────────────────────────────────────
@pytest.fixture(scope="module")
def auth_headers():
    """Génère un token JWT valide pour un directeur (données seed)."""
    token = create_access_token(
        data={"sub": "directeur@barrage.ma", "role": "Directeur"}
    )
    return {"Authorization": f"Bearer {token}"}


# ─────────────────────────────────────────────
# Tests : GET /api/dashboard/overview
# Appelle la procédure stockée sp_dashboard_stats() sur MySQL
# ─────────────────────────────────────────────

def test_dashboard_overview_status_ok(auth_headers):
    """La route retourne HTTP 200."""
    response = client.get("/api/dashboard/overview", headers=auth_headers)
    assert response.status_code == 200, f"Erreur : {response.text}"
    print(f"\n✅ /api/dashboard/overview → HTTP {response.status_code}")


def test_dashboard_overview_structure(auth_headers):
    """La réponse JSON contient les champs produits par sp_dashboard_stats()."""
    response = client.get("/api/dashboard/overview", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    # Champs retournés par la procédure sp_dashboard_stats()
    assert "niveau_actuel" in data, f"Clé 'niveau_actuel' manquante dans : {data}"
    assert "pourcentage_remplissage" in data
    assert "nb_alertes_critiques" in data
    assert "nb_demandes_en_attente" in data

    print(f"\n✅ Structure JSON correcte :")
    for k, v in data.items():
        print(f"   {k}: {v}")


def test_dashboard_overview_values_are_numbers(auth_headers):
    """Les valeurs numériques retournées sont bien des nombres."""
    response = client.get("/api/dashboard/overview", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert isinstance(float(data["niveau_actuel"]), float)
    assert isinstance(float(data["pourcentage_remplissage"]), float)
    assert isinstance(int(data["nb_alertes_critiques"]), int)
    assert isinstance(int(data["nb_demandes_en_attente"]), int)
    print("\n✅ Toutes les valeurs numériques sont correctement typées")


def test_dashboard_overview_requires_auth():
    """La route est protégée — retourne 401 sans token."""
    response = client.get("/api/dashboard/overview")
    assert response.status_code == 401
    print("\n✅ Protection JWT active sur /api/dashboard/overview")


# ─────────────────────────────────────────────
# Tests : GET /api/dashboard/history
# Lit la vue v_historique_lachers depuis MySQL
# ─────────────────────────────────────────────

def test_dashboard_history_status_ok(auth_headers):
    """La route retourne HTTP 200."""
    response = client.get("/api/dashboard/history", headers=auth_headers)
    assert response.status_code == 200
    print(f"\n✅ /api/dashboard/history → HTTP {response.status_code}")


def test_dashboard_history_returns_list(auth_headers):
    """La réponse est une liste JSON."""
    response = client.get("/api/dashboard/history", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    print(f"\n✅ Historique : {len(data)} lâcher(s) retourné(s)")


def test_dashboard_history_structure(auth_headers):
    """Chaque entrée a les champs de la vue v_historique_lachers."""
    response = client.get("/api/dashboard/history", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    if not data:
        pytest.skip("Aucun lâcher d'eau en base — vérifiez 02_seed_data.sql")

    entry = data[0]
    assert "date_lacher" in entry
    assert "volume_m3" in entry
    assert "status" in entry
    assert "nom_utilisateur" in entry
    assert "nom_barrage" in entry
    print(f"\n✅ Structure de la vue v_historique_lachers correcte")
    print(f"   Exemple : {entry}")


def test_dashboard_history_requires_auth():
    """La route est protégée — retourne 401 sans token."""
    response = client.get("/api/dashboard/history")
    assert response.status_code == 401
    print("\n✅ Protection JWT active sur /api/dashboard/history")


# ─────────────────────────────────────────────
# Tests : GET /api/alerts/recent
# Lit les 10 alertes les plus récentes depuis la table Alerte
# ─────────────────────────────────────────────

def test_alerts_recent_status_ok(auth_headers):
    """La route retourne HTTP 200."""
    response = client.get("/api/alerts/recent", headers=auth_headers)
    assert response.status_code == 200
    print(f"\n✅ /api/alerts/recent → HTTP {response.status_code}")


def test_alerts_recent_returns_list(auth_headers):
    """La réponse est une liste JSON."""
    response = client.get("/api/alerts/recent", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    print(f"\n✅ Alertes récentes : {len(data)} alerte(s) retournée(s)")


def test_alerts_recent_structure(auth_headers):
    """Chaque alerte a les champs attendus."""
    response = client.get("/api/alerts/recent", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    if not data:
        pytest.skip("Aucune alerte en base — vérifiez 02_seed_data.sql")

    alerte = data[0]
    assert "id_alerte" in alerte
    assert "type" in alerte
    assert "message" in alerte
    assert "date_" in alerte
    print(f"\n✅ Structure alerte correcte")
    print(f"   Exemple : type={alerte['type']}, message={alerte['message'][:40]}...")


def test_alerts_recent_max_10(auth_headers):
    """La liste ne dépasse pas 10 résultats (LIMIT 10)."""
    response = client.get("/api/alerts/recent", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 10
    print(f"\n✅ Limite respectée : {len(data)} ≤ 10 alertes")


def test_alerts_recent_requires_auth():
    """La route est protégée — retourne 401 sans token."""
    response = client.get("/api/alerts/recent")
    assert response.status_code == 401
    print("\n✅ Protection JWT active sur /api/alerts/recent")


# ─────────────────────────────────────────────
# Tests : GET /api/alerts/critical
# Retourne uniquement les alertes de type 'niveau_critique'
# ─────────────────────────────────────────────

def test_alerts_critical_status_ok(auth_headers):
    """La route retourne HTTP 200."""
    response = client.get("/api/alerts/critical", headers=auth_headers)
    assert response.status_code == 200
    print(f"\n✅ /api/alerts/critical → HTTP {response.status_code}")


def test_alerts_critical_only_critical_type(auth_headers):
    """Chaque alerte retournée est de type 'niveau_critique'."""
    response = client.get("/api/alerts/critical", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    if not data:
        pytest.skip("Aucune alerte critique en base — vérifiez 02_seed_data.sql")

    for alerte in data:
        assert alerte["type"] == "niveau_critique", (
            f"Type inattendu : {alerte['type']}"
        )
    print(f"\n✅ {len(data)} alerte(s) critique(s) — tous les types sont 'niveau_critique'")


# ─────────────────────────────────────────────
# Tests : Repartition (Vue et Procédure)
# ─────────────────────────────────────────────

def test_repartition_view_status_ok(auth_headers):
    """La route de la vue v_repartition_detail retourne HTTP 200."""
    response = client.get("/api/repartitions/v/detail", headers=auth_headers)
    assert response.status_code == 200
    print(f"\n✅ /api/repartitions/v/detail → HTTP {response.status_code}")


def test_repartition_view_structure(auth_headers):
    """Vérifie la structure des données retournées par la vue v_repartition_detail."""
    response = client.get("/api/repartitions/v/detail", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    
    if not data:
        pytest.skip("Aucune répartition en base — vérifiez 02_seed_data.sql")
        
    entry = data[0]
    # Champs de la vue v_repartition_detail
    assert "date_lacher" in entry
    assert "volume_total" in entry
    assert "nom_cooperative" in entry
    assert "volume_attribue_m3" in entry
    assert "surface_hectares" in entry
    print(f"\n✅ Structure v_repartition_detail correcte (Ex: {entry['nom_cooperative']})")


def test_repartition_trigger_procedure(auth_headers):
    """
    Teste l'exécution de la procédure sp_repartir_eau via l'API.
    On utilise l'id_lacher=3 (planifié dans seed_data, sans répartition).
    """
    id_lacher = 3

    # --- NETTOYAGE PRÉALABLE ---
    # On supprime les répartitions existantes pour ce lâcher (cas où le test est relancé)
    # pour garantir un état propre au démarrage de l'assertion.
    check_init = client.get(f"/api/repartitions/?id_lacher={id_lacher}", headers=auth_headers)
    if check_init.status_code == 200:
        for rep in check_init.json():
            client.delete(f"/api/repartitions/{rep['id_repartition']}", headers=auth_headers)

    # 1. On vérifie maintenant qu'il n'y a plus de répartition pour ce lâcher
    check = client.get(f"/api/repartitions/?id_lacher={id_lacher}", headers=auth_headers)
    assert check.status_code == 200
    assert len(check.json()) == 0

    # 2. On déclenche la procédure
    response = client.post(f"/api/repartitions/trigger/{id_lacher}", headers=auth_headers)
    assert response.status_code == 200
    assert "message" in response.json()
    print(f"\n✅ Procédure sp_repartir_eau exécutée pour #{id_lacher}")

    # 3. On vérifie que les données ont été créées
    check_again = client.get(f"/api/repartitions/?id_lacher={id_lacher}", headers=auth_headers)
    assert check_again.status_code == 200
    assert len(check_again.json()) > 0
    print(f"✅ {len(check_again.json())} lignes de répartition créées pour #{id_lacher}")


if __name__ == "__main__":
    import pytest as _pytest
    raise SystemExit(_pytest.main([__file__, "-v", "-s"]))
