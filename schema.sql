-- Structure des tables pour SQLite
-- Table UTILISATEUR
CREATE TABLE IF NOT EXISTS UTILISATEUR (
   id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
   nom_user TEXT NOT NULL,
   prenom_user TEXT NOT NULL,
   nomUtilisateur TEXT NOT NULL UNIQUE,
   email TEXT NOT NULL UNIQUE,
   mdp TEXT NOT NULL, 
   estAdmin INTEGER DEFAULT 0,
   dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table RECETTE
CREATE TABLE IF NOT EXISTS RECETTE (
   id_recette INTEGER PRIMARY KEY AUTOINCREMENT,
   titre TEXT NOT NULL,
   description TEXT,
   urlImage TEXT,
   tempsPreparation TEXT,
   tempsCuisson TEXT,
   niveau_difficulte TEXT,
   ingredients TEXT,
   etapes TEXT,
   dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   dateModification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_utilisateur INTEGER NOT NULL,
   FOREIGN KEY(id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
);

-- Table RECOMMANDATION
CREATE TABLE IF NOT EXISTS RECOMMANDATION (
   id_recommandation INTEGER PRIMARY KEY AUTOINCREMENT,
   titre TEXT NOT NULL,
   contenu TEXT,
   lieu TEXT NOT NULL,
   dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_utilisateur INTEGER NOT NULL, 
   id_moderateur INTEGER, 
   FOREIGN KEY(id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
   FOREIGN KEY(id_moderateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE SET NULL
);

-- Table PAGE
CREATE TABLE IF NOT EXISTS PAGE (
   id_page INTEGER PRIMARY KEY AUTOINCREMENT,
   titre TEXT NOT NULL,
   contenu TEXT, 
   type_page TEXT NOT NULL,
   derniere_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_utilisateur INTEGER NOT NULL,
   FOREIGN KEY(id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE
);

-- Table COMMENTAIRE
CREATE TABLE IF NOT EXISTS COMMENTAIRE (
   id_commentaire INTEGER PRIMARY KEY AUTOINCREMENT,
   contenu TEXT,
   note INTEGER CHECK (note BETWEEN 1 AND 5),
   estApprouve INTEGER DEFAULT 0,
   dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   id_utilisateur INTEGER NOT NULL,
   id_recommandation INTEGER NOT NULL,
   FOREIGN KEY(id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur) ON DELETE CASCADE,
   FOREIGN KEY(id_recommandation) REFERENCES RECOMMANDATION(id_recommandation) ON DELETE CASCADE
);

-- Création des index
CREATE INDEX IF NOT EXISTS idx_recette_titre ON RECETTE(titre);
CREATE INDEX IF NOT EXISTS idx_recommandation_lieu ON RECOMMANDATION(lieu);
CREATE INDEX IF NOT EXISTS idx_commentaire_recommandation ON COMMENTAIRE(id_recommandation);

-- Vérifie que seuls les admins peuvent ajouter des recettes
CREATE TRIGGER IF NOT EXISTS before_insert_recette
BEFORE INSERT ON RECETTE
FOR EACH ROW
BEGIN
    SELECT CASE 
        WHEN NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE id_utilisateur = NEW.id_utilisateur AND estAdmin = 1) 
        THEN RAISE(ABORT, 'Seuls les administrateurs peuvent ajouter des recettes')
    END;
END;

-- Vérifie que seuls les admins peuvent modifier des pages
CREATE TRIGGER IF NOT EXISTS before_insert_page
BEFORE INSERT ON PAGE
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE id_utilisateur = NEW.id_utilisateur AND estAdmin = 1)
        THEN RAISE(ABORT, 'Seuls les administrateurs peuvent modifier des pages')
    END;
END;

-- Vérifie que seuls les admins peuvent modérer des recommandations
CREATE TRIGGER IF NOT EXISTS before_update_recommandation
BEFORE UPDATE ON RECOMMANDATION
FOR EACH ROW
WHEN (NEW.id_moderateur IS NOT NULL)
BEGIN
    SELECT CASE
        WHEN NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE id_utilisateur = NEW.id_moderateur AND estAdmin = 1)
        THEN RAISE(ABORT, 'Seuls les administrateurs peuvent modérer des recommandations')
    END;
END;

-- Simule le ON UPDATE CURRENT_TIMESTAMP pour RECETTE
CREATE TRIGGER IF NOT EXISTS update_recette_timestamp
AFTER UPDATE ON RECETTE
FOR EACH ROW
BEGIN
    UPDATE RECETTE SET dateModification = CURRENT_TIMESTAMP WHERE id_recette = NEW.id_recette;
END;

-- Simule le ON UPDATE CURRENT_TIMESTAMP pour PAGE
CREATE TRIGGER IF NOT EXISTS update_page_timestamp
AFTER UPDATE ON PAGE
FOR EACH ROW
BEGIN
    UPDATE PAGE SET derniere_maj = CURRENT_TIMESTAMP WHERE id_page = NEW.id_page;
END;

-- Récupère les recettes avec leurs infos complètes
CREATE VIEW IF NOT EXISTS vue_recettes_completes AS
SELECT r.*, u.nomUtilisateur as auteur
FROM RECETTE r
JOIN UTILISATEUR u ON r.id_utilisateur = u.id_utilisateur;

-- Récupère les recommandations avec leurs commentaires et notes moyennes
CREATE VIEW IF NOT EXISTS vue_recommandations_avec_notes AS
SELECT r.id_recommandation, r.titre, r.contenu, r.lieu, r.dateCreation,
       u.nomUtilisateur as auteur,
       COUNT(c.id_commentaire) as nombre_commentaires,
       COALESCE(AVG(c.note), 0) as note_moyenne
FROM RECOMMANDATION r
JOIN UTILISATEUR u ON r.id_utilisateur = u.id_utilisateur
LEFT JOIN COMMENTAIRE c ON r.id_recommandation = c.id_recommandation
GROUP BY r.id_recommandation;

-- Récupère les commentaires avec les infos utilisateur
CREATE VIEW IF NOT EXISTS vue_commentaires_detailles AS
SELECT c.*, u.nomUtilisateur, r.titre as titre_recommandation
FROM COMMENTAIRE c
JOIN UTILISATEUR u ON c.id_utilisateur = u.id_utilisateur
JOIN RECOMMANDATION r ON c.id_recommandation = r.id_recommandation;