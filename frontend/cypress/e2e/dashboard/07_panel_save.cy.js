// Cypress E2E: Dashboard panel and save tests
// This test clicks each dashboard tab, verifies panel renders, edits a field, saves, checks toast, reloads, and verifies persistence.

/// <reference types="cypress" />

describe("Dashboard Panel E2E", () => {
  beforeEach(() => {
    cy.login(); // custom command for login
    cy.visit("/dashboard");
  });

  const panels = [
    {
      tab: "Portfolio",
      testId: "panel-portfolio",
      table: "assets-table",
      saveBtn: "btn-save-portfolio",
    },
    {
      tab: "Cashflow",
      testId: "panel-cashflow",
      table: "cashflow-table",
      saveBtn: "btn-save-cashflow",
    },
    {
      tab: "Liabilities",
      testId: "panel-liabilities",
      table: "liabilities-table",
      saveBtn: "btn-save-liability",
    },
    {
      tab: "Family",
      testId: "panel-family",
      table: "family-table",
      saveBtn: "btn-save-family",
    },
    { tab: "Goals", testId: "panel-goals", table: "goals-list" },
    { tab: "Documents", testId: "panel-documents", table: "docs-list" },
    { tab: "Audit", testId: "panel-audit", table: "audit-feed" },
  ];

  panels.forEach((panel) => {
    it(`should render and save in ${panel.tab} panel`, () => {
      cy.get(`[data-testid="tab-${panel.tab.toLowerCase()}"]`).click();
      cy.get(`[data-testid="${panel.testId}"]`).should("exist");
      cy.get(`[data-testid="${panel.table}"]`).should("exist");
      if (panel.saveBtn) {
        // Edit first input in table and save
        cy.get(`[data-testid="${panel.table}"] input`)
          .first()
          .clear()
          .type("12345");
        cy.get(`[data-testid="${panel.saveBtn}"]`).click();
        cy.get(".toast-success").should("exist");
        cy.reload();
        cy.get(`[data-testid="${panel.table}"] input`)
          .first()
          .should("have.value", "12345");
      }
    });
  });
});
