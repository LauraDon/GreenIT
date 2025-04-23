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

app.get('/api/recommandations', async(req, res) => {
    try {
        const recommandations = await db.getAllRecommandations(database);
        res.json(recommandations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
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

app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});