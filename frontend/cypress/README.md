# Cypress E2E Tests

This directory contains end-to-end tests for the onboarding and dashboard flows using [Cypress](https://www.cypress.io/).

## Running E2E Tests

```
npx cypress open
# or
npx cypress run
```

## Structure

- `e2e/onboarding.cy.js` - E2E test for onboarding flow

## Notes

- E2E tests run against the full app in a browser.
- Ensure backend and frontend are running before executing E2E tests.
