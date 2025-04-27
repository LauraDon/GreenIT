/*
  Projet: Green IT - Ubelicious
  Créé par: Maël Castellan, Laura Donato, Rémi Desjardins, Anne-Laure Parguet et Loriana Ratovo
*/

// Import des modules nécessaires
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON et les données URL encodées
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Définir des chemins statiques pour accéder aux fichiers CSS, JS, images et HTML
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/html", express.static(__dirname + "/html"));

// Route racine : redirige vers index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});

// Initialise la base de données
const database = db.initializeDatabase();

// API : récupérer toutes les recettes
app.get("/api/recettes", async (req, res) => {
  try {
    const recettes = await db.getRecettes(database);
    res.json(recettes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// API : ajouter une recette
app.post("/api/recettes", async (req, res) => {
  try {
    const userId = req.body.userId || 1; // Admin par défaut
    const recetteId = await db.addRecette(database, req.body.recette, userId);
    res
      .status(201)
      .json({ id: recetteId, message: "Recette ajoutée avec succès" });
  } catch (error) {
    console.error(error);
    if (error.message.includes("administrateurs")) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
});

// API : récupérer les recommandations d'un utilisateur
app.get("/api/recommandations/utilisateur/:id", async (req, res) => {
  try {
    const recommandations = await db.getRecommandationsByUser(
      database,
      req.params.id
    );
    res.json(recommandations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur récupération recommandations utilisateur" });
  }
});

// API : récupérer toutes les recommandations
app.get("/api/recommandations", async (req, res) => {
  try {
    const recommandations = await db.getAllRecommandations(database);
    console.log("RECOMMANDATIONS :", recommandations);
    res.json(recommandations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur récupération des recommandations" });
  }
});

// API : récupérer une recette par son ID
app.get("/api/recettes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const recette = await db.getRecetteById(database, id);

    if (!recette) {
      return res.status(404).json({ error: "Recette non trouvée" });
    }
    res.json(recette);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// API : ajouter une nouvelle recommandation
app.post("/api/recommandations", async (req, res) => {
  try {
    const { titre, lieu, contenu, id_utilisateur } = req.body;

    if (!titre || !lieu || !contenu || !id_utilisateur) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    await db.addRecommandation(database, {
      titre,
      lieu,
      contenu,
      id_utilisateur,
    });
    res.status(201).json({ message: "Recommandation ajoutée avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// API : création d'un compte utilisateur
app.post("/api/register", async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const utilisateur = await db.createUtilisateur(
      database,
      nom,
      prenom,
      email,
      password
    );
    res.status(201).json({ message: "Compte créé avec succès", utilisateur });
  } catch (error) {
    console.error("Erreur création utilisateur:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création du compte." });
  }
});

// API : suppression d'une recette
app.delete("/api/recettes/:id", async (req, res) => {
  try {
    await db.deleteRecette(database, req.params.id);
    res.status(200).json({ message: "Recette supprimée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression recette" });
  }
});

// API : suppression d'une recommandation
app.delete("/api/recommandations/:id", async (req, res) => {
  try {
    await db.deleteRecommandation(database, req.params.id);
    res.status(200).json({ message: "Recommandation supprimée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur suppression recommandation" });
  }
});

// API : connexion utilisateur
app.post("/api/login", async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const utilisateur = await db.getUtilisateurByEmail(database, email);

    if (!utilisateur || utilisateur.motDePasse !== motDePasse) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    res.json({ message: "Connexion réussie", utilisateur });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// API : connexion administrateur
app.post("/api/admin/login", async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const utilisateur = await db.getUtilisateurByEmail(database, email);

    if (
      !utilisateur ||
      utilisateur.motDePasse !== motDePasse ||
      utilisateur.estAdmin !== 1
    ) {
      return res
        .status(401)
        .json({ error: "Identifiants incorrects ou non administrateur" });
    }

    res.json({ message: "Connexion administrateur réussie", utilisateur });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// API : modification d'une recette existante
app.put("/api/recettes/:id", async (req, res) => {
  try {
    const recetteId = req.params.id;
    const nouvelleRecette = req.body;

    await db.updateRecette(database, recetteId, nouvelleRecette);
    res.status(200).json({ message: "Recette modifiée avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la recette" });
  }
});

// Lance le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
