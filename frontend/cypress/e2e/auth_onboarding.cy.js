describe("Authentication and Onboarding Flow", () => {
  it("should sign up, login, and complete onboarding", () => {
    cy.visit("/signup");
    cy.get('input[name="email"]').type("testuser@example.com");
    cy.get('input[name="password"]').type("testpassword");
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="loading"]').should("not.exist");
    cy.url().should("include", "/onboarding");
    cy.get("button")
      .contains(/complete onboarding/i)
      .click();
    cy.get('[data-testid="loading"]').should("not.exist");
    cy.url().should("include", "/dashboard");
  });

  it("should redirect to onboarding if not onboarded", () => {
    cy.login("notonboarded@example.com", "testpassword"); // custom command
    cy.visit("/dashboard");
    cy.get('[data-testid="loading"]').should("exist");
    cy.get('[data-testid="loading"]').should("not.exist");
    cy.url().should("include", "/onboarding");
  });

  it("should allow forgot password flow", () => {
    cy.visit("/forgot-password");
    cy.get('input[name="email"]').type("testuser@example.com");
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="forgot-success"]').should("exist");
  });
});
beforeEach(() => {
  cy.intercept("POST", "**/auth/v1/token?grant_type=password").as(
    "supabaseLogin"
  );
  cy.intercept("POST", "**/auth/v1/token?grant_type=refresh_token").as(
    "supabaseRefresh"
  );
  cy.intercept("POST", "**/auth/v1/recover").as("recover");
  cy.intercept("GET", "**/rest/v1/profiles*").as("getProfile");
});

it("should sign up, login, and complete onboarding", () => {
  cy.visit("/signup");
  cy.get('[data-testid="loading"]').should("not.exist");
  cy.get('input[name="email"]').type("testuser@example.com");
  cy.get('input[name="password"]').type("testpassword");
  cy.get('button[type="submit"]').click();
  cy.wait("@supabaseLogin");
  cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
  cy.url().should("include", "/onboarding");
  cy.get("button")
    .contains(/complete onboarding/i)
    .click();
  cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
  cy.url().should("include", "/dashboard");
});

it("should redirect to onboarding if not onboarded", () => {
  cy.login("notonboarded@example.com", "testpassword");
  cy.visit("/dashboard");
  cy.get('[data-testid="loading"]').should("not.exist");
  cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
  cy.url().should("include", "/onboarding");
});

it("should allow forgot password flow", () => {
  cy.visit("/forgot-password");
  cy.get('input[name="email"]').type("testuser@example.com");
  cy.get('button[type="submit"]').click();
  cy.wait("@recover");
  cy.get('[data-testid="forgot-success"]', { timeout: 10000 }).should(
    "be.visible"
  );
});
