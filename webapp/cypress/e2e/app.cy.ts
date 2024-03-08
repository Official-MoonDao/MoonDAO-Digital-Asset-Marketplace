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

  describe("Marketplace Buy Page", () => {
    it("should load buy page", () => {
      cy.visit("/buy");
      cy.get("#buy-filter").should("exist");
      cy.get("#filtered-assets").should("exist");
    });
  });

  describe("Marketplace Sell Page", () => {
    it("should load sell page", () => {
      cy.visit("/sell");
      cy.get("#sell-page-no-assets").should("exist");
    });
  });
});

export {};
