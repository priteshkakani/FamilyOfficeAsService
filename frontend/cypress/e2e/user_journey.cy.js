/// <reference types="cypress" />

// This test simulates a full user journey: login, onboarding, data entry, dashboard summary

describe("FamilyOfficeAsService User Journey", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/auth/v1/token?grant_type=password").as(
      "supabaseLogin"
    );
    cy.intercept("POST", "**/auth/v1/token?grant_type=refresh_token").as(
      "supabaseRefresh"
    );
    cy.intercept("POST", "**/auth/v1/signup").as("supabaseSignup");
    cy.intercept("POST", "**/auth/v1/recover").as("supabaseForgot");
    cy.intercept("PATCH", "**/rest/v1/profiles*").as("patchProfile");
    cy.intercept("GET", "**/rest/v1/profiles*").as("getProfile");
    cy.intercept("GET", "**/rest/v1/assets*").as("getAssets");
    cy.intercept("GET", "**/rest/v1/liabilities*").as("getLiabilities");
  });
  const email = "priteshgkakani@gmail.com";
  const password = "pune1234";

  it("logs in, completes onboarding, inserts data, and sees dashboard summary", () => {
    // Visit login page
    cy.visit("/login");
    cy.get('[data-testid="loading"]').should("not.exist");

    // Login via Supabase
    cy.get("input[type=email]").type(email);
    cy.get("input[type=password]").type(password);
    cy.get('button[type=submit],button:contains("Sign In")').click();
    cy.wait(["@supabaseLogin", "@getProfile"]);
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");

    // Wait for onboarding wizard to appear
    cy.url().should("include", "/onboarding");
    cy.contains("Onboarding").should("exist");

    // Fill onboarding wizard (example fields, adjust selectors as needed)
    cy.get('input[name="profile.fullName"]').type("Pritesh Kakani");
    cy.get('input[name="profile.email"]').should("have.value", email);
    cy.get('input[name="profile.mobile"]').type("9999999999");
    cy.get('input[name="profile.city"]').type("Pune");
    cy.get('input[name="profile.country"]').type("India");
    cy.get('input[name="profile.dob"]').type("1990-01-01");
    cy.get('input[name="profile.occupation"]').type("Engineer");
    cy.get('input[name="profile.incomeRange"]').type("10-20L");
    cy.get("button").contains(/next/i).click();

    // Add a family member
    cy.get("button")
      .contains(/add family member/i)
      .click();
    cy.get('input[name="familyMembers[0].name"]').type("Spouse");
    cy.get('input[name="familyMembers[0].relation"]').type("Wife");
    cy.get("button").contains(/next/i).click();

    // Add an asset
    cy.get("button")
      .contains(/add asset/i)
      .click();
    cy.get('input[name="assets[0].type"]').type("Bank Account");
    cy.get('input[name="assets[0].value"]').type("100000");
    cy.get("button").contains(/next/i).click();

    // Add a liability
    cy.get("button")
      .contains(/add liability/i)
      .click();
    cy.get('input[name="liabilities[0].type"]').type("Credit Card");
    cy.get('input[name="liabilities[0].value"]').type("50000");
    cy.get("button").contains(/next/i).click();

    // Complete onboarding
    cy.get("button")
      .contains(/finish|complete/i)
      .click();

    // Should be redirected to dashboard
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard").should("exist");

    // Check summary cards (example: Assets, Liabilities)
    cy.contains("Assets").should("exist");
    cy.contains("Liabilities").should("exist");
    cy.contains("₹100,000").should("exist");
    cy.contains("₹50,000").should("exist");
  });
});
