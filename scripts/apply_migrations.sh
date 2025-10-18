#!/usr/bin/env bash
# Applies SQL migration files to a Postgres database defined by TEST_DATABASE_URL
set -euo pipefail

if [ -z "${TEST_DATABASE_URL:-}" ]; then
  echo "ERROR: TEST_DATABASE_URL must be set"
  echo "Example: export TEST_DATABASE_URL=postgresql://user:pass@host:5432/db"
  exit 1
fi

echo "Applying migrations to $TEST_DATABASE_URL"

# Apply top-level migrations
for f in ./migrations/*.sql; do
  if [ -f "$f" ]; then
    echo "Applying $f"
    psql "$TEST_DATABASE_URL" -f "$f"
  fi
done

# Apply drizzle migrations (if any)
for f in ./drizzle/migrations/*.sql; do
  if [ -f "$f" ]; then
    echo "Applying $f"
    psql "$TEST_DATABASE_URL" -f "$f"
  fi
done

echo "Migrations applied"
