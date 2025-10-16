const waitForDashboard = () =>
  cy.location("pathname", { timeout: 10000 }).should("eq", "/dashboard");
const waitForOnboarding = () =>
  cy.location("pathname", { timeout: 10000 }).should("eq", "/onboarding");

describe("Authentication and Onboarding Flow", () => {
  it("should sign up, login, and complete onboarding", () => {
    cy.visit("/signup");
    cy.get('input[name="email"]').type("testuser@example.com");
    cy.get('input[name="password"]').type("testpassword");
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    waitForOnboarding();
    cy.get("button")
      .contains(/complete onboarding/i)
      .click();
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    waitForDashboard();
    cy.contains(/dashboard/i, { timeout: 8000 }).should("be.visible");
  });

  it("should redirect to onboarding if not onboarded", () => {
    cy.login("notonboarded@example.com", "testpassword"); // custom command
    cy.visit("/dashboard");
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    waitForOnboarding();
    cy.contains(/onboarding/i, { timeout: 8000 }).should("be.visible");
  });

  it("should allow forgot password flow", () => {
    cy.visit("/forgot-password");
    cy.get('input[name="email"]').type("testuser@example.com");
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="forgot-success"]', { timeout: 8000 }).should("exist");
  });
});
