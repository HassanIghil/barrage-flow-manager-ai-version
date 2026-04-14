# Rapport Académique de Projet
## Barrage-Flow Manager — Version Intelligence Artificielle
### Système de Gestion des Lâchers d'Eau du Barrage Youssef Ibn Tachfine

---

**Université :** Université Ibn Zohr — Faculté des Sciences Appliquées, Souss-Massa  
**Module :** Systèmes d'Information et Bases de Données (SIBD) — 2025-2026  
**Encadrant :** Pr. S. EL-ATEIF  
**Équipe — Version IA (Équipe 6) :**  
- INAK Samia  
- IRHIL Oussama  
- ISLAOUINE Mouad  

**Pôle Sécurité & Qualité :**  
- Red Team : HARBECH M., HARBOUS Moncif  
- Blue Team : HRIMICH Reda, IGHRANE Imane  
- QA : ISKANDER El Mahdi, JAIT Reda  

**Date de remise :** Avril 2026

---

## Table des Matières

1. [Introduction](#1-introduction)
2. [Présentation Générale du Projet](#2-présentation-générale-du-projet)
3. [Analyse des Besoins](#3-analyse-des-besoins)
4. [Modélisation des Données](#4-modélisation-des-données)
5. [Conception du Système](#5-conception-du-système)
6. [Conception de l'Interface Utilisateur](#6-conception-de-linterface-utilisateur)
7. [Implémentation](#7-implémentation)
8. [Base de Données](#8-base-de-données)
9. [Tests et Validation](#9-tests-et-validation)
10. [Sécurité](#10-sécurité)
11. [Déploiement](#11-déploiement)
12. [Conclusion](#12-conclusion)
13. [Annexes](#13-annexes)

---

## 1. Introduction

### 1.1 Contexte

La région de Souss-Massa, au sud du Maroc, est une zone à vocation agricole intense, fortement dépendante de la ressource en eau pour le maintien de ses activités maraîchères et fruitières. Le Barrage Youssef Ibn Tachfine constitue l'une des infrastructures hydrauliques les plus stratégiques de cette région : il assure à la fois l'alimentation en eau potable (AEP) des populations riveraines et l'approvisionnement en eau d'irrigation des coopératives agricoles locales.

Face aux épisodes de sécheresse récurrents et à la pression grandissante sur la ressource hydrique, la gestion manuelle des lâchers d'eau est devenue insuffisante pour garantir un équilibre optimal entre les besoins agricoles et les réserves vitales. Le gestionnaire du barrage doit quotidiennement arbitrer entre de multiples demandes d'irrigation tout en veillant à ce que le niveau du barrage ne descende jamais sous le seuil de sécurité de l'AEP. Cette complexité justifie pleinement le recours à un système d'information moderne et performant.

Le présent projet s'inscrit dans ce contexte en proposant le développement d'un **Système de Gestion des Lâchers d'Eau** (Barrage-Flow Manager), une application web full-stack conçue et réalisée dans le cadre du module SIBD de l'année universitaire 2025-2026. Ce projet est également remarquable par sa dimension comparative : il est développé en parallèle par deux équipes distinctes, l'une adoptant une approche artisanale « manuelle », l'autre — objet de ce rapport — tirant parti des outils d'**Intelligence Artificielle** pour accélérer et fiabiliser les phases de conception et de développement.

### 1.2 Problématique

La problématique centrale du projet peut se formuler de la façon suivante :

> *Comment concevoir et implémenter un système d'information web permettant d'automatiser et de sécuriser la gestion des lâchers d'eau d'un barrage, tout en assurant un arbitrage équitable entre les besoins agricoles et la préservation des réserves vitales d'eau potable ?*

Cette problématique soulève plusieurs sous-questions techniques et organisationnelles :
- Comment modéliser fidèlement les entités du domaine hydraulique (barrage, coopératives, lâchers, alertes) selon la méthodologie MERISE ?
- Comment garantir qu'aucun lâcher d'eau ne puisse faire descendre le niveau en dessous du seuil critique, même en cas d'erreur humaine ?
- Comment contrôler finement les droits d'accès selon les rôles des utilisateurs (Directeur, Gestionnaire, Technicien) ?
- Comment offrir une interface de pilotage claire et réactive permettant une prise de décision en temps réel ?

### 1.3 Objectifs du Projet

Les objectifs du projet sont structurés autour de quatre axes principaux :

1. **Protection des réserves vitales** : Mettre en place des mécanismes algorithmiques et des déclencheurs (triggers) de base de données empêchant tout lâcher d'eau susceptible de faire descendre le niveau du barrage sous le seuil critique de l'AEP.

2. **Équité de répartition** : Développer un algorithme de distribution proportionnelle de l'eau entre les coopératives agricoles, tenant compte de la surface agricole de chacune et de son historique de consommation.

3. **Aide à la décision** : Mettre à disposition des gestionnaires un tableau de bord analytique temps réel affichant les indicateurs hydrauliques clés (niveau actuel, pourcentage de remplissage, alertes, demandes en attente).

4. **Sécurité des accès (RBAC)** : Implémenter une hiérarchie de contrôle stricte garantissant que seules les personnes autorisées peuvent déclencher ou forcer des actions critiques, en particulier les lâchers d'urgence.

### 1.4 Méthodologie Adoptée

La méthodologie de développement choisie est de type **incrémental et itératif**, organisée en cinq phases successives :

1. **Phase de Conception** : Application de la méthode MERISE pour élaborer le Modèle Conceptuel de Données (MCD), le Modèle Logique de Données (MLD) et le Modèle Physique de Données (MPD).
2. **Phase Base de Données** : Écriture des scripts SQL (schéma, triggers, procédures stockées, vues, données de test).
3. **Phase de Développement** : Développement du backend FastAPI et du frontend React, assisté par des outils d'Intelligence Artificielle.
4. **Phase d'Audit & Qualité** : Tests de sécurité (Red Team / Blue Team) et tests fonctionnels (QA).
5. **Phase de Livraison** : Déploiement, documentation et soutenance finale en Avril 2026.

L'ensemble du projet est versionné sur GitHub avec un workflow de branches strict (Pull Requests + approbation du chef de projet), et les communications d'équipe sont centralisées sur Slack.

---

## 2. Présentation Générale du Projet

### 2.1 Description du Site Web

Barrage-Flow Manager est une **application web full-stack** dédiée à la gestion opérationnelle du Barrage Youssef Ibn Tachfine, situé dans la province de Tiznit (région Souss-Massa, Maroc). L'application offre une interface de pilotage centralisée, accessible via un navigateur web standard, permettant aux différents acteurs impliqués dans la gestion hydraulique d'interagir avec le système de façon sécurisée et traçable.

L'application est architecturée selon un modèle **client-serveur** moderne : un frontend React communique avec un backend FastAPI via une API REST, elle-même connectée à une base de données MySQL. L'ensemble est conteneurisé avec Docker pour garantir un déploiement reproductible et portable. L'interface est accessible sur `http://localhost:5173` (frontend) et les services API sur `http://localhost:8000/docs` (documentation Swagger interactive).

Le système distingue deux grandes catégories de fonctionnalités : la **consultation** (tableau de bord, historique des lâchers, alertes) et l'**action** (demande de lâcher, approbation, exécution forcée). L'accès à chaque fonctionnalité est conditionné par le rôle de l'utilisateur authentifié.

### 2.2 Fonctionnalités Principales

Le système offre les fonctionnalités suivantes :

- **Authentification sécurisée** : Connexion via email/mot de passe avec génération d'un token JWT (JSON Web Token) à durée limitée (60 minutes).
- **Tableau de bord analytique** : Visualisation en temps réel du niveau actuel du barrage, du pourcentage de remplissage, du nombre d'alertes critiques et des demandes en attente.
- **Gestion des lâchers d'eau** : Création de demandes de lâcher par les gestionnaires, validation et exécution par le Directeur ou l'Admin. Chaque lâcher déclenche automatiquement l'algorithme de répartition proportionnelle entre les coopératives.
- **Gestion des coopératives** : Consultation de la liste des coopératives agricoles avec leur surface et leur historique de consommation, affichage cartographique via Leaflet.js.
- **Système d'alertes** : Génération automatique d'alertes par des triggers MySQL (seuil bas, niveau critique, maintenance, système).
- **Contrôle d'accès par rôles (RBAC)** : Cinq rôles distincts (Admin, Directeur, Gestionnaire, Technicien, Agriculteur) avec des permissions granulaires sur chaque endpoint.
- **Répartition automatique de l'eau** : Procédure stockée SQL calculant la part d'eau attribuée à chaque coopérative proportionnellement à sa surface agricole.

### 2.3 Importance du Projet

Ce projet revêt une importance à plusieurs niveaux. Sur le plan **environnemental et social**, il répond directement aux enjeux de gestion durable des ressources en eau dans une région confrontée au stress hydrique. En automatisant les contrôles de sécurité et en objectivant la répartition de l'eau, il contribue à réduire les conflits d'usage et à protéger les réserves d'eau potable.

Sur le plan **académique**, ce projet permet d'appliquer concrètement l'ensemble des concepts enseignés dans le module SIBD : modélisation MERISE, conception de bases de données relationnelles, triggers et procédures stockées, architecture MVC, développement web full-stack, sécurité des applications. Il constitue également une expérience pionnière dans l'utilisation de l'IA comme outil de productivité dans le développement logiciel, avec une comparaison rigoureuse de la qualité produite par rapport à une approche entièrement manuelle.

Sur le plan **technologique**, il illustre les meilleures pratiques modernes du développement : API REST documentée, typage fort (TypeScript), validation des données (Pydantic), authentification sans état (JWT), containerisation (Docker), et intégration continue (GitHub Actions).

---

## 3. Analyse des Besoins

### 3.1 Besoins Fonctionnels

L'analyse des besoins fonctionnels a été réalisée en consultant les différents profils d'utilisateurs du système. Les besoins identifiés sont les suivants :

**BF-01 — Authentification et Gestion de Session**
- L'utilisateur doit pouvoir se connecter avec son adresse e-mail et son mot de passe.
- Le système doit délivrer un token JWT en cas de succès et rejeter la connexion en cas d'identifiants invalides.
- La session doit expirer automatiquement après 60 minutes d'inactivité.
- L'utilisateur doit pouvoir se déconnecter à tout moment.

**BF-02 — Tableau de Bord**
- Le système doit afficher en temps réel le niveau actuel du barrage en m³ et en pourcentage.
- Le tableau de bord doit afficher le nombre d'alertes critiques actives.
- Le tableau de bord doit afficher le nombre de demandes d'irrigation en attente de traitement.
- Un graphique d'évolution du niveau du barrage dans le temps doit être disponible.

**BF-03 — Gestion des Lâchers d'Eau**
- Un Gestionnaire ou un Admin doit pouvoir créer une demande de lâcher en précisant le volume en m³ et le barrage concerné.
- Seul le Directeur ou l'Admin peut exécuter (valider) un lâcher planifié.
- L'exécution d'un lâcher doit être bloquée si le niveau résultant passerait sous le seuil critique.
- Chaque lâcher exécuté doit déclencher automatiquement la procédure de répartition entre coopératives.

**BF-04 — Gestion des Coopératives Agricoles**
- Le système doit maintenir une liste des coopératives avec leur nom, surface agricole et historique de consommation.
- La liste des coopératives doit être accessible à tout utilisateur authentifié.
- Un affichage cartographique des coopératives doit être disponible via Leaflet.js.

**BF-05 — Système d'Alertes**
- Le système doit générer automatiquement une alerte de type « seuil_bas » (zone orange) quand le niveau descend entre le seuil critique et 1,2× le seuil critique.
- Le système doit générer automatiquement une alerte de type « niveau_critique » quand le niveau descend en dessous ou atteint le seuil critique.
- Les alertes doivent être consultables par tout utilisateur authentifié.

**BF-06 — Gestion des Utilisateurs**
- L'Admin doit pouvoir créer, lire, mettre à jour et supprimer des comptes utilisateurs.
- Chaque utilisateur doit être associé à un rôle parmi : Admin, Directeur, Gestionnaire, Technicien, Agriculteur.

**BF-07 — Répartition de l'Eau**
- Le système doit calculer automatiquement la part d'eau attribuée à chaque coopérative proportionnellement à sa surface agricole.
- Le résultat de chaque répartition doit être enregistré dans la table `Repartition`.

### 3.2 Besoins Non Fonctionnels

**BNF-01 — Performance**
- Le temps de réponse de l'API doit être inférieur à 500 ms pour 95% des requêtes dans des conditions normales d'utilisation.
- Le tableau de bord doit se charger en moins de 2 secondes sur une connexion standard.
- La base de données doit être optimisée avec des index sur les colonnes fréquemment interrogées (date, statut, rôle).

**BNF-02 — Sécurité**
- Tous les mots de passe doivent être stockés sous forme hachée (passlib + bcrypt).
- Toutes les communications entre le frontend et le backend doivent transiter par HTTPS en production.
- Les tokens JWT doivent avoir une durée de vie limitée et être vérifiés à chaque requête sécurisée.
- Le système RBAC doit empêcher tout accès non autorisé aux ressources sensibles.
- Les triggers de base de données constituent une dernière ligne de défense contre les lâchers dangereux.

**BNF-03 — Disponibilité et Fiabilité**
- Le système doit être capable de fonctionner 24h/24 et 7j/7 avec un taux de disponibilité visé de 99%.
- En cas de panne du backend, la base de données doit rester intègre grâce aux contraintes d'intégrité référentielle et aux triggers.

**BNF-04 — Maintenabilité**
- Le code doit être organisé selon l'architecture MVC, avec une séparation claire des responsabilités.
- Les dépendances doivent être déclarées explicitement (requirements.txt pour Python, package.json pour Node.js).
- Le projet doit être entièrement documenté (README, Swagger, commentaires de code).

**BNF-05 — Portabilité**
- L'application doit fonctionner sur tout environnement disposant de Docker, indépendamment du système d'exploitation.
- Le frontend doit être responsive et fonctionnel sur mobile et desktop.

**BNF-06 — Scalabilité**
- L'architecture doit permettre d'ajouter de nouveaux barrages, de nouvelles coopératives et de nouveaux rôles sans modification majeure du code.

---

## 4. Modélisation des Données

### 4.1 Modèle Conceptuel de Données (MCD)

Le Modèle Conceptuel de Données (MCD) a été élaboré selon la méthode MERISE. Il identifie les entités du domaine, leurs attributs et les associations qui les relient, avec leurs cardinalités.

**Entités identifiées :**

- **BARRAGE** : Entité centrale représentant le barrage physique. Attributs : identifiant, nom, capacité maximale (m³), niveau actuel (m³), seuil critique (m³).
- **UTILISATEUR** : Représente tout acteur ayant accès au système. Attributs : identifiant, nom, adresse e-mail (unique), mot de passe (haché), rôle.
- **COOPÉRATIVE** : Représente une coopérative agricole bénéficiaire des lâchers. Attributs : identifiant, nom, surface agricole (ha), historique de consommation (m³).
- **DEMANDE_IRRIGATION** : Représente une demande formelle d'eau. Attributs : identifiant, date de demande, volume demandé (m³), statut (en_attente, approuvée, refusée, en_cours, terminée).
- **LÂCHER_EAU** : Représente un lâcher physique effectif ou planifié. Attributs : identifiant, date du lâcher, volume (m³), statut (planifié, en_cours, terminé, annulé).
- **ALERTE** : Représente une notification critique générée automatiquement. Attributs : identifiant, type d'alerte, message, date de l'alerte.
- **RÉPARTITION** : Entité d'association représentant la distribution d'un lâcher entre coopératives. Attributs : identifiant, volume attribué (m³).

**Associations principales :**

- **UTILISATEUR — soumet — DEMANDE_IRRIGATION** : Un utilisateur peut soumettre plusieurs demandes d'irrigation (0,N), une demande est soumise par un seul utilisateur (1,1).
- **COOPÉRATIVE — reçoit — DEMANDE_IRRIGATION** : Une coopérative peut faire l'objet de plusieurs demandes (0,N), une demande concerne une seule coopérative (1,1).
- **DEMANDE_IRRIGATION — génère — LÂCHER_EAU** : Une demande peut générer au plus un lâcher (0,1), un lâcher peut être issu d'une demande ou être forcé (0,1).
- **UTILISATEUR — effectue — LÂCHER_EAU** : Un utilisateur peut effectuer plusieurs lâchers (0,N), un lâcher est effectué par un seul utilisateur (1,1).
- **BARRAGE — concerne — LÂCHER_EAU** : Un barrage peut être concerné par plusieurs lâchers (0,N), un lâcher concerne un seul barrage (1,1).
- **BARRAGE — génère — ALERTE** : Un barrage peut générer plusieurs alertes (0,N), une alerte est générée par un seul barrage (1,1).
- **LÂCHER_EAU — distribué_via — RÉPARTITION — attribué_à — COOPÉRATIVE** : Un lâcher peut être réparti entre plusieurs coopératives et une coopérative peut recevoir plusieurs répartitions.

### 4.2 Modèle Logique de Données (MLD)

La traduction du MCD en MLD produit les tables relationnelles suivantes (les clés primaires sont soulignées, les clés étrangères sont en italique) :

```
Barrage (<u>id_barrage</u>, nom, capacite_max, niveau_actuel, seuil_critique)

Utilisateur (<u>id_user</u>, nom, email, password, role)

Cooperative (<u>id_coop</u>, nom, surface_agricole, historique_consommation)

Demande_Irrigation (<u>id_demande</u>, date_demande, volume_demande, statut,
                    <i>#id_user</i>, <i>#id_coop</i>)

Lacher_Eau (<u>id_lacher</u>, date_lacher, volume, statut,
            <i>#id_demande</i>, <i>#id_user</i>, <i>#id_barrage</i>)

Alerte (<u>id_alerte</u>, type_alerte, message, date_alerte,
        <i>#id_barrage</i>)

Repartition (<u>id_repartition</u>, volume_attribue,
             <i>#id_lacher</i>, <i>#id_coop</i>)
```

La contrainte d'unicité composite `UNIQUE (id_lacher, id_coop)` sur la table `Repartition` garantit qu'une coopérative ne peut recevoir qu'une seule attribution par lâcher.

La clé étrangère `id_demande` dans `Lacher_Eau` est nullable (ON DELETE SET NULL), permettant ainsi les lâchers forcés sans demande préalable.

### 4.3 Modèle Physique de Données (MPD)

Le MPD adapte le MLD pour MySQL 8.0, en précisant les types de données, les contraintes et les index :

```sql
-- Table Barrage
CREATE TABLE Barrage (
    id_barrage      INT PRIMARY KEY AUTO_INCREMENT,
    nom             VARCHAR(50) NOT NULL,
    capacite_max    DECIMAL(15,2) NOT NULL,
    niveau_actuel   DECIMAL(15,2) NOT NULL,
    seuil_critique  DECIMAL(15,2) NOT NULL,
    CONSTRAINT chk_barrage_niveaux CHECK (
        capacite_max >= 0 AND niveau_actuel >= 0 AND seuil_critique >= 0
        AND niveau_actuel <= capacite_max
        AND seuil_critique <= capacite_max),
    INDEX idx_barrage_nom (nom),
    INDEX idx_barrage_niveau (niveau_actuel)
) ENGINE=InnoDB;

-- Table Utilisateur
CREATE TABLE Utilisateur (
    id_user   INT PRIMARY KEY AUTO_INCREMENT,
    nom       VARCHAR(50) NOT NULL,
    email     VARCHAR(50) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    role      ENUM('Admin','Gestionnaire','Agriculteur',
                   'Technicien','Directeur') NOT NULL DEFAULT 'Agriculteur',
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- Table Cooperative
CREATE TABLE Cooperative (
    id_coop                  INT PRIMARY KEY AUTO_INCREMENT,
    nom                      VARCHAR(50) NOT NULL,
    surface_agricole         DECIMAL(15,2) NOT NULL,
    historique_consommation  DECIMAL(15,2) NOT NULL DEFAULT 0
        CHECK (historique_consommation >= 0),
    INDEX idx_coop_nom (nom)
) ENGINE=InnoDB;
```

Tous les types numériques critiques utilisent `DECIMAL(15,2)` pour garantir une précision arithmétique fiable sur les volumes d'eau (jusqu'à 15 chiffres significatifs, 2 décimales). L'utilisation de `ENUM` pour les statuts et les rôles renforce l'intégrité des données au niveau du SGBD lui-même. Le moteur `InnoDB` est requis pour le support des transactions ACID et des clés étrangères.

---

## 5. Conception du Système

### 5.1 Diagramme de Cas d'Utilisation

Le diagramme de cas d'utilisation identifie quatre acteurs principaux et leurs interactions avec le système :

**Acteurs :**
- **Administrateur / Directeur** : Acteur le plus privilégié. Peut créer des comptes utilisateurs, exécuter des lâchers forcés, accéder à l'ensemble du tableau de bord.
- **Gestionnaire (Ingénieur)** : Peut créer des demandes de lâcher, consulter le tableau de bord et les coopératives.
- **Technicien** : Peut consulter le tableau de bord et les alertes.
- **Agriculteur** : Accès en lecture seule aux informations des coopératives.

**Cas d'utilisation principaux :**
- `Se connecter` (tous les acteurs)
- `Consulter le tableau de bord` (Gestionnaire, Technicien, Admin, Directeur)
- `Consulter les alertes` (tous les acteurs authentifiés)
- `Gérer les coopératives` (tous les acteurs authentifiés)
- `Créer une demande de lâcher` (Gestionnaire, Admin, Directeur)
- `Exécuter un lâcher` (Admin, Directeur uniquement)
- `Gérer les utilisateurs` (Admin uniquement)
- `Consulter l'historique des lâchers` (tous les acteurs authentifiés)

Les relations d'inclusion (`<<include>>`) et d'extension (`<<extend>>`) sont définies comme suit :
- `Exécuter un lâcher` **include** `Vérifier le seuil de sécurité` (via trigger)
- `Exécuter un lâcher` **include** `Répartir l'eau entre coopératives` (via procédure stockée)
- `Se connecter` **extend** `Rediriger selon le rôle` (dashboard adapté au rôle)

### 5.2 Diagramme de Classes

Le diagramme de classes du backend (SQLAlchemy) reflète fidèlement la structure de la base de données :

**Classe `Barrage`**
- Attributs : `id_barrage: int`, `nom: str`, `capacite_max: Decimal`, `niveau_actuel: Decimal`, `seuil_critique: Decimal`
- Relations : `lachers: List[LacherEau]`, `alertes: List[Alerte]`

**Classe `User`**
- Attributs : `id_user: int`, `nom: str`, `email: str`, `password: str`, `role: RoleEnum`
- Relations : `demandes: List[DemandeIrrigation]`, `lachers: List[LacherEau]`

**Classe `Cooperative`**
- Attributs : `id_coop: int`, `nom: str`, `surface_agricole: Decimal`, `historique_consommation: Decimal`
- Relations : `demandes: List[DemandeIrrigation]`, `repartitions: List[Repartition]`

**Classe `DemandeIrrigation`**
- Attributs : `id_demande: int`, `date_demande: datetime`, `volume_demande: Decimal`, `statut: StatutDemande`
- Clés étrangères : `id_user`, `id_coop`

**Classe `LacherEau`**
- Attributs : `id_lacher: int`, `date_lacher: datetime`, `volume: Decimal`, `statut: StatutLacher`
- Clés étrangères : `id_demande (nullable)`, `id_user`, `id_barrage`

**Classe `Alerte`**
- Attributs : `id_alerte: int`, `type_alerte: TypeAlerte`, `message: str`, `date_alerte: datetime`
- Clés étrangères : `id_barrage`

**Classe `Repartition`**
- Attributs : `id_repartition: int`, `volume_attribue: Decimal`
- Clés étrangères : `id_lacher`, `id_coop`

### 5.3 Architecture du Système

L'architecture adoptée est de type **MVC (Modèle-Vue-Contrôleur)** adapté au contexte d'une application web découplée :

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Navigateur)                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              FRONTEND — React + TypeScript (Vue)           │  │
│  │  Pages : LoginPage, DashboardPage, ReleasesPage, Alerts    │  │
│  │  Services : authService, releaseService (via Axios/HTTP)   │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │  REST API (HTTP/JSON)
                                 │  JWT Bearer Token
┌────────────────────────────────▼────────────────────────────────┐
│                    BACKEND — FastAPI Python (Contrôleur)         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Routes/API   │  │  Middleware  │  │     Services         │   │
│  │ /api/auth    │  │  RBAC        │  │  release_service     │   │
│  │ /api/releases│  │  JWT Auth    │  │  dashboard_service   │   │
│  │ /api/dashboard│ └──────────────┘  │  alert_service       │   │
│  └──────────────┘                   └──────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Modèles SQLAlchemy (Modèle)                 │   │
│  │  User | Barrage | Cooperative | LacherEau | Alerte       │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────┘
                                 │  SQLAlchemy ORM
┌────────────────────────────────▼────────────────────────────────┐
│                    BASE DE DONNÉES — MySQL 8.0                   │
│  Tables | Triggers | Procédures Stockées | Vues | Index         │
└─────────────────────────────────────────────────────────────────┘
```

Cette architecture garantit une séparation nette des responsabilités : la Vue (frontend React) ne connaît pas la base de données, le Modèle (SQLAlchemy) ne connaît pas les règles métier complexes, et le Contrôleur (FastAPI routes + services) orchestre les interactions. Cette organisation facilite les tests unitaires, la maintenance et l'évolution du système.

---

## 6. Conception de l'Interface Utilisateur

### 6.1 Description des Maquettes

L'interface utilisateur est organisée autour de cinq écrans principaux :

**Page de Connexion (`LoginPage`)**
La page d'accueil présente un formulaire centré avec deux champs (e-mail et mot de passe) et un bouton de connexion. Le fond utilise un dégradé bleu évoquant l'eau, avec le logo et le nom du système. En cas d'identifiants invalides, un message d'erreur contextuel s'affiche en rouge sous le formulaire sans rechargement de page (React Hook Form + validation côté client).

**Tableau de Bord Principal (`DashboardPage`)**
L'écran central de l'application. Il est structuré en plusieurs zones :
- En-tête : barre de navigation avec le nom de l'utilisateur connecté et son rôle, bouton de déconnexion.
- Barre latérale (Sidebar) : menu de navigation vers les différentes sections (Dashboard, Lâchers, Coopératives, Alertes, Utilisateurs).
- Zone de KPIs : quatre cartes affichant le niveau actuel du barrage (en m³ et %), le pourcentage de remplissage avec une jauge visuelle colorée (vert/orange/rouge), le nombre d'alertes critiques et les demandes en attente.
- Graphique historique : courbe d'évolution du niveau du barrage dans le temps (Recharts LineChart).
- Carte interactive : affichage des coopératives agricoles sur une carte Leaflet avec des marqueurs positionnables.

**Page des Lâchers (`ReleasesPage`)**
Liste paginée des lâchers d'eau (planifiés, en cours, terminés, annulés) sous forme de tableau avec colonnes : date, volume, statut, utilisateur responsable. Un bouton « Nouveau Lâcher » (visible pour les rôles autorisés) ouvre un modal de formulaire.

**Page des Alertes (`AlertsPage`)**
Tableau des alertes actives triées par date décroissante, avec une coloration conditionnelle selon le type (rouge pour critique, orange pour seuil bas, bleu pour système). Un bandeau d'alerte (`AlertBanner`) apparaît en haut de toutes les pages si une alerte critique est active.

**Page Non Autorisée (`UnauthorizedPage`)**
Page affichée lorsqu'un utilisateur tente d'accéder à une ressource pour laquelle il n'a pas les droits. Message clair avec bouton de retour au tableau de bord.

### 6.2 Expérience Utilisateur (UX)

La conception UX repose sur plusieurs principes directeurs :

**Clarté et hiérarchie visuelle** : Les informations critiques (niveau du barrage, alertes actives) sont présentées en premier et avec un contraste élevé. Les statuts utilisent un code couleur cohérent dans toute l'application : vert (#22C55E) pour les états nominaux, orange (#F59E0B) pour les avertissements, rouge (#EF4444) pour les états critiques.

**Feedback immédiat** : Toutes les actions utilisateur (création d'un lâcher, connexion, erreur) déclenchent un retour visuel immédiat (messages de succès/erreur, indicateurs de chargement). L'architecture React permet ces mises à jour sans rechargement de page.

**Sécurité transparente** : Le système de RBAC est implémenté de façon à rendre invisibles les éléments inaccessibles à un rôle donné (les boutons d'action sensibles n'apparaissent pas pour les rôles non autorisés), réduisant ainsi la friction et la confusion pour les utilisateurs moins privilégiés.

**Mode sombre** : L'application supporte un basculement entre mode clair et mode sombre via TailwindCSS (`dark:` prefix), adapté aux opérateurs travaillant en environnement peu éclairé (salle de contrôle).

### 6.3 Organisation des Pages

La navigation est gérée par React Router v6 avec des routes protégées :

```
/                    → Redirige vers /login si non authentifié
/login               → Page de connexion (public)
/dashboard           → Tableau de bord (tous les rôles authentifiés)
/releases            → Gestion des lâchers (Gestionnaire+)
/cooperatives        → Liste des coopératives (tous authentifiés)
/alerts              → Alertes (tous authentifiés)
/users               → Gestion des utilisateurs (Admin uniquement)
/unauthorized        → Page d'accès refusé
```

Chaque route protégée vérifie la validité du token JWT stocké dans le contexte React (`useAuth` hook) et redirige vers `/login` si le token est absent ou expiré. Les routes sensibles vérifient en outre le rôle de l'utilisateur avant d'afficher leur contenu.

---

## 7. Implémentation

### 7.1 Technologies Utilisées

**Frontend :**

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18+ | Librairie UI — Composants réactifs |
| Vite | 5+ | Outil de build ultra-rapide (remplace Webpack) |
| TypeScript | 5+ | Typage statique pour réduire les bugs |
| TailwindCSS | 3+ | Framework CSS utilitaire — Design responsive |
| Shadcn/UI | — | Composants UI pré-stylés (boutons, modals, tables) |
| Recharts | 2+ | Graphiques : niveau du barrage, historique |
| Leaflet.js | 1.9+ | Carte interactive des coopératives |
| React Router | 6+ | Navigation SPA (Single Page Application) |
| Axios | 1+ | Client HTTP vers l'API FastAPI |
| React Hook Form | 7+ | Gestion et validation des formulaires |
| Lucide React | — | Bibliothèque d'icônes modernes |

**Backend :**

| Technologie | Version | Rôle |
|-------------|---------|------|
| Python | 3.11+ | Langage principal |
| FastAPI | 0.100+ | Framework API asynchrone, auto-docs Swagger |
| Uvicorn | 0.23+ | Serveur ASGI pour FastAPI |
| SQLAlchemy | 2.0+ | ORM — Mapping objet-relationnel |
| Pydantic | 2.0+ | Validation et sérialisation des données |
| python-jose | 3.3+ | Génération et vérification des tokens JWT |
| passlib + bcrypt | — | Hachage sécurisé des mots de passe |
| PyMySQL | 8.0+ | Connecteur MySQL pour SQLAlchemy |
| python-dotenv | — | Chargement des variables d'environnement |

**Infrastructure :**

| Technologie | Rôle |
|-------------|------|
| MySQL 8.0 | SGBD relationnel — Données persistantes |
| Docker | Conteneurisation des services |
| Docker Compose | Orchestration multi-conteneurs |
| phpMyAdmin | Interface d'administration MySQL |
| GitHub / Git | Versioning et collaboration |
| GitHub Actions | Intégration continue (CI/CD) |

### 7.2 Organisation du Code

Le projet adopte une architecture modulaire stricte :

**Backend (`backend/app/`) :**
- `core/` : Configuration centrale (connexion BD, sécurité JWT, variables d'environnement)
- `middleware/` : Couche transversale (authentification JWT, contrôle RBAC)
- `models/` : Définitions des tables via SQLAlchemy ORM (une classe par table)
- `schemas/` : Schémas Pydantic pour la validation des entrées/sorties API
- `routes/` : Endpoints REST organisés par domaine fonctionnel (auth, dashboard, releases, alerts, cooperatives, users)
- `services/` : Logique métier découplée (calcul de répartition, agrégation dashboard, gestion alertes)
- `utils/` : Fonctions utilitaires (conversions d'unités, constantes critiques)

**Frontend (`frontend/src/`) :**
- `components/` : Composants réutilisables (Sidebar, AlertBanner, WaterLevelChart, CooperativeMap)
- `pages/` : Vues complètes correspondant aux routes
- `hooks/` : Hooks React personnalisés (useAuth, useDashboard)
- `services/` : Couche d'abstraction des appels API (authService, releaseService)
- `context/` : Context React pour la gestion de l'état global (authentification)
- `types/` : Définitions TypeScript des modèles de données (User, WaterRelease, Alert)

### 7.3 Fonctionnalités Principales Développées

**Authentification et RBAC**

Le flux d'authentification se déroule comme suit : l'utilisateur soumet ses identifiants via `POST /api/auth/login`, le backend vérifie les credentials en base de données, et retourne un token JWT signé contenant l'email (`sub`) et le rôle de l'utilisateur. Ce token est stocké côté client (contexte React) et inclus dans l'en-tête `Authorization: Bearer <token>` de toutes les requêtes authentifiées. Le middleware `RoleChecker` vérifie le rôle extrait du token à chaque endpoint protégé.

**Gestion des Lâchers d'Eau**

La création d'un lâcher (`POST /api/releases`) crée une entrée avec le statut `planifie` en base de données. L'exécution d'un lâcher (`PUT /api/releases/{id}/execute`) est réservée aux rôles Admin et Directeur. Elle change le statut en `termine` et déclenche la procédure stockée `sp_repartir_eau`, qui calcule et enregistre les parts de chaque coopérative. Les triggers MySQL garantissent que le lâcher est bloqué au niveau base de données si le volume entraînerait un niveau inférieur au seuil critique.

**Tableau de Bord**

L'endpoint `GET /api/dashboard/overview` appelle la procédure stockée `sp_dashboard_stats()` qui retourne en une seule requête le niveau actuel, le pourcentage de remplissage, le nombre d'alertes critiques et les demandes en attente. Ces données alimentent les cartes KPI et le graphique Recharts du dashboard.

---

## 8. Base de Données

### 8.1 Description des Tables

La base de données `barrage_flow_db_AI_Version` comprend sept tables principales :

**Table `Barrage`**
Stocke les informations des barrages gérés par le système. Pour ce projet, un seul barrage est initialisé : *Youssef Ibn Tachfine*, avec une capacité maximale de 300 000 000 m³, un niveau actuel de 180 000 000 m³ et un seuil critique de 50 000 000 m³. Une contrainte CHECK garantit que `niveau_actuel <= capacite_max` et que tous les volumes sont positifs.

**Table `Utilisateur`**
Stocke les comptes des utilisateurs du système. Le champ `role` est un `ENUM` avec les valeurs : Admin, Gestionnaire, Agriculteur, Technicien, Directeur. Le champ `email` est déclaré `UNIQUE` pour empêcher les doublons. Le champ `password` (VARCHAR 255) est prévu pour accueillir un hash bcrypt.

**Table `Cooperative`**
Stocke les cinq coopératives agricoles de la région : Coopérative Agricole Tamaloute (450,5 ha), El Firdaous (320,75 ha), Oued Souss (580 ha), Al Amal (210,25 ha), Targa n Touchka (395 ha). Ces surfaces servent de base au calcul de répartition proportionnelle.

**Table `Demande_Irrigation`**
Enregistre chaque demande formelle d'irrigation soumise par un utilisateur au nom d'une coopérative. Le champ `statut` suit le cycle de vie : `en_attente` → `approuvee` / `refusee` → `en_cours` → `terminee`.

**Table `Lacher_Eau`**
Enregistre chaque lâcher d'eau, qu'il soit planifié, en cours, terminé ou annulé. La clé étrangère `id_demande` est nullable pour permettre les lâchers forcés sans demande préalable. Les index sur `(id_barrage, date_lacher)` optimisent les requêtes historiques.

**Table `Alerte`**
Enregistre les alertes générées automatiquement par les triggers MySQL. Les types possibles sont : `niveau_critique`, `seuil_bas`, `inondation_risque`, `maintenance`, `systeme`.

**Table `Repartition`**
Table de liaison entre `Lacher_Eau` et `Cooperative`, enregistrant le volume attribué à chaque coopérative pour chaque lâcher. La contrainte d'unicité composite `UNIQUE(id_lacher, id_coop)` empêche les doubles attributions.

### 8.2 Relations entre les Tables

```
Barrage ─────────────┬──── (1,N) ──── Lacher_Eau
                     └──── (1,N) ──── Alerte

Utilisateur ─────────┬──── (1,N) ──── Demande_Irrigation
                     └──── (1,N) ──── Lacher_Eau

Cooperative ─────────┬──── (1,N) ──── Demande_Irrigation
                     └──── (1,N) ──── Repartition

Demande_Irrigation ──── (0,1) ──── Lacher_Eau (nullable)

Lacher_Eau ─────────────── (1,N) ──── Repartition
```

L'intégrité référentielle est garantie par les contraintes de clés étrangères InnoDB :
- `Lacher_Eau.id_demande` : ON DELETE SET NULL (préserver l'historique en cas de suppression de demande)
- `Alerte.id_barrage` : ON DELETE CASCADE (supprimer les alertes si le barrage est supprimé)
- `Repartition.id_lacher` et `Repartition.id_coop` : ON DELETE CASCADE

### 8.3 Exemples de Requêtes SQL

**Requête 1 : Niveau actuel du barrage avec statut**
```sql
SELECT 
    nom,
    niveau_actuel,
    capacite_max,
    (niveau_actuel / capacite_max) * 100 AS pourcentage_remplissage,
    CASE 
        WHEN niveau_actuel <= seuil_critique THEN 'CRITIQUE'
        WHEN niveau_actuel < (seuil_critique * 1.2) THEN 'BAS'
        ELSE 'NORMAL'
    END AS statut_niveau
FROM Barrage
WHERE id_barrage = 1;
```

**Requête 2 : Historique des lâchers avec nom de l'opérateur**
```sql
SELECT 
    l.date_lacher,
    l.volume AS volume_m3,
    l.statut,
    u.nom AS operateur,
    b.nom AS barrage
FROM Lacher_Eau l
JOIN Utilisateur u ON l.id_user = u.id_user
JOIN Barrage b ON l.id_barrage = b.id_barrage
ORDER BY l.date_lacher DESC
LIMIT 10;
```

**Requête 3 : Répartition d'un lâcher par coopérative**
```sql
SELECT 
    c.nom AS cooperative,
    c.surface_agricole AS surface_ha,
    r.volume_attribue AS volume_m3,
    ROUND((r.volume_attribue / l.volume) * 100, 2) AS pourcentage
FROM Repartition r
JOIN Cooperative c ON r.id_coop = c.id_coop
JOIN Lacher_Eau l ON r.id_lacher = l.id_lacher
WHERE r.id_lacher = 1
ORDER BY r.volume_attribue DESC;
```

**Requête 4 : Alertes critiques des 7 derniers jours**
```sql
SELECT 
    a.type_alerte,
    a.message,
    a.date_alerte,
    b.nom AS barrage
FROM Alerte a
JOIN Barrage b ON a.id_barrage = b.id_barrage
WHERE a.type_alerte IN ('niveau_critique', 'seuil_bas')
  AND a.date_alerte >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY a.date_alerte DESC;
```

**Requête 5 : Volume total d'eau distribué par coopérative (statistiques)**
```sql
SELECT 
    c.nom AS cooperative,
    c.surface_agricole,
    SUM(r.volume_attribue) AS volume_total_recu_m3,
    COUNT(r.id_lacher) AS nb_lachers_recus
FROM Cooperative c
LEFT JOIN Repartition r ON c.id_coop = r.id_coop
GROUP BY c.id_coop, c.nom, c.surface_agricole
ORDER BY volume_total_recu_m3 DESC;
```

---

## 9. Tests et Validation

### 9.1 Types de Tests Effectués

Les tests ont été organisés en trois catégories principales, confiées à des équipes distinctes :

**Tests Unitaires et d'Intégration (Backend)**
Ces tests vérifient le comportement de chaque endpoint de l'API de façon isolée. Ils sont réalisés à l'aide de Postman et de la documentation Swagger intégrée (`http://localhost:8000/docs`). Chaque route est testée avec des données valides, des données invalides (vérification des codes d'erreur HTTP attendus) et des tokens JWT manquants ou invalides.

**Tests Fonctionnels (Équipe QA)**
L'équipe QA (ISKANDER El Mahdi et JAIT Reda) réalise des tests de bout en bout simulant les interactions d'un utilisateur réel avec l'application. Les scénarios de test couvrent notamment :
- Connexion avec identifiants corrects → attendu : token JWT valide, redirection dashboard.
- Connexion avec mauvais mot de passe → attendu : code 401, message « Invalid credentials ».
- Accès au dashboard sans token → attendu : redirection vers `/login`.
- Demande de lâcher par un Technicien → attendu : code 403 Forbidden.
- Lâcher dépassant le seuil critique → attendu : code 500 avec message du trigger MySQL.
- Exécution d'un lâcher par le Directeur → attendu : répartition automatique enregistrée.

**Tests de Sécurité (Red Team / Blue Team)**
Le pôle sécurité réalise des tests d'intrusion ciblés sur les vulnérabilités les plus courantes des applications web :
- **Injection SQL (SQLi)** : Tentative d'injection dans les champs de formulaire et les paramètres URL. Le recours à SQLAlchemy ORM avec des requêtes paramétrées protège nativement contre cette vulnérabilité.
- **Bypass RBAC** : Tentative d'accès à des endpoints Admin avec un token Technicien.
- **Exposition de tokens JWT** : Vérification que les tokens ne sont pas exposés dans les logs ou le stockage localStorage.
- **Validation des entrées** : Soumission de volumes négatifs, de chaînes de caractères dans des champs numériques.

### 9.2 Résultats

Les tests fonctionnels ont révélé un taux de conformité global élevé pour les scénarios critiques de gestion hydraulique. Les tests de sécurité ont notamment confirmé que :
- Le trigger `trg_before_lacher_check_seuil` bloque correctement tout lâcher dangereux, même en cas de tentative directe via l'API.
- Le middleware RBAC retourne correctement un code 403 pour les accès non autorisés.
- Les requêtes SQLAlchemy sont correctement paramétrées, sans vulnérabilité à l'injection SQL directe.
- L'endpoint `/api/releases/execute` est correctement restreint aux rôles Admin et Directeur.

### 9.3 Problèmes Rencontrés et Solutions

**Problème 1 : Incohérence des valeurs d'énumération de rôles**
*Description* : La table SQL définissait des rôles avec majuscules initiales (`Admin`, `Gestionnaire`) mais l'application utilisait également des formes en minuscules. Cela créait des échecs de vérification RBAC.  
*Solution* : Les listes `allowed_roles` dans les routes ont été doublées pour inclure les deux formes (`["admin", "Admin", "Directeur", "directeur"]`). Une normalisation complète de l'énumération est planifiée dans une prochaine itération.

**Problème 2 : Gestion de la déconnexion JWT sans state serveur**
*Description* : JWT étant un mécanisme sans état (stateless), il est impossible d'invalider un token côté serveur avant son expiration.  
*Solution* : La durée de vie des tokens a été réduite à 60 minutes. Une liste noire de tokens révoqués (Redis ou table SQL) est envisagée pour une version future.

**Problème 3 : Conflit Docker sur les volumes MySQL**
*Description* : Lors de mises à jour du schéma SQL, les anciennes données persistées dans le volume Docker empêchaient la ré-exécution des scripts d'initialisation.  
*Solution* : La commande `docker-compose down -v` supprime les volumes et permet une réinitialisation complète. Le guide Docker a été mis à jour pour documenter ce cas.

**Problème 4 : CORS sur les appels API depuis le frontend**
*Description* : Le navigateur bloquait les appels cross-origin depuis `http://localhost:5173` vers `http://localhost:8000`.  
*Solution* : Configuration du middleware CORS FastAPI pour autoriser explicitement `http://localhost:5173` et `http://127.0.0.1:5173` avec `allow_credentials=True`.

---

## 10. Sécurité

### 10.1 Méthodes de Protection des Données

**Hachage des mots de passe**
Les mots de passe des utilisateurs sont hachés avec l'algorithme bcrypt via la bibliothèque `passlib`. bcrypt est conçu pour être intentionnellement lent (cost factor configurable), rendant les attaques par force brute prohibitives. Le hash stocké en base de données ne permet jamais de retrouver le mot de passe original.

**Authentification par Token JWT**
Les tokens JWT (JSON Web Token) sont signés avec l'algorithme HS256 et une clé secrète (`SECRET_KEY`) chargée depuis les variables d'environnement. Chaque token contient le sous (email), le rôle et une date d'expiration. Toute requête authentifiée fait vérifier la signature du token par le backend, empêchant la falsification.

**Protection au niveau de la base de données**
Les triggers MySQL constituent une deuxième ligne de défense indépendante du code applicatif. Même si un bug ou une faille permettait de contourner les vérifications du backend, le trigger `trg_before_lacher_check_seuil` bloquerait au niveau SQL tout INSERT dans `Lacher_Eau` qui ferait descendre le niveau sous le seuil. Cette défense en profondeur (*defense in depth*) est une pratique essentielle pour les systèmes critiques.

**Validation des entrées (Pydantic)**
Toutes les données reçues par l'API sont validées par des schémas Pydantic avant tout traitement. Des types stricts, des contraintes de valeur (`gt=0` pour les volumes) et des formats d'email validés empêchent l'injection de données malformées.

**Variables d'environnement**
Les secrets (clé JWT, mot de passe MySQL) ne sont jamais codés en dur dans le code source. Ils sont chargés depuis un fichier `.env` exclu du versioning Git (`.gitignore`). Un fichier `.env.example` documente les variables nécessaires sans révéler leurs valeurs.

**Protection CORS**
La configuration CORS FastAPI restreint les origines autorisées à la liste explicite des domaines du frontend, empêchant les requêtes cross-origin depuis des domaines tiers non autorisés.

### 10.2 Gestion des Utilisateurs et Accès

**Hiérarchie RBAC (Role-Based Access Control)**

Le système implémente cinq niveaux d'accès formant une hiérarchie stricte :

| Rôle | Niveau | Permissions principales |
|------|--------|------------------------|
| **Directeur / Admin** | 5 (Maximum) | Toutes les opérations, dont les lâchers forcés et la gestion des utilisateurs |
| **Gestionnaire** | 3 | Créer des demandes de lâcher, consulter le dashboard et les coopératives |
| **Technicien** | 2 | Consulter le dashboard et les alertes |
| **Agriculteur** | 1 | Consulter les informations des coopératives |

Le `RoleChecker` est implémenté comme une dépendance FastAPI injectable dans chaque route. Il extrait le rôle depuis le payload JWT et le compare à la liste des rôles autorisés pour cet endpoint. En cas d'accès non autorisé, il retourne immédiatement un code HTTP 403 Forbidden avec un message explicite.

**Audit et Traçabilité**
Chaque action critique (lâcher d'eau créé, exécuté, demande soumise) est tracée en base de données avec l'identifiant de l'utilisateur responsable (`id_user`) et un horodatage précis. Cette traçabilité est essentielle pour les audits de conformité et les investigations post-incident.

**Pôle Sécurité Red Team / Blue Team**
Le projet inclut une équipe dédiée à la sécurité, divisée en deux sous-équipes :
- La **Red Team** (HARBECH M., HARBOUS Moncif) effectue des tests d'intrusion actifs : injection SQL, bypass de RBAC, exploitation de tokens.
- La **Blue Team** (HRIMICH Reda, IGHRANE Imane) analyse les résultats des attaques, durcit la configuration et propose des correctifs au code.

---

## 11. Déploiement

### 11.1 Environnement Utilisé

L'application est conçue pour être déployée dans un environnement conteneurisé Docker. L'environnement de développement comprend quatre services orchestrés par Docker Compose :

| Service | Image | Port | Rôle |
|---------|-------|------|------|
| `db` | mysql:8.0 | 3306 | Base de données MySQL |
| `api` | build:./backend | 8000 | Backend FastAPI |
| `frontend` | build:./frontend | 5173 | Interface React |
| `phpmyadmin` | phpmyadmin/phpmyadmin | 8080 | Administration MySQL |

Le service MySQL est configuré avec un health check (mysqladmin ping toutes les 10 secondes) pour garantir que le backend ne démarrera qu'une fois la base de données prête. Le volume `mysql_data` assure la persistance des données entre les redémarrages de conteneurs.

Les scripts SQL d'initialisation (`database/sql/`) sont montés dans `/docker-entrypoint-initdb.d` du conteneur MySQL, ce qui les fait exécuter automatiquement dans l'ordre alphabétique lors du premier démarrage (01_schema.sql → 02_seed_data.sql → 03_triggers.sql → 04_procedures.sql → 05_views.sql).

### 11.2 Hébergement

Dans sa version prototype académique, l'application est déployée localement sur les machines de développement. Les accès sont :
- Frontend React : `http://localhost:5173`
- API FastAPI (Swagger) : `http://localhost:8000/docs`
- phpMyAdmin : `http://localhost:8080`
- MySQL : `localhost:3306`

Pour un déploiement en production, l'architecture Docker Compose est directement transposable sur un serveur cloud (VPS Linux). Les adaptations nécessaires pour la production incluent : l'activation de HTTPS via un proxy inverse (Nginx + Certbot), le changement de la `SECRET_KEY` JWT, le renforcement des mots de passe MySQL et la désactivation de phpMyAdmin.

### 11.3 Mise en Ligne

Le lancement complet de l'application se fait en une seule commande depuis la racine du projet :

```bash
# Cloner le dépôt
git clone https://github.com/HassanIghil/barrage-flow-manager-ai-version.git
cd barrage-flow-manager-ai-version

# Créer le fichier .env depuis le template
cp backend/.env.example backend/.env
# Éditer .env avec les vraies valeurs

# Lancer tous les services
docker-compose up -d

# Vérifier l'état des services
docker-compose ps
```

Le workflow GitHub Actions configuré dans le dépôt automatise les vérifications de qualité du code (linting, tests) à chaque Pull Request, garantissant que seul du code validé est intégré à la branche principale.

---

## 12. Conclusion

### 12.1 Bilan du Projet

Le projet Barrage-Flow Manager — Version IA constitue une réalisation technique complète et cohérente, couvrant l'intégralité du cycle de vie d'un système d'information : de la modélisation MERISE jusqu'au déploiement Docker, en passant par le développement full-stack et les tests de sécurité.

Les quatre objectifs fondamentaux du projet ont été atteints : la protection des réserves vitales est garantie par les triggers MySQL, l'équité de répartition est assurée par l'algorithme proportionnel de la procédure stockée, le tableau de bord offre une aide à la décision en temps réel, et le système RBAC contrôle précisément les droits de chaque acteur.

La dimension comparative du projet — version manuelle vs version assistée par IA — apporte une valeur ajoutée pédagogique significative. L'utilisation d'outils d'IA a permis d'accélérer sensiblement les phases de scaffolding, de documentation et de génération de code boilerplate, libérant du temps pour se concentrer sur la logique métier et la conception de qualité.

### 12.2 Compétences Acquises

Ce projet a permis à l'équipe de développer et consolider un large éventail de compétences techniques et organisationnelles :

**Compétences techniques :**
- Maîtrise de la méthodologie MERISE (MCD, MLD, MPD) et de sa traduction en scripts SQL MySQL.
- Développement d'une API REST avec FastAPI, incluant authentification JWT, middleware RBAC, et documentation Swagger automatique.
- Développement d'une interface web réactive avec React, TypeScript et TailwindCSS.
- Conception de triggers et de procédures stockées MySQL pour la logique métier critique.
- Containerisation d'une application multi-services avec Docker et Docker Compose.
- Implémentation de mécanismes de sécurité (hachage bcrypt, JWT, RBAC, CORS).

**Compétences organisationnelles :**
- Travail en équipe avec un workflow Git structuré (branches, Pull Requests, revues de code).
- Communication asynchrone efficace via Slack avec des canaux dédiés par pôle.
- Rédaction de documentation technique (README, guides Docker, Swagger).
- Collaboration avec des équipes spécialisées (QA, Red/Blue Team).

### 12.3 Améliorations Possibles

Plusieurs pistes d'amélioration ont été identifiées pour faire évoluer le système vers une version production-ready :

- **Hachage des mots de passe en production** : L'implémentation actuelle de `verify_password` est simplifiée. L'activation complète de bcrypt (via `passlib.context.CryptContext`) est la priorité pour une mise en production.
- **Liste noire de tokens JWT** : Implémenter une table de révocation des tokens pour permettre la déconnexion immédiate.
- **Données météorologiques en temps réel** : Intégrer une API météo (OpenWeatherMap) pour afficher la pluviométrie et les prévisions sur le tableau de bord, enrichissant l'aide à la décision.
- **Notifications en temps réel (WebSockets)** : Remplacer le polling HTTP par des WebSockets pour une diffusion instantanée des alertes critiques.
- **Application mobile** : Développer une application mobile native (React Native) permettant aux opérateurs de terrain d'interagir avec le système depuis leurs smartphones.
- **Intégration IoT** : Connecter le système à des capteurs de niveau physiques (capteurs ultrasoniques, piézométriques) pour alimenter la base de données en temps réel sans saisie manuelle.
- **Audit log complet** : Ajouter une table d'audit logging enregistrant toutes les actions sensibles (connexions, modifications, suppressions) avec adresse IP, horodatage et utilisateur.
- **Tests automatisés** : Mettre en place une suite de tests automatisés (pytest pour le backend, Vitest/Cypress pour le frontend) intégrée au pipeline GitHub Actions.

---

## 13. Annexes

### Annexe A — Extraits de Code Significatifs

**A.1 — Trigger de sécurité MySQL (protection du seuil critique)**
```sql
CREATE TRIGGER trg_before_lacher_check_seuil
BEFORE INSERT ON Lacher_Eau
FOR EACH ROW
BEGIN
    DECLARE v_niveau DECIMAL(15,2);
    DECLARE v_seuil DECIMAL(15,2);

    SELECT niveau_actuel, seuil_critique INTO v_niveau, v_seuil
    FROM Barrage
    WHERE id_barrage = NEW.id_barrage;

    IF (v_niveau - NEW.volume) < v_seuil THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lâcher refusé : le niveau passerait sous le seuil de sécurité';
    END IF;
END;
```
Ce trigger est la pierre angulaire de la sécurité hydraulique du système. Il s'exécute **avant** chaque insertion dans `Lacher_Eau` et annule l'opération si le volume du lâcher provoquerait un niveau résiduel inférieur au seuil critique de l'AEP.

**A.2 — Procédure stockée de répartition proportionnelle**
```sql
CREATE PROCEDURE sp_repartir_eau(IN p_id_lacher INT)
BEGIN
    DECLARE v_volume_total DECIMAL(15,2);
    DECLARE v_surface_totale DECIMAL(15,2);
    DECLARE v_id_coop INT;
    DECLARE v_surface DECIMAL(15,2);
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur_coop CURSOR FOR
        SELECT id_coop, surface_agricole FROM Cooperative;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SELECT volume INTO v_volume_total FROM Lacher_Eau WHERE id_lacher = p_id_lacher;
    SELECT SUM(surface_agricole) INTO v_surface_totale FROM Cooperative;

    OPEN cur_coop;
    read_loop: LOOP
        FETCH cur_coop INTO v_id_coop, v_surface;
        IF done THEN LEAVE read_loop; END IF;
        INSERT INTO Repartition (id_lacher, id_coop, volume_attribue)
        VALUES (p_id_lacher, v_id_coop, v_volume_total * (v_surface / v_surface_totale));
    END LOOP;
    CLOSE cur_coop;
END;
```
Cette procédure calcule la part de chaque coopérative selon la formule : `volume_attribué = volume_total × (surface_coopérative / surface_totale_toutes_coopératives)`.

**A.3 — Middleware RBAC FastAPI**
```python
class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, payload: dict = Depends(get_current_user)):
        user_role = payload.get("role")
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden"
            )
        return payload

# Utilisation dans une route protégée :
@router.put("/{id_lacher}/execute")
def execute_release(
    id_lacher: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(RoleChecker(["admin", "Admin", "Directeur"]))
):
    ...
```

**A.4 — Génération du token JWT**
```python
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
```

### Annexe B — Description des Diagrammes

**B.1 — Diagramme MCD**
Le MCD représente sept entités reliées par des associations. Les entités centrales sont `BARRAGE` (nœud central du domaine) et `UTILISATEUR` (acteur principal). L'entité `DEMANDE_IRRIGATION` matérialise le processus métier en deux étapes (demande → lâcher). L'entité `RÉPARTITION` est une entité d'association ternaire entre `LÂCHER_EAU` et `COOPÉRATIVE`.

**B.2 — Diagramme de Cas d'Utilisation**
Quatre acteurs (Directeur/Admin, Gestionnaire, Technicien, Agriculteur) interagissent avec dix cas d'utilisation principaux. Les cas `Exécuter un lâcher` et `Gérer les utilisateurs` sont exclusivement réservés à l'acteur Directeur/Admin.

**B.3 — Architecture Docker Compose**
Le schéma d'architecture illustre les quatre conteneurs (db, api, frontend, phpmyadmin) et leurs dépendances. Le service `api` dépend du service `db` (condition: service_healthy). Le service `frontend` dépend du service `api`. Les ports exposés permettent l'accès depuis la machine hôte.

### Annexe C — Données de Test

Les données de seed (`02_seed_data.sql`) initialisent :
- 1 barrage (Youssef Ibn Tachfine, capacité 300 Mm³, niveau 180 Mm³)
- 4 utilisateurs avec des rôles variés (admin, gestionnaire ×2, technicien)
- 5 coopératives agricoles représentatives de la région Souss-Massa
- 4 demandes d'irrigation (différents statuts)
- 3 lâchers d'eau (2 terminés, 1 planifié)
- 3 alertes (niveau critique, seuil bas, maintenance)
- 10 enregistrements de répartition (5 coopératives × 2 lâchers terminés)

Exemple de répartition pour le premier lâcher (50 000 m³) :
- Tamaloute (450,5 ha / 1956,5 ha totaux) : 11 511,11 m³
- El Firdaous (320,75 ha) : 8 196,44 m³
- Oued Souss (580 ha) : 14 827,74 m³
- Al Amal (210,25 ha) : 5 373,55 m³
- Targa n Touchka (395 ha) : 10 091,16 m³

### Annexe D — Captures d'Écran Décrites

**D.1 — Page de Connexion**
Fond dégradé bleu-marine. Carte centrée avec le logo du projet, deux champs de saisie (email, mot de passe) avec labels flottants, bouton de connexion bleu principal. Message d'erreur rouge visible en cas d'échec.

**D.2 — Tableau de Bord**
Barre latérale sombre à gauche (Sidebar avec icônes Lucide). Zone principale avec 4 cartes KPI en haut (Niveau du barrage, Pourcentage de remplissage avec jauge, Alertes critiques en rouge, Demandes en attente en orange). Graphique Recharts AreaChart sous les KPIs montrant l'évolution du niveau. Carte Leaflet en bas à droite avec marqueurs des coopératives.

**D.3 — Page de Gestion des Lâchers**
Tableau avec en-têtes : Date, Volume (m³), Statut (badge coloré), Opérateur, Actions. Bouton « + Nouveau Lâcher » en haut à droite (visible uniquement pour Gestionnaire+). Modal de création avec champs Volume et sélecteur de barrage.

**D.4 — Documentation Swagger (API)**
Interface Swagger UI automatiquement générée par FastAPI, accessible sur `/docs`. Liste tous les endpoints groupés par tags (Auth, Dashboard, Releases, Alerts, Cooperatives, Users) avec possibilité de les tester directement depuis le navigateur après authentification.

---

*Rapport rédigé par l'Équipe IA — Équipe 6 — Module SIBD 2025-2026*  
*Université Ibn Zohr — Faculté des Sciences Appliquées, Souss-Massa*  
*Encadrant : Pr. S. EL-ATEIF*
