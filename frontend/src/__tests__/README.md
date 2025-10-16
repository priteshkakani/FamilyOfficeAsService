# Test Suite for Onboarding Flow

This directory contains unit, integration, and E2E tests for the onboarding flow and data source modals.

- All tests use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Jest](https://jestjs.io/) for unit/integration.
- E2E tests use [Cypress](https://www.cypress.io/).
- Supabase and external APIs are mocked for unit/integration tests.

## Running Tests

### Unit/Integration

```
npm test
```

### E2E

```
npx cypress open
# or
npx cypress run
```

## Coverage

```
npm test -- --coverage
```

## Structure

- `*.test.jsx` - Unit/integration tests for React components
- `*.cy.js` - Cypress E2E tests

## Notes

- All API/network calls should be mocked in unit/integration tests.
- E2E tests run against the full app in a browser.
