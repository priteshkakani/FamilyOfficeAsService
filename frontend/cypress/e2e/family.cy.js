describe('Family onboarding flow', () => {
  it('adds a member and persists after reload', () => {
    // This is a high-level E2E spec; it assumes the test environment has a running frontend
    // and a Supabase test instance configured via Cypress env variables.
    cy.visit('/onboarding');

    // Fill profile step if required by flow (adjust selectors if necessary)
    cy.get('[data-testid="input-full_name"]').type('Test User');
    cy.get('[data-testid="btn-save-profile"]').click();

    // On Family step, add a member
    cy.get('[data-testid="family-name-input"]').type('E2E Member');
    cy.get('[data-testid="family-add-btn"]').click();

    // Confirm list updated
    cy.contains('E2E Member').should('exist');

    // Reload and ensure member persists
    cy.reload();
    cy.contains('E2E Member').should('exist');
  });
});
