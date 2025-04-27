# GreenIT

# Projet Ubelicious - GreenIT 2024-2025

## Présentation
Ubelicious est une plateforme web dédiée à la découverte de l'ube violet (igname violet) à travers :
- des recettes 
- des informations sur ses bienfaits
- son histoire culturelle
- et des recommandations personnalisées de lieux

Le projet intègre une partie **front-end** et une partie **back-end** complète.

## Déploiement

Le projet est déployé sur deux plateformes complémentaires :

- Vercel pour la version optimisée du site vitrine (HTML, CSS, JS minifiés), afin de maximiser les performances écologiques.
- Render pour démontrer le bon fonctionnement des fonctionnalités dynamiques (connexion à la base de données SQLite).

### Liens :
- Site optimisé (Vercel) ➔ https://ubelicious-site.vercel.app
- Démonstration avec base de données (Render) ➔ https://greenit-hryk.onrender.com


## Remarques techniques
- Ce dépôt contient à la fois :
  - La partie front-end (HTML/CSS/JS)
  - La partie back-end (Node.js + Express.js + SQLite)
- La base de données SQLite est utilisée pour stocker les utilisateurs, recettes, et recommandations.
- Les utilisateurs peuvent créer un compte, se connecter, ajouter et supprimer leurs recommandations.
- Un administrateur peut ajouter, modifier et supprimer des recettes.

## Technologies utilisées
- HTML5 / CSS3
- JavaScript (Vanilla JS)
- Node.js / Express.js
- SQLite3
- Hébergement : Render

## Structure du projet
```
/
|-- app.js
|-- database.js
|-- package.json
|-- ubelicious.db (base SQLite)
|-- /html
|   |-- index.html
|   |-- bienfait.html
|   |-- histoire.html
|   |-- recommandation.html
|   |-- apropos.html
|   |-- connexion.html
|   |-- compte.html
|   |-- ajout.html
|   |-- reco_ajout.html
|   |-- mes_recommandations.html
|   |-- modifier_recette.html
|-- /css
|   |-- style.css
|   |-- accueil.css
|   |-- recommandation.css
|   |-- ajout.css
|   |-- reco_ajout.css
|-- /js
|   |-- accueil.js
|   |-- recommandation.js
|   |-- header.js
|   |-- compte.js
|   |-- connexion.js
|   |-- modifier_recette.js
|-- /img
|   |-- bienfait_droit.png
|   |-- bienfait_gauche.png
|   |-- bread.png
|   |-- cake.png
|   |-- cookie.png
|   |-- fond_carte.png
|   |-- green_1.png
|   |-- green_2.png
|   |-- green_3.png
|   |-- green_4.png
|   |-- image_recette_droit.png
|   |-- image_recette_gauche.png
|   |-- late.png
|   |-- map_phil.png
|   |-- ube_accueil.png
|   |-- ube_header.png
|   |-- ubelicious_logo.png
|   |-- /icone_svg/
|   |-- /img-originales/
|-- README.md
```

## Fonctionnalités principales
- **Gestion des utilisateurs :**
  - Inscription, connexion et déconnexion.
  - Affichage du bouton "Déconnexion" uniquement si l'utilisateur est connecté.

- **Recettes :**
  - Carrousel interactif de recettes.
  - Ajout, modification et suppression par un administrateur.

- **Recommandations :**
  - Ajout de recommandations personnelles pour les lieux où goûter l'ube.
  - Suppression possible uniquement pour ses propres recommandations.

- **Interface Responsive :**
  - Site adapté pour mobile, tablette et desktop.

## Conventions de contribution
- **Branche de travail :**
  - `main` : branche principale

- **Convention de commit :**
    - `git clone <url-du-depot>`: récupération d'un dépôt distant en local
    - `git add <fichier>`: ajout de fichiers au staging area
    - `git add .`: ajout de tous les fichiers motifiés au staging area
    - `git commit -m "feat: ton message de commit"`: enregistrement des modifications avec un message
    - `git push origin <nom-de-la-branche>`: envoi des commits locaux vers le dépôt distant
    - `git pull origin <nom-de-la-branche>`: récupération et fusion des modifications du dépôt distant
    - `git fetch origin`: récupération des modifications du dépôt distant sans fusion
    - `git checkout <nom-de-la-branche>`: basculement ou création d'une branche / restauration d'un fichier
    - `git checkout -b <nouvelle-branche>`: créer et aller directement sur une nouvelle branche

- **Procédure :**
  - Travailler sur sa propre branche.
  - Faire des pull requests vers `main` après relecture.
 
  ## Tests de fonctionnalités

Des tests de fonctionnalités ont été réalisés avec Cypress pour garantir le bon fonctionnement du site.
Tous les tests ont été validés sur Firefox, Internet Explorer et Electron.

- **Pages testées :**

  - Page d'accueil (`accueil.cy.js`)

    - Affichage du carrousel de recettes
    - Gestion de l'affichage du bouton d'ajout (selon rôle admin)
    - Gestion du menu hamburger

  - Page À propos (`apropos.cy.js`)

    - Présence du texte principal
    - Gestion du menu hamburger

  - Page Création de compte (`compte.cy.js`)

    - Présence des champs du formulaire d'inscription
    - Affichage de la force du mot de passe en direct
    - Navigation entre inscription et connexion
    - Gestion du menu hamburger

  - Page de connexion (`connexion.cy.js`)

    - Présence des formulaires utilisateur et admin
    - Affichage/masquage du mot de passe pour chaque formulaire
    - Navigation entre connexion et création de compte
    - Gestion du menu hamburger

  - Header général (`header.cy.js`)

    - Redirection dynamique selon l'état de connexion de l'utilisateur
    - Affichage/masquage du bouton de déconnexion

  - Page Mes recommandations (`mes_recommandations.cy.js`)

    - Affichage des recommandations pour un utilisateur connecté
    - Message d'information si non connecté
    - Gestion du menu hamburger

  - Page Recommandations (`recommandation.cy.js`)
    - Affichage de la liste de lieux recommandés
    - Accès au formulaire d'ajout pour les utilisateurs connectés
    - Redirection vers la page de connexion pour les utilisateurs non connectés
    - Gestion du menu hamburger

- **Lancer les tests de fonctionnalités :**
  - Installer les dépendences : `npm install cypress` puis `npm install -g serve`
  - Lancer le site dans un terminal : `serve .`
  - Lancer Cypress dans un autre terminal : `npm run test`
  - Sélectionner E2E Testing puis le navigateur de votre choix, et enfin cliquer sur les fichiers de test pour les exécuter

## Équipe
- Loriana RATOVO
- Laura DONATO
- Maël CASTELLAN
- Rémi DESJARDINS
- Anne Laure PARGUET

---

© 2025 - Projet Ubelicious | EFREI Paris
