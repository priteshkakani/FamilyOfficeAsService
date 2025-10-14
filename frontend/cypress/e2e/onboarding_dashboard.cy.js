/// <reference types="cypress" />

describe("Supabase App Onboarding and Dashboard", () => {
  const email = "priteshgkakani@gmail.com";
  const password = "pune1234";

  it("logs in, completes onboarding, and sees Net Worth card", () => {
    // Visit login page
    cy.visit("/login");

    // Login
    cy.get("input[type=email]").type(email);
    cy.get("input[type=password]").type(password);
    cy.get('button[type=submit],button:contains("Sign In")').click();

    // Wait for onboarding wizard
    cy.url().should("include", "/onboarding");
    cy.contains(/profile/i).should("exist");

    // Fill Profile step
    cy.get('input[name="profile.fullName"]').type("Pritesh Kakani");
    cy.get('input[name="profile.mobile"]').type("9999999999");
    cy.get('input[name="profile.city"]').type("Pune");
    cy.get('input[name="profile.country"]').type("India");
    cy.get('input[name="profile.dob"]').type("1990-01-01");
    cy.get('input[name="profile.occupation"]').type("Engineer");
    cy.get('input[name="profile.incomeRange"]').type("10-20L");
    cy.get("button").contains(/next/i).click();

    // Fill Family step
    cy.contains(/family/i).should("exist");
    cy.get("button")
      .contains(/add family member/i)
      .click();
    cy.get('input[name="familyMembers[0].name"]').type("Spouse");
    cy.get('input[name="familyMembers[0].relation"]').type("Wife");
    cy.get("button").contains(/next/i).click();

    // Fill Data step (Assets/Liabilities)
    cy.contains(/assets/i).should("exist");
    cy.get("button")
      .contains(/add asset/i)
      .click();
    cy.get('input[name="assets[0].type"]').type("Bank Account");
    cy.get('input[name="assets[0].value"]').type("100000");
    cy.get("button").contains(/next/i).click();
    cy.contains(/liabilities/i).should("exist");
    cy.get("button")
      .contains(/add liability/i)
      .click();
    cy.get('input[name="liabilities[0].type"]').type("Credit Card");
    cy.get('input[name="liabilities[0].value"]').type("50000");
    cy.get("button")
      .contains(/next|finish|complete/i)
      .click();

    // Should be redirected to dashboard
    cy.url().should("include", "/dashboard");
    cy.contains(/dashboard/i, { matchCase: false }).should("exist");

    // Verify Net Worth card with nonzero value
    cy.contains(/net worth/i).should("exist");
    cy.get("*")
      .contains(/net worth/i)
      .parent()
      .should("contain.text", "₹");
    cy.get("*")
      .contains(/net worth/i)
      .parent()
      .invoke("text")
      .then((text) => {
        const match = text.match(/₹([\d,]+)/);
        expect(match).to.not.be.null;
        const value = parseInt(match[1].replace(/,/g, ""));
        expect(value).to.be.greaterThan(0);
      });
  });
});
