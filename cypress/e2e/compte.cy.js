describe("Page Création de compte", () => {
  beforeEach(() => {
    cy.visit("/html/compte.html");
  });

  it("affiche le formulaire d'inscription", () => {
    cy.get("form#register-form").should("exist");
    cy.get("input#nom").should("exist");
    cy.get("input#prenom").should("exist");
    cy.get("input#email").should("exist");
    cy.get("input#password").should("exist");
    cy.get("input#confirm-password").should("exist");
  });

  it("affiche la force du mot de passe pendant la saisie", () => {
    cy.get("#password").type("Test123!");
    cy.get("#password-strength-bar")
      .should("have.css", "width")
      .and("not.eq", "0%");
  });

  it("ouvre le menu hamburger", () => {
    cy.get(".hamburger").click();
    cy.get("#navbar").should("have.class", "active");
  });

  it("redirige vers connexion depuis lien déjà inscrit", () => {
    cy.get(".register a").click();
    cy.url().should("include", "/html/connexion");
  });
});
