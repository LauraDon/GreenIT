const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // <-- remplace si ton serveur tourne sur un autre port !
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.js",
    video: false, // optionnel : désactive l'enregistrement vidéo
    chromeWebSecurity: false, // utile si tu fais du localhost et évites des soucis CORS
  },
});
