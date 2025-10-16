/// <reference types="cypress" />

const waitForDashboard = () =>
  cy.location("pathname", { timeout: 10000 }).should("eq", "/dashboard");
const waitForOnboarding = () =>
  cy.location("pathname", { timeout: 10000 }).should("eq", "/onboarding");
const waitForLogin = () =>
  cy.location("pathname", { timeout: 10000 }).should("eq", "/login");

describe("Family Office as a Service E2E", () => {
  const email = "e2euser@example.com";
  const password = "TestPassword123!";

  beforeEach(() => {
    cy.viewport(1280, 800);
    // No XHR intercepts needed for DOM-based waits
  });

  it("signup, onboarding, dashboard navigation, logout", () => {
    cy.signup(email, password);
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    waitForOnboarding();
    cy.contains(/onboarding|profile/i, { timeout: 8000 }).should("be.visible");
    cy.get("button")
      .contains(/next|continue|finish|complete/i)
      .click({ multiple: true, force: true });
    cy.get('[data-testid="finish-onboarding"]', { timeout: 8000 }).click();
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    waitForDashboard();
    cy.contains(/dashboard/i, { timeout: 8000 }).should("be.visible");
    cy.logout();
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    waitForLogin();
  });

  it("login, onboarding redirect, dashboard", () => {
    cy.login(email, password);
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    cy.location("pathname", { timeout: 10000 }).should(
      "match",
      /onboarding|dashboard/
    );
    // If on onboarding page, complete it
    cy.location("pathname").then((path) => {
      if (path.includes("onboarding")) {
        cy.get('[data-testid="finish-onboarding"]', { timeout: 8000 }).click();
        cy.get('[data-testid="loading"]', { timeout: 10000 }).should(
          "not.exist"
        );
        waitForDashboard();
      }
    });
    cy.contains(/dashboard/i, { timeout: 8000 }).should("be.visible");
  });

  it("forgot password flow", () => {
    cy.visit("/forgot-password");
    cy.get('input[name="email"]').type(email);
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="forgot-success"]', { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("viewport and error handling", () => {
    cy.viewport("iphone-6");
    cy.visit("/login");
    cy.get("input[type=email]").type(email);
    cy.get("input[type=password]").type("wrongpassword");
    cy.intercept("POST", "**/auth/v1/token", {
      statusCode: 401,
      body: { error: "Invalid login" },
    });
    cy.get("button[type=submit]").click();
    cy.contains(/invalid|error|failed/i).should("exist");
  });
});
