const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/html', express.static(__dirname + '/html'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});


const database = db.initializeDatabase();

app.get('/api/recettes', async(req, res) => {
    try {
        const recettes = await db.getRecettes(database);
        res.json(recettes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.get('/api/recettes/search', async(req, res) => {
    try {
        const keyword = req.query.q || '';
        const recettes = await db.searchRecettes(database, keyword);
        res.json(recettes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/recettes', async(req, res) => {
    try {
        const userId = req.body.userId || 1; // ID admin par défaut
        const recetteId = await db.addRecette(database, req.body.recette, userId);
        res.status(201).json({ id: recetteId, message: 'Recette ajoutée avec succès' });
    } catch (error) {
        console.error(error);
        if (error.message.includes('administrateurs')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
});

app.get('/api/recommandations/utilisateur/:id', async(req, res) => {
    try {
        const recommandations = await db.getRecommandationsByUser(database, req.params.id);
        res.json(recommandations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur récupération recommandations utilisateur' });
    }
});

app.get('/api/recommandations', async(req, res) => {
    try {
        const recommandations = await db.getAllRecommandations(database);
        console.log("RECOMMANDATIONS :", recommandations);
        res.json(recommandations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur récupération des recommandations' });
    }
});

app.get('/api/recommandations/meilleures', async(req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const recommandations = await db.getMeilleuresRecommandations(database, limit);
        res.json(recommandations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Ajouter une recommandation
app.post('/api/recommandations', async(req, res) => {
    try {
        const { titre, lieu, contenu, id_utilisateur } = req.body;

        if (!titre || !lieu || !contenu || !id_utilisateur) {
            return res.status(400).json({ error: 'Champs manquants' });
        }

        await db.addRecommandation(database, { titre, lieu, contenu, id_utilisateur });
        res.status(201).json({ message: 'Recommandation ajoutée avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Création de compte utilisateur
app.post('/api/register', async(req, res) => {
    const { nom, prenom, email, password } = req.body;

    if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        const utilisateur = await db.createUtilisateur(database, nom, prenom, email, password);
        res.status(201).json({ message: "Compte créé avec succès", utilisateur });
    } catch (error) {
        console.error("Erreur création utilisateur:", error.message);
        res.status(500).json({ message: "Erreur serveur lors de la création du compte." });
    }
});

// Supprimer une recette
app.delete('/api/recettes/:id', async(req, res) => {
    try {
        await db.deleteRecette(database, req.params.id);
        res.status(200).json({ message: 'Recette supprimée' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur suppression recette' });
    }
});

// Supprimer une recommandation
app.delete('/api/recommandations/:id', async(req, res) => {
    try {
        await db.deleteRecommandation(database, req.params.id);
        res.status(200).json({ message: 'Recommandation supprimée' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur suppression recommandation' });
    }
});


// Connexion utilisateur
app.post('/api/login', async(req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const utilisateur = await db.getUtilisateurByEmail(database, email);

        if (!utilisateur || utilisateur.motDePasse !== motDePasse) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }

        res.json({ message: 'Connexion réussie', utilisateur });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Connexion administrateur
app.post('/api/admin/login', async(req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const utilisateur = await db.getUtilisateurByEmail(database, email);

        if (!utilisateur || utilisateur.motDePasse !== motDePasse || utilisateur.estAdmin !== 1) {
            return res.status(401).json({ error: 'Identifiants incorrects ou non administrateur' });
        }

        res.json({ message: 'Connexion administrateur réussie', utilisateur });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});