import os
import importlib


def test_required_dashboard_columns_exist():
    # psycopg2 is an optional dev dependency; if it's not present, skip the test so
    # static checks don't fail in environments without the DB driver installed.
    psycopg2_spec = importlib.util.find_spec("psycopg2")
    if psycopg2_spec is None:
        import pytest

        pytest.skip("psycopg2 not installed; skipping DB schema test")

    psycopg2 = importlib.import_module("psycopg2")
    db_url = os.environ.get("SUPABASE_DB_URL")
    assert db_url, "SUPABASE_DB_URL env var must be set"
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='profiles';")
    cols = {r[0] for r in cur.fetchall()}
    expected = {"monthly_income", "monthly_expenses", "net_worth"}
    assert expected <= cols
    cur.close()
    conn.close()
