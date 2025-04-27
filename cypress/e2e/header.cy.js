describe("Header général", () => {
  beforeEach(() => {
    cy.visit("/html/index.html");
  });

  it("redirige vers connexion si non connecté", () => {
    localStorage.removeItem("user");
    cy.get(".hamburger").click(); // clique pour ouvrir le menu
    cy.get("#link-compte").click();
    cy.url().should("include", "/html/connexion");
  });

  it("redirige vers mes recommandations si connecté", () => {
    localStorage.setItem("user", JSON.stringify({ id_utilisateur: 1 }));
    cy.reload();
    cy.get(".hamburger").click(); // clique pour ouvrir le menu
    cy.get("#link-compte").click();
    cy.url().should("include", "/html/mes_recommandations");
  });

  it("affiche le bouton de déconnexion si connecté", () => {
    localStorage.setItem("user", JSON.stringify({ id_utilisateur: 1 }));
    cy.reload();
    cy.get("#logout-btn").should("be.visible");
  });

  it("cache le bouton de déconnexion si non connecté", () => {
    localStorage.removeItem("user");
    cy.reload();
    cy.get("#logout-btn").should("not.be.visible");
  });
});
