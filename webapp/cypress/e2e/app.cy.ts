describe("Main E2E Testing", () => {
  describe("Marketplace App Layout", () => {
    it("should load layout", () => {
      cy.visit("/");
      cy.get("#app-layout").should("exist");
    });
  });
  describe("Marketplace Home Page", () => {
    it("should load home page", () => {
      cy.visit("/");
      cy.get("#collection-showcase").should("exist");
      cy.get("#trending-showcase").should("exist");
      cy.get("#new-showcase").should("exist");
    });
  });
});
