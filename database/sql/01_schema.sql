-- =====================================================
-- 1. TABLE BARRAGE
-- =====================================================
CREATE TABLE Barrage (
    id_barrage INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    capacite_max DECIMAL(15,2) NOT NULL CHECK (capacite_max > 0),
    niveau_actuel DECIMAL(15,2) NOT NULL CHECK (niveau_actuel >= 0),
    seuil_critique DECIMAL(15,2) NOT NULL CHECK (seuil_critique >= 0),
    
    INDEX idx_barrage_nom (nom),
    INDEX idx_barrage_niveau (niveau_actuel),
    
    CONSTRAINT chk_niveau_valid CHECK (niveau_actuel <= capacite_max)
) ENGINE=InnoDB;

-- =====================================================
-- 8. TABLE REPARTITION
-- =====================================================
CREATE TABLE Repartition (
    id_repartition INT PRIMARY KEY AUTO_INCREMENT,
    id_lacher INT NOT NULL,
    id_coop INT NOT NULL,
    volume_attribue DECIMAL(15,2) NOT NULL,

    CONSTRAINT fk_rep_lacher
        FOREIGN KEY (id_lacher) REFERENCES Lacher_Eau(id_lacher)
        ON DELETE CASCADE,

    CONSTRAINT fk_rep_coop
        FOREIGN KEY (id_coop) REFERENCES Cooperative(id_coop)
        ON DELETE CASCADE,

    -- éviter doublons (important)
    CONSTRAINT unique_lacher_coop UNIQUE (id_lacher, id_coop),

    INDEX idx_rep_lacher (id_lacher),
    INDEX idx_rep_coop (id_coop)
) ENGINE=InnoDB;

-- =====================================================
-- 2. TABLE UTILISATEUR
-- =====================================================
CREATE TABLE Utilisateur (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('admin', 'gestionnaire', 'agriculteur', 'technicien') 
        NOT NULL DEFAULT 'agriculteur',
    
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- =====================================================
-- 3. TABLE COOPERATIVE
-- =====================================================
CREATE TABLE Cooperative (
    id_coop INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    surface_agricole DECIMAL(15,2) NOT NULL CHECK (surface_agricole > 0),
    historique_consommation DECIMAL(15,2) NOT NULL DEFAULT 0 
        CHECK (historique_consommation >= 0),
    
    INDEX idx_coop_nom (nom)
) ENGINE=InnoDB;

-- =====================================================
-- 4. TABLE DEMANDE_IRRIGATION
-- =====================================================
CREATE TABLE Demande_Irrigation (
    id_demande INT PRIMARY KEY AUTO_INCREMENT,
    date_demande DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    volume_demande DECIMAL(15,2) NOT NULL CHECK (volume_demande > 0),
    statut ENUM('en_attente', 'approuvee', 'refusee', 'en_cours', 'terminee') 
        NOT NULL DEFAULT 'en_attente',
    id_user INT NOT NULL,
    id_coop INT NOT NULL,
    
    CONSTRAINT fk_demande_user 
        FOREIGN KEY (id_user) REFERENCES Utilisateur(id_user),
    CONSTRAINT fk_demande_coop 
        FOREIGN KEY (id_coop) REFERENCES Cooperative(id_coop),
    
    INDEX idx_demande_date (date_demande),
    INDEX idx_demande_user (id_user),
    INDEX idx_demande_coop (id_coop),
    INDEX idx_demande_statut_date (statut, date_demande)
) ENGINE=InnoDB;

-- =====================================================
-- 5. TABLE LACHER_EAU
-- =====================================================
CREATE TABLE Lacher_Eau (
    id_lacher INT PRIMARY KEY AUTO_INCREMENT,
    date_lacher DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    volume DECIMAL(15,2) NOT NULL CHECK (volume > 0),
    statut ENUM('planifie', 'en_cours', 'termine', 'annule') 
        NOT NULL DEFAULT 'planifie',
    id_demande INT,
    id_user INT NOT NULL,
    id_barrage INT NOT NULL,
    
    CONSTRAINT fk_lacher_demande 
        FOREIGN KEY (id_demande) REFERENCES Demande_Irrigation(id_demande) 
        ON DELETE SET NULL,
    CONSTRAINT fk_lacher_user 
        FOREIGN KEY (id_user) REFERENCES Utilisateur(id_user),
    CONSTRAINT fk_lacher_barrage 
        FOREIGN KEY (id_barrage) REFERENCES Barrage(id_barrage),
    
    INDEX idx_lacher_date (date_lacher),
    INDEX idx_lacher_statut (statut),
    INDEX idx_lacher_user (id_user),
    INDEX idx_lacher_barrage_date (id_barrage, date_lacher)
) ENGINE=InnoDB;

-- =====================================================
-- 6. TABLE ALERTE
-- =====================================================
CREATE TABLE Alerte (
    id_alerte INT PRIMARY KEY AUTO_INCREMENT,
    type_alerte ENUM('niveau_critique', 'seuil_bas', 'inondation_risque', 'maintenance', 'systeme') NOT NULL DEFAULT 'systeme',
    message VARCHAR(500) NOT NULL,
    date_alerte DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_barrage INT NOT NULL,
    
    CONSTRAINT fk_alerte_barrage 
        FOREIGN KEY (id_barrage) REFERENCES Barrage(id_barrage) 
        ON DELETE CASCADE,
    
    INDEX idx_alerte_date (date_alerte),
    INDEX idx_alerte_type (type_alerte),
    INDEX idx_alerte_barrage_date (id_barrage, date_alerte)
) ENGINE=InnoDB;
