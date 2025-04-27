describe("Page Recommandations", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/html/recommandation.html");
  });

  it("affiche la liste des lieux recommandés", () => {
    cy.get("#liste-lieux").should("exist");
  });

  it("ouvre l'overlay d'ajout si utilisateur connecté", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("connected", "true");
      win.localStorage.setItem("user", JSON.stringify({ id_utilisateur: 1 }));
    });
    cy.reload();
    cy.get("#btn-overlay-add", { timeout: 8000 }) // attend plus longtemps
      .should("exist")
      .should("be.visible")
      .then(($btn) => {
        // Ajout : attendre que l'eventListener soit en place
        cy.wrap($btn).click();
      });
    cy.get("#overlay-ajout", { timeout: 8000 }).should(
      "not.have.class",
      "hidden"
    );
  });

  it("redirige vers connexion si utilisateur non connecté", () => {
    cy.clearLocalStorage();
    cy.reload();
    cy.window().then((win) => {
      cy.stub(win, "alert").callsFake(() => {}); // << ignore l'alerte
    });
    cy.get("#btn-overlay-add").click();
    cy.url().should("include", "/html/connexion");
  });

  it("gère le menu hamburger", () => {
    cy.get(".hamburger").click();
    cy.get("#navbar").should("have.class", "active");
  });
});
