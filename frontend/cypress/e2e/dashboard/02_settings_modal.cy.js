/// <reference types="cypress" />

describe("Dashboard Settings Modal", () => {
  it("opens, edits, and saves settings", () => {
    cy.login("user@test.com", "password");
    cy.visit("/dashboard");
    cy.get('[data-testid="settings-btn"]').click();
    cy.get('input[name="monthly_income"]').clear().type("70000");
    cy.contains("Save").click();
    cy.contains("Settings updated").should("be.visible");
  });
});
