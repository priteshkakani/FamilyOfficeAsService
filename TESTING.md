Testing guide — Frontend + Supabase

This document explains how to run frontend unit tests quickly, how to run integration tests against a test Supabase/Postgres instance, and how to apply migrations.

Quick unit tests (fast)

- Run the focused unit test script (this runs modal tests and small pure-unit tests):

  cd frontend
  npm run test:unit-fast

Full unit + integration

- Integration tests require a running Postgres/Supabase instance with the project schema applied. Recommended approaches:

  - Use Supabase CLI (recommended if you already use Supabase):

    1. Install Supabase CLI: https://supabase.com/docs/guides/cli
    2. Start local dev DB: `supabase start`
    3. Create a project and get your local DB URL or use the one from the CLI output.
    4. Apply migrations using the included script (see below).

  - Or run a Postgres container:
    # start a postgres container (example)
    docker run --name foas-test-db -e POSTGRES_PASSWORD=pass -p 5432:5432 -d postgres:15
    export TEST_DATABASE_URL="postgresql://postgres:pass@localhost:5432/postgres"
    ./scripts/apply_migrations.sh

Apply migrations

- There's a helper script `scripts/apply_migrations.sh` which applies all `.sql` files in the `migrations/` and `drizzle/migrations/` folders to the DB referenced by `TEST_DATABASE_URL` (psql required). Example:

  TEST_DATABASE_URL=postgresql://user:pass@host:5432/db ./scripts/apply_migrations.sh

Environment variables

- For running integration tests, set env vars used by frontend tests. Typically:
  - VITE_SUPABASE_URL -> http://localhost:5432 (or your SUPABASE URL)
  - VITE_SUPABASE_ANON_KEY -> anon or service role key (from Supabase project)
  - TEST_DATABASE_URL -> Postgres connection URL used by the migration script

Notes

- CI: store test DB credentials in GitHub Actions secrets and run migrations before `vitest` in the workflow.
- If you don't want to run integration tests yet, the repository's `vitest.config.js` excludes `**/*.integration.*` tests by default. Use `npm run test:unit-fast` for a quick green run.

If you want, I can:

- Add a supabase locally runnable dev setup (docker-compose) and wire CI to run migrations before tests.
- Convert critical integration tests to mocked MSW handlers to run without DB.
