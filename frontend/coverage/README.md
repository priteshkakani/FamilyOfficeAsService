# Coverage Reports

- **Frontend (Jest):**

  - Run: `npm run test -- --coverage`
  - Output: `coverage/lcov-report/index.html`

- **Backend (pytest):**

  - Run: `coverage run -m pytest && coverage html`
  - Output: `htmlcov/index.html`

- **Cypress (E2E):**

  - Run: `npm run cypress:run -- --coverage`
  - Output: `coverage/`

- **Merge Coverage (nyc):**
  - Install: `npm i --save-dev nyc`
  - Merge: `nyc merge coverage coverage/merged.json`
  - Report: `nyc report --reporter=html`

See main README for details.
