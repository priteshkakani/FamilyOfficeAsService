// Wrapper for Supabase POST/PATCH with Prefer: 'return=representation' and safe response array handling
Cypress.Commands.add("supabaseRequest", (options) => {
  const method = options.method || "POST";
  const headers = {
    ...options.headers,
    Prefer: "return=representation",
  };
  return cy
    .request({
      ...options,
      method,
      headers,
      failOnStatusCode: false,
    })
    .then((resp) => {
      // Always return the response for further chaining
      return resp;
    });
});
Cypress.Commands.add("loginAsTestUser", () => {
  const email = Cypress.env("TEST_USER_EMAIL");
  const password = Cypress.env("TEST_USER_PASSWORD");
  // Try to sign up (ignore error if already exists)
  cy.request({
    method: "POST",
    url: `${Cypress.env("SUPABASE_URL")}/auth/v1/signup`,
    body: { email, password },
    headers: {
      apikey: Cypress.env("SUPABASE_ANON_KEY"),
      "Content-Type": "application/json",
    },
    failOnStatusCode: false,
  }).then(() => {
    // Always log in after attempting signup
    cy.request({
      method: "POST",
      url: `${Cypress.env("SUPABASE_URL")}/auth/v1/token?grant_type=password`,
      body: { email, password },
      headers: {
        apikey: Cypress.env("SUPABASE_ANON_KEY"),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      Cypress.env("access_token", res.body.access_token);
      Cypress.env("user_id", res.body.user.id);
    });
  });
});
// cypress/support/commands.js
// Custom Cypress commands for Family Office as a Service

Cypress.Commands.add("signup", (email, password) => {
  cy.visit("/signup");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login");
  cy.get('input[type=email],input[name="email"]').type(email);
  cy.get('input[type=password],input[name="password"]').type(password);
  cy.get('button[type=submit],button:contains("Sign In")').click();
});

Cypress.Commands.add("logout", () => {
  cy.get("button, a")
    .contains(/logout|sign out/i)
    .click({ force: true });
});

// Add more reusable commands as needed
