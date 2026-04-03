-- =====================================================
-- BARRAGE FLOW MANAGER - AI VERSION
-- Fichier : 02_seed_data.sql
-- Données de test (Seed Data) - Compatible MPD Original
-- =====================================================

-- The database to use must be selected by the caller (no hardcoded USE here).

-- =====================================================
-- 1. INSERT BARRAGE
-- =====================================================
INSERT INTO Barrage (nom, capacite_max, niveau_actuel, seuil_critique) 
VALUES 
('Youssef Ibn Tachfine', 300000000.00, 180000000.00, 50000000.00);

-- =====================================================
-- 2. INSERT UTILISATEURS (4 utilisateurs)
-- =====================================================
-- 1 Directeur (admin), 2 Ingénieurs (gestionnaire), 1 Opérateur (technicien)
INSERT INTO Utilisateur (nom, email, password, role) 
VALUES 
('Mohamed Benali', 'directeur@barrage.ma', 'password', 'admin'),
('Fatima El Amrani', 'ingenieur1@barrage.ma', 'password', 'gestionnaire'),
('Karim Ouazzani', 'ingenieur2@barrage.ma', 'password', 'gestionnaire'),
('Ahmed Tahiri', 'operateur@barrage.ma', 'password', 'technicien');

-- =====================================================
-- 3. INSERT COOPÉRATIVES AGRICOLES (5 coopératives Souss-Massa)
-- =====================================================
INSERT INTO Cooperative (nom, surface_agricole, historique_consommation) 
VALUES 
('Cooperative Agricole Tamaloute', 450.50, 1250000.00),
('Cooperative El Firdaous', 320.75, 980000.00),
('Cooperative Agricole Oued Souss', 580.00, 2100000.00),
('Cooperative Al Amal', 210.25, 750000.00),
('Cooperative Targa n Touchka', 395.00, 1100000.00);

-- =====================================================
-- 4. INSERT DEMANDES D'IRRIGATION (4 demandes)
-- =====================================================
-- 2 approuvées, 1 en attente, 1 refusée
INSERT INTO Demande_Irrigation (date_demande, volume_demande, statut, id_user, id_coop) 
VALUES 
('2024-03-01 08:30:00', 50000.00, 'approuvee', 2, 1),
('2024-03-05 10:15:00', 75000.00, 'approuvee', 3, 2),
('2024-03-10 09:00:00', 30000.00, 'en_attente', 4, 3),
('2024-03-12 14:30:00', 120000.00, 'refusee', 4, 4);

-- =====================================================
-- 5. INSERT LÂCHERS D'EAU (3 lâchers)
-- =====================================================
-- 1 normal (termine), 1 urgence (termine), 1 en attente (planifie)
-- Note: pas de champ 'type' dans cette version, on utilise les statuts
INSERT INTO Lacher_Eau (date_lacher, volume, statut, id_demande, id_user, id_barrage) 
VALUES 
('2024-03-02 06:00:00', 50000.00, 'termine', 1, 2, 1),
('2024-03-06 05:30:00', 75000.00, 'termine', 2, 3, 1),
('2024-03-15 07:00:00', 45000.00, 'planifie', NULL, 4, 1);

-- =====================================================
-- 6. INSERT ALERTES (3 alertes)
-- =====================================================
-- 1 critique, 1 warning (seuil_bas), 1 info (systeme)
INSERT INTO Alerte (type_alerte, message, date_alerte, id_barrage) 
VALUES 
('niveau_critique', 'Niveau d''eau critique atteint - Seuil de securite approchant', '2024-03-20 03:45:00', 1),
('seuil_bas', 'Niveau eau bas - Reduction recommandee des lachers planifies', '2024-03-18 08:00:00', 1),
('systeme', 'Maintenance programmee des vannes le 25/03/2024', '2024-03-15 10:00:00', 1);

-- =====================================================
-- 7. INSERT REPARTITION
-- =====================================================
-- Distribution proportionnelle par surface agricole (surface totale = 1956.50 ha)
-- Lacher 1 (id_lacher=1, volume=50000 m³, statut='termine')
INSERT INTO Repartition (id_lacher, id_coop, volume_attribue)
VALUES
(1, 1, 11511.11),  -- Coop Tamaloute    450.50 ha → 23.03%
(1, 2,  8196.44),  -- Coop El Firdaous  320.75 ha → 16.39%
(1, 3, 14827.74),  -- Coop Oued Souss   580.00 ha → 29.65%
(1, 4,  5373.55),  -- Coop Al Amal      210.25 ha → 10.75%
(1, 5, 10091.16),  -- Coop Targa        395.00 ha → 20.19%

-- Lacher 2 (id_lacher=2, volume=75000 m³, statut='termine')
(2, 1, 17266.67),  -- Coop Tamaloute    450.50 ha
(2, 2, 12294.65),  -- Coop El Firdaous  320.75 ha
(2, 3, 22241.62),  -- Coop Oued Souss   580.00 ha
(2, 4,  8060.33),  -- Coop Al Amal      210.25 ha
(2, 5, 15136.73);  -- Coop Targa        395.00 ha