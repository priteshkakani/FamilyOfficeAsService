/// <reference types="cypress" />

describe("Family Office as a Service E2E", () => {
  const email = "e2euser@example.com";
  const password = "TestPassword123!";

  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.intercept("GET", "**/rest/v1/profiles*").as("getProfile");
    cy.intercept("POST", "**/auth/v1/token?grant_type=password").as(
      "supabaseLogin"
    );
    cy.intercept("POST", "**/auth/v1/signup").as("supabaseSignup");
    cy.intercept("POST", "**/auth/v1/recover").as("supabaseForgot");
    cy.intercept("PATCH", "**/rest/v1/profiles*").as("patchProfile");
    cy.intercept("GET", "**/rest/v1/assets*").as("getAssets");
    cy.intercept("GET", "**/rest/v1/liabilities*").as("getLiabilities");
  });

  it("signup, onboarding, dashboard navigation, logout", () => {
    cy.signup(email, password);
    cy.wait(["@supabaseSignup"]);
    cy.get('[data-testid="loading"]').should("not.exist");
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    cy.url().should("include", "/onboarding");
    cy.contains(/profile/i).should("exist");
    cy.get("button")
      .contains(/next|continue/i)
      .click({ multiple: true, force: true });
    cy.get('[data-testid="finish-onboarding"]').click();
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    cy.url().should("include", "/dashboard");
    cy.contains(/dashboard/i).should("exist");
    cy.logout();
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    cy.url().should("include", "/login");
  });

  it("login, onboarding redirect, dashboard", () => {
    cy.login(email, password);
    cy.wait(["@supabaseLogin"]);
    cy.get('[data-testid="loading"]').should("not.exist");
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    cy.url().should("include", "/onboarding");
    cy.get('[data-testid="finish-onboarding"]').click();
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    cy.url().should("include", "/dashboard");
  });

  it("forgot password flow", () => {
    cy.visit("/forgot-password");
    cy.get('input[name="email"]').type(email);
    cy.get('button[type="submit"]').click();
    cy.wait("@supabaseForgot");
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
