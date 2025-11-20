# Family Office as a Service

[![Build Status](https://github.com/priteshkakani/FamilyOfficeAsService/actions/workflows/ci.yml/badge.svg)](https://github.com/priteshkakani/FamilyOfficeAsService/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deploy: Vercel](https://vercelbadge.vercel.app/api/priteshkakani/FamilyOfficeAsService)](https://familyofficeaservice.vercel.app)

## 🏗️ Architecture Diagram

```
[User] ⇄ [Frontend: React (Vite, Tailwind, shadcn/ui)] ⇄ [Backend: FastAPI] ⇄ [Supabase Postgres]
         │                                 │
         └─────────────[SurePass API]───────┘

[CI/CD: GitHub Actions] → [Vercel (frontend)]
                        → [Render/Fly.io (backend)]
```

---

## 🚀 Quick Start Guide

```bash
# 1. Clone the repository
git clone https://github.com/priteshkakani/FamilyOfficeAsService.git
cd FamilyOfficeAsService

# 2. Set up environment variables (see below)
cp .env.example .env

# 3. Install dependencies
cd frontend && npm install
cd ../backend && pip install -r requirements.txt

# 4. Run local dev servers
cd frontend && npm run dev
cd ../backend && uvicorn app.main:app --reload
```

---

## ⚙️ Environment Variables

| Key                    | Description                          |
| ---------------------- | ------------------------------------ |
| VITE_SUPABASE_URL      | Supabase project URL (frontend)      |
| VITE_SUPABASE_ANON_KEY | Supabase anon public key (frontend)  |
| VITE_API_BASE_URL      | Backend API base URL (frontend)      |
| DATABASE_URL           | Postgres connection string (backend) |
| SUREPASS_CLIENT_ID     | SurePass API client ID (backend)     |
| SUREPASS_CLIENT_SECRET | SurePass API client secret (backend) |

---

## 🧑‍💻 Development Workflow

- Use **GitHub Copilot** for code generation and suggestions.
- Manage database schema with **Supabase CLI**:
  ```bash
  supabase db dump
  supabase db push
  ```
- Run tests:
  ```bash
  cd backend && pytest
  cd ../frontend && npx vitest
  cd ../frontend && npx playwright test
  ```

---

## 🧠 Testing

- **Backend:** `pytest-asyncio` for async API and logic tests.
- **Frontend:** `Vitest` for unit/integration, `Cypress` for E2E.
- **E2E:** Playwright and Cypress scripts for onboarding, auth, and dashboard flows.

---

## 🧩 Project Structure

```
FamilyOfficeAsService/
├── frontend/   # React app (Vite, Tailwind, shadcn/ui)
├── backend/    # FastAPI app, tests, conftest.py
├── supabase/   # DB migrations, schema, CLI config
├── tests/      # Shared and E2E tests
```

---

## 🔐 Authentication Flow

- **Sign Up/Sign In:** Email, OTP, Google via Supabase Auth.
- **Forgot Password:** Secure reset via Supabase.
- **Onboarding Check:** `profiles.is_onboarded` flag enforced on protected routes.

---

## 📊 Dashboard Features

- **Assets:** Track stocks, mutual funds, real estate, ESOPs.
- **Liabilities:** Loans, credit cards, and obligations.
- **Insurance:** Policies, coverage, and claims.
- **EPFO:** Passbook and balance integration.
- **Reports:** Consolidated financial summaries and insights.

---

## 🧰 Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | React, Vite, Tailwind, shadcn/ui, React Query |
| Backend    | FastAPI, Python, Uvicorn                      |
| Database   | Supabase Postgres                             |
| Auth       | Supabase Auth                                 |
| CI/CD      | GitHub Actions                                |
| E2E        | Cypress, Playwright                           |
| Hosting    | Vercel (frontend), Render/Fly.io (backend)    |
| Monitoring | Sentry                                        |

---

## 🌍 Deployment Guide

- **Frontend:** Deploy to Vercel (output dir: `dist`).
- **Backend:** Deploy to Render or Fly.io (Uvicorn server).
- **Database:** Hosted on Supabase.
- **CI/CD:** Automated via GitHub Actions (build, test, deploy).

---

## 🧾 API Endpoints Summary

- `POST /v1/users` — User registration & onboarding
- `POST /v1/assets` — Add asset
- `POST /v1/liabilities` — Add liability
- `GET  /v1/dashboard/summary` — Portfolio summary
- `GET  /v1/epfo` — EPFO data fetch

---

## 🔍 Debugging Tips

- **Blank Page:** Check environment variables and build output directory (`dist`).
- **CORS Issues:** Ensure backend CORS settings allow frontend origin.
- **Auth Errors:** Confirm Supabase keys and URLs are correct.
- **API 404:** Verify VITE_API_BASE_URL and backend server are running.

---

## ❤️ Contributing

- Fork the repo, create a feature branch, and submit a PR.
- Follow code style (Prettier, Black, isort).
- All code must pass CI and tests before merge.

---

## 🛡️ License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🌟 Vision

Empowering every investor to run their own family office digitally by 2028.

## 🌟 Vision

Empowering every investor to run their own family office digitally by 2028.
