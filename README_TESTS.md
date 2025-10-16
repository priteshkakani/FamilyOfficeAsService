# Automated Test Suite

This project includes a comprehensive automated test suite covering frontend, backend, API, DB schema, and E2E flows.

## Structure

- **frontend/src/**tests**/**: Unit/integration tests for React components (Jest + React Testing Library)
- **frontend/cypress/e2e/**: Cypress E2E tests
- **backend/**: API and DB schema tests (pytest)
- **.github/workflows/test.yml**: CI config for GitHub Actions

## Running Tests

### Frontend Unit/Integration

```
cd frontend
npm test
```

### Frontend E2E

```
cd frontend
npx cypress open
# or
npx cypress run
```

### Backend

```
cd backend
pytest
```

### Coverage

```
cd frontend
npm test -- --coverage
```

### CI

- All tests run automatically on push/PR to `main` via GitHub Actions.

## Notes

- All API/network calls are mocked in unit/integration tests.
- E2E tests require backend and frontend running.
- DB schema tests use in-memory SQLite and `schema.sql`.
