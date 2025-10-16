/// <reference types="cypress" />

describe("Dashboard Chart Render", () => {
  it("renders income and asset allocation charts", () => {
    cy.login("user@test.com", "password");
    cy.visit("/dashboard");
    cy.get('[data-testid="income-chart"]').should("exist");
    cy.get('[data-testid="asset-allocation-chart"]').should("exist");
  });
});
