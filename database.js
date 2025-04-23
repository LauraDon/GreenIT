const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'ubelicious.db');

function initializeDatabase() {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'ouverture de la base de données', err);
            return;
        }
        console.log('Base de données connectée');

        db.run('PRAGMA foreign_keys = ON');
        const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        db.exec(schemaSQL, (err) => {
            if (err) {
                console.error('Erreur lors de l\'exécution du schéma:', err);
                return;
            }

            console.log('Schéma de base de données créé');
            const insertAdmin = `
          INSERT OR IGNORE INTO UTILISATEUR 
          (nom_user, prenom_user, nomUtilisateur, email, mdp, estAdmin) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
            db.run(insertAdmin, ['Admin', 'System', 'admin', 'admin@ubelicious.com', 'motdepassehash', 1], function(err) {
                if (err) {
                    console.error('Erreur lors de l\'ajout de l\'admin:', err);
                } else if (this.changes > 0) {
                    console.log('Utilisateur admin créé avec l\'ID:', this.lastID);
                } else {
                    console.log('Admin déjà existant');
                }
            });
        });
    });

    return db;
}

function getUtilisateurs(db) {
    return new Promise((resolve, reject) => {
        db.all('SELECT id_utilisateur, nom_user, prenom_user, nomUtilisateur, email, estAdmin FROM UTILISATEUR', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getRecettes(db, limit = 10) {
    return new Promise((resolve, reject) => {
        db.all(`
      SELECT r.*, u.nomUtilisateur as auteur
      FROM RECETTE r
      JOIN UTILISATEUR u ON r.id_utilisateur = u.id_utilisateur
      ORDER BY r.dateCreation DESC
      LIMIT ?
    `, [limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function searchRecettes(db, keyword) {
    return new Promise((resolve, reject) => {
        db.all(`
      SELECT * FROM RECETTE 
      WHERE titre LIKE ? OR description LIKE ? OR ingredients LIKE ?
    `, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function addRecette(db, recetteData, userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT estAdmin FROM UTILISATEUR WHERE id_utilisateur = ?', [userId], (err, row) => {
            if (err) {
                return reject(err);
            }

            if (!row || row.estAdmin !== 1) {
                return reject(new Error('Seuls les administrateurs peuvent ajouter des recettes'));
            }

            const {
                titre,
                description,
                urlImage,
                tempsPreparation,
                tempsCuisson,
                niveau_difficulte,
                ingredients,
                etapes
            } = recetteData;

            db.run(`
        INSERT INTO RECETTE (
          titre, description, urlImage, tempsPreparation, tempsCuisson, 
          niveau_difficulte, ingredients, etapes, id_utilisateur
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [titre, description, urlImage, tempsPreparation, tempsCuisson,
                niveau_difficulte, ingredients, etapes, userId
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    });
}

function getAllRecommandations(db) {
    return new Promise((resolve, reject) => {
        db.all(`
          SELECT r.*, u.nomUtilisateur as auteur
          FROM RECOMMANDATION r
          JOIN UTILISATEUR u ON r.id_utilisateur = u.id_utilisateur
          ORDER BY r.dateCreation DESC
        `, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}


function getMeilleuresRecommandations(db, limit = 5) {
    return new Promise((resolve, reject) => {
        db.all(`
      SELECT r.*, u.nomUtilisateur as auteur, 
             COALESCE(AVG(c.note), 0) as note_moyenne,
             COUNT(c.id_commentaire) as nombre_commentaires
      FROM RECOMMANDATION r
      JOIN UTILISATEUR u ON r.id_utilisateur = u.id_utilisateur
      LEFT JOIN COMMENTAIRE c ON r.id_recommandation = c.id_recommandation
      GROUP BY r.id_recommandation
      HAVING COUNT(c.id_commentaire) > 0
      ORDER BY note_moyenne DESC
      LIMIT ?
    `, [limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function main() {
    const db = initializeDatabase();

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const utilisateurs = await getUtilisateurs(db);
        console.log('Utilisateurs:', utilisateurs);

        if (utilisateurs.some(u => u.estAdmin === 1)) {
            const adminId = utilisateurs.find(u => u.estAdmin === 1).id_utilisateur;

            try {
                const recetteId = await addRecette(db, {
                    titre: 'Gâteau à l\'ube (Ube Cake)',
                    description: 'Un délicieux gâteau philippin à base d\'ube, une igname violette qui donne une saveur douce et une couleur vibrante',
                    urlImage: '/images/ube-cake.jpg',
                    tempsPreparation: '30 minutes',
                    tempsCuisson: '40 minutes',
                    niveau_difficulte: 'Moyen',
                    ingredients: '200g de purée d\'ube 250g de farine\n150 g de sucre\n100 g de beurre ramolli\n3 œufs\n10 cl de lait de coco\n1 cuillère à café d\'extrait de vanille\n1 cuillère à café de levure chimique',
                    etapes: '1. Préchauffer le four à 180°C (thermostat 6)\n2. Mélanger le beurre ramolli et le sucre jusqu\'à obtenir une texture crémeuse\n3. Ajouter les œufs un par un, en mélangeant bien entre chaque ajout\n4. Incorporer la purée d\'ube et l\'extrait de vanille\n5. Dans un autre bol, mélanger la farine, la levure et le sel\n6. Incorporer progressivement le mélange de farine à la préparation d\'ube, en alternant avec le lait de coco\n7. Verser la pâte dans un moule à gâteau beurré et fariné\n8. Cuire au four pendant 40 minutes, jusqu\'à ce qu\'un couteau inséré au centre ressorte propre\n9. Laisser refroidir avant de démouler et de servir'
                }, adminId);

                console.log('Recette ajoutée avec l\'ID:', recetteId);
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la recette:', error);
            }
        }

        /* Rechercher des recettes contenant "pommes"
        const recettesAvecPommes = await searchRecettes(db, 'pommes');
        console.log('Recettes avec pommes:', recettesAvecPommes);
        */

        // Récupérer les meilleures recommandations
        const recommandations = await getMeilleuresRecommandations(db);
        console.log('Meilleures recommandations:', recommandations);

    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Erreur lors de la fermeture de la base de données:', err);
            } else {
                console.log('Connexion à la base de données fermée');
            }
        });
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    initializeDatabase,
    getUtilisateurs,
    getRecettes,
    searchRecettes,
    addRecette,
    getMeilleuresRecommandations
};