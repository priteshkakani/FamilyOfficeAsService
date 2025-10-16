/// <reference types="cypress" />

describe("Dashboard Login & Render", () => {
  it("logs in and loads dashboard cards", () => {
    cy.login("user@test.com", "password");
    cy.visit("/dashboard");
    cy.contains("Net Worth").should("exist");
    cy.contains("Monthly Income").should("exist");
    cy.contains("Monthly Expenses").should("exist");
    cy.contains("Goals").should("exist");
  });
});
