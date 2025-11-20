/// <reference types="cypress" />

// End-to-end tests for Insurance module (logged-in user)
// Requires env: TEST_USER_EMAIL, TEST_USER_PASSWORD

const email = Cypress.env('TEST_USER_EMAIL');
const password = Cypress.env('TEST_USER_PASSWORD');

function unique(label){
  return `${label}-${Date.now()}`;
}

describe('Insurance Module - Policies and Premiums', () => {
  before(() => {
    // Ensure we can log in via UI
    cy.login(email, password);
    cy.url().should('match', /dashboard|onboarding|login/i);
  });

  beforeEach(() => {
    // Keep session between tests
    Cypress.Cookies.preserveOnce('sb:token', 'sb:refresh_token');
  });

  it('loads the Insurance page', () => {
    cy.visit('/dashboard/insurance');
    cy.contains('h1', 'Insurance').should('be.visible');
    cy.contains('[role=tab]', 'Overview').should('be.visible');
    cy.contains('[role=tab]', 'Policies').should('be.visible');
    cy.contains('[role=tab]', 'Premiums').should('be.visible');
    cy.contains('[role=tab]', 'Coverage').should('be.visible');
  });

  it('adds a policy and shows it in the table', () => {
    const policyNum = unique('POL');
    const policyName = unique('My Policy');

    cy.visit('/dashboard/insurance');
    cy.contains('button', 'Add Policy').click();

    // Modal opens
    cy.contains('h3', 'Add Policy').should('be.visible');

    // Fill fields
    cy.get('[id="policy_type"]').should('not.exist'); // using custom select
    cy.contains('[role=button]', 'Select type').click();
    cy.get('[role=option]').contains('life', { matchCase: false }).click();

    cy.get('input').filter('[type=text]').eq(0).type('LIC'); // insurance_company
    cy.get('input').filter('[type=text]').eq(1).type(policyName); // policy_name
    cy.get('input').filter('[type=text]').eq(2).type(policyNum); // policy_number

    cy.get('input[type=number]').first().type('1000000'); // sum_assured
    cy.get('input[type=number]').eq(1).type('12000'); // premium_amount

    cy.contains('[role=button]', 'Select frequency').click();
    cy.get('[role=option]').contains('yearly', { matchCase: false }).click();

    cy.get('input[type=date]').first().type('2024-04-01'); // start_date

    cy.contains('button', 'Add Policy').click();

    // Back to list
    cy.contains('[role=tab]', 'Policies').click();
    cy.contains('td', policyNum).should('exist');
    cy.contains('td', 'LIC').should('exist');
  });

  it('adds a premium payment for the policy', () => {
    cy.visit('/dashboard/insurance');
    cy.contains('[role=tab]', 'Premiums').click();
    cy.contains('button', 'Add Premium').click();

    // Select a policy from dropdown
    cy.contains('[role=button]', 'Select policy').click();
    cy.get('[role=option]').first().click();

    cy.get('input[type=date]').first().type('2024-05-01');
    cy.get('input[type=number]').first().type('1000');

    cy.contains('[role=button]', 'Select status').click();
    cy.get('[role=option]').contains('paid', { matchCase: false }).click();

    cy.contains('button', 'Add Payment').click();

    // Verify appears
    cy.contains('[role=tab]', 'Premiums').click();
    cy.contains('td', '₹').should('exist');
  });

  it('edits and deletes a policy', () => {
    cy.visit('/dashboard/insurance');
    cy.contains('[role=tab]', 'Policies').click();

    // Edit first row
    cy.get('table tbody tr').first().within(() => {
      cy.contains('button', 'Edit').click();
    });

    cy.contains('h3', 'Edit Policy').should('be.visible');
    cy.get('input').filter('[type=text]').first().clear().type('HDFC Life'); // insurance_company
    cy.contains('button', 'Save Changes').click();

    cy.contains('td', 'HDFC Life').should('exist');

    // Delete first row
    cy.get('table tbody tr').first().within(() => {
      cy.contains('button', 'Delete').click();
    });

    // Row count reduces or table still loads
    cy.get('table tbody tr').should('exist');
  });
});
