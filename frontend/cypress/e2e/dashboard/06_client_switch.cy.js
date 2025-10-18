/// <reference types="cypress" />

describe("Client switcher", () => {
  it("switches client context and refreshes widgets", () => {
    cy.login("advisor@test.com", "password");
    cy.visit("/dashboard");
    cy.get('[data-testid="client-select"]')
      .should("exist")
      .then(($sel) => {
        // choose first option
        cy.wrap($sel).select($sel.find("option").first().val());
      });
    cy.get('[data-testid="refresh-btn"]').click();
    cy.get('[data-testid="kpi-networth"]', { timeout: 5000 }).should("exist");
  });
});
