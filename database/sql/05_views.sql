-- =====================================================
-- VUES SQL
-- =====================================================

-- =====================================================
-- 1. Vue : Historique des lâchers
-- =====================================================
CREATE OR REPLACE VIEW v_historique_lachers AS
SELECT 
    l.date_lacher,
    l.volume AS volume_m3,
    l.statut AS status,
    u.nom AS nom_utilisateur,
    b.nom AS nom_barrage
FROM Lacher_Eau l
JOIN Utilisateur u ON l.id_user = u.id_user
JOIN Barrage b ON l.id_barrage = b.id_barrage
ORDER BY l.date_lacher DESC;


-- =====================================================
-- 2. Vue : Demandes actives (en attente)
-- =====================================================
CREATE OR REPLACE VIEW v_demandes_actives AS
SELECT 
    d.date_demande,
    d.volume_demande AS volume_demande_m3,
    d.statut AS status,
    c.nom AS nom_cooperative,
    u.nom AS nom_utilisateur_traite
FROM Demande_Irrigation d
JOIN Cooperative c ON d.id_coop = c.id_coop
JOIN Utilisateur u ON d.id_user = u.id_user
WHERE d.statut = 'en_attente';


-- =====================================================
-- 3. Vue : Détail répartition
-- =====================================================
CREATE OR REPLACE VIEW v_repartition_detail AS
SELECT 
    l.date_lacher,
    l.volume AS volume_total,
    c.nom AS nom_cooperative,
    r.volume_attribue AS volume_attribue_m3,
    c.surface_agricole AS surface_hectares
FROM Repartition r
JOIN Lacher_Eau l ON r.id_lacher = l.id_lacher
JOIN Cooperative c ON r.id_coop = c.id_coop;