describe("Page À propos", () => {
  beforeEach(() => {
    cy.visit("/html/apropos.html");
  });

  it("affiche le texte principal", () => {
    cy.contains("À propos d'Ubelicious").should("exist");
  });

  it("gère l'ouverture du menu hamburger", () => {
    cy.get(".hamburger").click();
    cy.get("#navbar").should("have.class", "active");
  });
});
