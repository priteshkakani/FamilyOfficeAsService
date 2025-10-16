import "@cypress/code-coverage/support";

// Add custom commands if needed
Cypress.Commands.add("login", (email, password) => {
  cy.request(
    "POST",
    `${Cypress.env("SUPABASE_URL")}/auth/v1/token?grant_type=password`,
    {
      email,
      password,
    }
  ).then(({ body }) => {
    window.localStorage.setItem("sb-access-token", body.access_token);
    window.localStorage.setItem("sb-refresh-token", body.refresh_token);
  });
});
