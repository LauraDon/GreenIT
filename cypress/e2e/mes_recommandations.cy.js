describe("Page Mes recommandations", () => {
  beforeEach(() => {
    cy.visit("/html/mes_recommandations.html");
  });

  it("affiche un message si utilisateur non connecté", () => {
    localStorage.removeItem("user");
    cy.reload();
    cy.contains("Vous devez être connecté").should("exist");
  });

  it("affiche les recommandations de l'utilisateur connecté", () => {
    localStorage.setItem("user", JSON.stringify({ id_utilisateur: 1 }));
    cy.reload();
    cy.get("#reco-container").should("exist");
  });

  it("gère l'affichage du menu hamburger", () => {
    cy.get(".hamburger").click();
    cy.get("#navbar").should("have.class", "active");
  });
});
