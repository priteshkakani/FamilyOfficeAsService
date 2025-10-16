/// <reference types="cypress" />

describe("Dashboard Goals Section", () => {
  it("adds a goal and verifies list update", () => {
    cy.login("user@test.com", "password");
    cy.visit("/dashboard");
    cy.contains("Add Goal").click();
    cy.get('input[placeholder="Goal Name"]').type("Vacation");
    cy.get('input[placeholder="Amount"]').type("50000");
    cy.contains("Save").click();
    cy.contains("Vacation").should("exist");
  });
});
