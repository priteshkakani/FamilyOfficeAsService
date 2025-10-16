# Backend Test Suite

This directory contains API and database schema tests for the onboarding backend.

- All API tests use [pytest](https://docs.pytest.org/) and [FastAPI TestClient].
- DB schema tests use [pytest] and [sqlite3] with the provided `schema.sql`.

## Running Tests

```
pytest
```

## Structure

- `test_onboarding_api.py` - API endpoint tests for onboarding
- `test_db_schema.py` - DB schema validation tests

## Notes

- API tests assume endpoints `/api/v1/onboarding/*` exist and return `{ success: true }` on success.
- DB tests use an in-memory SQLite DB and `schema.sql`.
