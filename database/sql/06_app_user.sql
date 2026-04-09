

-- =====================================================
-- BARRAGE FLOW MANAGER
-- Fichier : 06_app_user.sql
-- Blue Team — Tâche 10 : Permissions MySQL minimales
-- Défenseurs : HRIMICH Reda, IGHRANE Imane
-- =====================================================

-- 🔴 PROBLÈME : L'application utilise 'root' comme utilisateur MySQL.
-- root possède GRANT ALL PRIVILEGES = accès total à toute la base.
-- En cas de compromission de l'API, l'attaquant contrôle toute la BDD.
-- RISQUE : CRITIQUE

-- CORRECTION : Créer un utilisateur applicatif avec droits minimaux
-- L'app n'a besoin que de lire et écrire des données, pas de modifier la structure.

-- Étape 1 : Créer l'utilisateur applicatif
CREATE USER IF NOT EXISTS 'barrage_app'@'%' IDENTIFIED BY 'AppSecure2024!';

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON barrage_flow_db_AI_Version.* TO 'barrage_app'@'%';
FLUSH PRIVILEGES;

