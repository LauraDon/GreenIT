describe("Page d'accueil", () => {
  beforeEach(() => {
    cy.visit("/html/index.html");
  });

  it("affiche le carrousel de recettes", () => {
    cy.get("#carousel").should("exist");
  });

  it("ouvre l'overlay d'ajout de recette si admin", () => {
    localStorage.setItem("user", JSON.stringify({ estAdmin: 1 }));
    cy.reload();
    cy.get("#btn-ajout-recette").click();
    cy.get("#overlay-ajout").should("not.have.class", "hidden");
  });

  it("n'affiche pas le bouton d'ajout si non admin", () => {
    localStorage.removeItem("user");
    cy.reload();
    cy.get("#btn-ajout-recette").should("not.be.visible");
  });

  it("gère le menu hamburger", () => {
    cy.get(".hamburger").click();
    cy.get("#navbar").should("have.class", "active");
  });
});
