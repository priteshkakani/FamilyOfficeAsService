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

## 🚀 Stable Launch

If you experience crashes (window crash code 5) or performance issues with VS Code/Cursor, use these safe launch options:

### Recommended Launch Commands

#### VS Code (macOS/Linux)
```bash
# Safe mode with temp user-data dir, no extensions, GPU disabled
code --user-data-dir=$(mktemp -d) --disable-extensions --disable-gpu --disable-software-rasterizer .

# Alternative: Basic safe mode (no extensions, GPU disabled)
code --disable-extensions --disable-gpu --disable-software-rasterizer .
```

#### Cursor (macOS/Linux)
```bash
# Safe mode with temp user-data dir, GPU disabled
/Applications/Cursor.app/Contents/MacOS/Cursor --user-data-dir=$(mktemp -d) --disable-gpu --disable-software-rasterizer .

# Alternative: Basic safe mode (GPU disabled)
/Applications/Cursor.app/Contents/MacOS/Cursor --disable-gpu --disable-software-rasterizer .
```

### Permanent GPU Disabling (VS Code)

To permanently disable GPU acceleration in VS Code, edit `argv.json`:

**macOS:** `~/Library/Application Support/Code/argv.json`  
**Linux:** `~/.config/Code/argv.json`  
**Windows:** `%APPDATA%\Code\argv.json`

Add:
```json
{
  "disable-hardware-acceleration": true,
  "disable-color-correct-rendering": true
}
```

**Note:** Do not create this file in the repo—it's a user-level configuration file.

### Troubleshooting

#### High CPU/Memory Usage (tsserver)
- Clean TypeScript cache: `rm -rf node_modules/.cache` and restart editor
- Workspace settings already include `typescript.tsserver.maxTsServerMemory: 8192`
- Ensure workspace TypeScript is used: `typescript.tsdk` points to `node_modules/typescript/lib`

#### Corrupt Workspace State
```bash
# Remove VS Code workspace cache (project-scoped only)
rm -rf .vscode/workspaceStorage/*

# Clean build artifacts
rm -rf node_modules/.cache .next dist build .turbo coverage
```

#### Dependency/Workspace Health

If `node_modules` is corrupted or extremely large:

```bash
# Clean install (use the package manager from package.json)
rm -rf node_modules package-lock.json
npm ci  # or: pnpm install

# Verify Node version matches .nvmrc or engines in package.json
node --version
```

**Note:** Ensure Node version matches project requirements before reinstalling.

## 🔧 Dev Health

### Symlink Loop Detection

To scan for problematic symlink loops that can cause editor crashes:

```bash
# Scan for symlink loops (excludes node_modules/.bin which are normal)
find . -maxdepth 3 -type l ! -path "*/node_modules/.bin/*" -exec ls -la {} \; 2>/dev/null

# Check for circular symlinks in build directories
find . -type l \( -path "*/node_modules/*" -o -path "*/.next/*" -o -path "*/dist/*" -o -path "*/build/*" \) ! -path "*/node_modules/.bin/*" 2>/dev/null
```

**What to avoid:**
- Symlinks that point back to themselves or create circular references
- Symlinks in `node_modules`, `dist`, `build`, `.next` that aren't part of package manager's normal structure
- Symlinks created by build tools that reference parent directories

If symlink loops are found, remove them manually or reinstall dependencies:
```bash
rm -rf node_modules && npm ci  # or pnpm install
```

## 🌟 Vision

Empowering every investor to run their own family office digitally by 2028.
