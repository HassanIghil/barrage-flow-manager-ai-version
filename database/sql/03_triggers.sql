DELIMITER //

-- Trigger 1 : trg_before_lacher_check_seuil
-- Objectif : Bloquer le lâcher SI le résultat final passerait sous le seuil
CREATE TRIGGER trg_before_lacher_check_seuil
BEFORE INSERT ON Lacher_Eau
FOR EACH ROW
BEGIN
    DECLARE v_niveau DECIMAL(15,2);
    DECLARE v_seuil DECIMAL(15,2);

    -- 1. Récupérer le niveau actuel et le seuil
    SELECT niveau_actuel, seuil_critique INTO v_niveau, v_seuil
    FROM Barrage
    WHERE id_barrage = NEW.id_barrage;

    -- 2. Vérification prévisionnelle (Niveau futur < Seuil)
    IF (v_niveau - NEW.volume) < v_seuil THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lâcher refusé : le niveau passerait sous le seuil de sécurité';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_after_lacher_update_niveau
AFTER INSERT ON Lacher_Eau
FOR EACH ROW
BEGIN
    -- Mise à jour du niveau uniquement si le lacher est 'termine'
    IF NEW.statut = 'termine' THEN
        UPDATE Barrage 
        SET niveau_actuel = niveau_actuel - NEW.volume 
        WHERE id_barrage = NEW.id_barrage;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_after_barrage_genere_alerte
AFTER UPDATE ON Barrage
FOR EACH ROW
BEGIN
    -- 1. Alerte 'seuil_bas' (Warning) : si le niveau est à moins de 20% au-dessus du seuil
    IF NEW.niveau_actuel < (NEW.seuil_critique * 1.2) AND NEW.niveau_actuel > NEW.seuil_critique THEN
        INSERT INTO Alerte (type_alerte, message, id_barrage)
        VALUES ('seuil_bas', 
                CONCAT('Attention : Le niveau du barrage ', NEW.nom, ' approche du seuil critique (Zone Orange).'), 
                NEW.id_barrage);
    END IF;

    -- 2. Alerte 'niveau_critique' (Critique) : si le niveau est inférieur au seuil
    IF NEW.niveau_actuel <= NEW.seuil_critique THEN
        INSERT INTO Alerte (type_alerte, message, id_barrage)
        VALUES ('niveau_critique', 
                CONCAT('Urgence : Le niveau du barrage ', NEW.nom, ' est sous le seuil de sécurité !'), 
                NEW.id_barrage);
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER trg_before_demande_check_coop
BEFORE INSERT ON Demande_Irrigation
FOR EACH ROW
BEGIN
    DECLARE v_surface DECIMAL(15,2);

    -- 1. Récupérer la surface de la coopérative pour vérifier son activité
    SELECT surface_agricole INTO v_surface
    FROM Cooperative
    WHERE id_coop = NEW.id_coop;

    -- 2. Si la surface est nulle ou négative, on considère la coopérative inactive
    IF v_surface <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Opération refusée : Coopérative inactive (surface agricole nulle).';
    END IF;
END //

DELIMITER ;
