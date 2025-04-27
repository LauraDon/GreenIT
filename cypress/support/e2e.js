// cypress/support/e2e.js

// Ceci sera exécuté avant chaque fichier de test.

// Tu peux ajouter ici des commandes globales, des hooks, des imports, etc.

// Exemple : nettoyer le localStorage avant chaque test
beforeEach(() => {
  cy.clearLocalStorage();
});

// Exemple : affichage dans la console au début d'un test
before(() => {
  console.log("--- Début des tests Cypress ---");
});

// Exemple : affichage à la fin
after(() => {
  console.log("--- Fin des tests Cypress ---");
});

// Tu peux aussi ajouter des commandes personnalisées ici si besoin plus tard
