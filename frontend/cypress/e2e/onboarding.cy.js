/// <reference types="cypress" />

describe("Onboarding E2E", () => {
  it("completes the onboarding flow", () => {
    cy.visit("/onboarding");
    cy.contains("Full Name").type("John Doe");
    cy.contains("Email").type("john@example.com");
    cy.contains("Mobile Number").type("9999999999");
    cy.contains("Next").click();
    cy.contains("Add Family Member").click();
    cy.get('input[placeholder="Name"]').type("Jane Doe");
    cy.get('input[placeholder="Relation"]').type("Spouse");
    cy.contains("Next").click();
    cy.contains("Bank").click();
    cy.contains("Connect").click();
    cy.contains("Next").click();
    cy.contains("Monthly Income").type("50000");
    cy.contains("Monthly Expenses").type("20000");
    cy.contains("Next").click();
    cy.contains("Total Liabilities").type("100000");
    cy.contains("Monthly EMI").type("5000");
    cy.contains("Next").click();
    cy.contains("Add Goal").click();
    cy.get('input[placeholder="Goal Name"]').type("Buy House");
    cy.get('input[placeholder="Amount"]').type("10000000");
    cy.contains("Finish").click();
    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, John Doe");
  });
});
