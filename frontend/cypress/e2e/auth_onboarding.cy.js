describe("Authentication and Onboarding Flow", () => {
  it("should sign up, login, and complete onboarding", () => {
    cy.visit("/signup");
    cy.get('input[name="email"]').type("testuser@example.com");
    cy.get('input[name="password"]').type("testpassword");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/onboarding");
    cy.get("button")
      .contains(/complete onboarding/i)
      .click();
    cy.url().should("include", "/dashboard");
  });

  it("should redirect to onboarding if not onboarded", () => {
    cy.login("notonboarded@example.com", "testpassword"); // custom command
    cy.visit("/dashboard");
    cy.url().should("include", "/onboarding");
  });

  it("should allow forgot password flow", () => {
    cy.visit("/forgot-password");
    cy.get('input[name="email"]').type("testuser@example.com");
    cy.get('button[type="submit"]').click();
    cy.contains(/check your email/i).should("exist");
  });
});
