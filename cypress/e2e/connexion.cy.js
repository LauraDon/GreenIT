describe("Page de connexion", () => {
  beforeEach(() => {
    cy.visit("/html/connexion.html");
  });

  it("affiche les formulaires de connexion utilisateur et admin", () => {
    cy.get(".login-box").should("have.length", 2);
  });

  it("gère l'affichage du mot de passe utilisateur", () => {
    cy.get("#user-password").type("MotDePasse");
    cy.get(".login-box:nth-of-type(1) .toggle-password").click();
    cy.get("#user-password").should("have.attr", "type", "text");
  });

  it("gère l'affichage du mot de passe admin", () => {
    cy.get("#admin-password").type("AdminMotDePasse");
    cy.get(".login-box:nth-of-type(2) .toggle-password").click();
    cy.get("#admin-password").should("have.attr", "type", "text");
  });

  it("ouvre le menu hamburger", () => {
    cy.get(".hamburger").click();
    cy.get("#navbar").should("have.class", "active");
  });

  it('redirige vers création de compte depuis "Pas encore inscrit"', () => {
    cy.get(".register a").click();
    cy.url().should("include", "/html/compte");
  });
});
