-- =====================================================
-- PROCEDURES STOCKEES
-- =====================================================

DELIMITER $$

-- =====================================================
-- PROCEDURE 1 : Répartition de l'eau
-- =====================================================
CREATE PROCEDURE sp_repartir_eau(IN p_id_lacher INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_volume_total DECIMAL(15,2);
    DECLARE v_surface_totale DECIMAL(15,2);
    DECLARE v_id_coop INT;
    DECLARE v_surface DECIMAL(15,2);
    DECLARE v_volume_attribue DECIMAL(15,2);

    -- CURSOR
    DECLARE cur_coop CURSOR FOR 
        SELECT id_coop, surface_agricole FROM Cooperative;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- 1. Récupérer volume total
    SELECT volume INTO v_volume_total
    FROM Lacher_Eau
    WHERE id_lacher = p_id_lacher;

    -- 2. Calcul surface totale
    SELECT SUM(surface_agricole) INTO v_surface_totale
    FROM Cooperative;

    -- 3. Boucle sur coopératives
    OPEN cur_coop;

    read_loop: LOOP
        FETCH cur_coop INTO v_id_coop, v_surface;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Calcul proportionnel
        SET v_volume_attribue = v_volume_total * (v_surface / v_surface_totale);

        -- INSERT (⚠️ suppose table repartition existe)
        INSERT INTO Repartition (id_lacher, id_coop, volume_attribue)
        VALUES (p_id_lacher, v_id_coop, v_volume_attribue);

    END LOOP;

    CLOSE cur_coop;

END$$


-- =====================================================
-- PROCEDURE 2 : Dashboard stats
-- =====================================================
CREATE PROCEDURE sp_dashboard_stats()
BEGIN

    SELECT 
        b.niveau_actuel,
        (b.niveau_actuel / b.capacite_max) * 100 AS pourcentage_remplissage,

        -- nombre alertes critiques
        (SELECT COUNT(*) 
         FROM Alerte 
         WHERE type_alerte = 'niveau_critique') AS nb_alertes_critiques,

        -- demandes en attente
        (SELECT COUNT(*) 
         FROM Demande_Irrigation 
         WHERE statut = 'en_attente') AS nb_demandes_en_attente

    FROM Barrage b
    LIMIT 1;

END$$

DELIMITER ;