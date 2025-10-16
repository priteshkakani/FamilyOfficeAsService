import os
import psycopg2

def test_required_dashboard_columns_exist():
    db_url = os.environ.get("SUPABASE_DB_URL")
    assert db_url, "SUPABASE_DB_URL env var must be set"
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='profiles';")
    cols = {r[0] for r in cur.fetchall()}
    expected = {'monthly_income','monthly_expenses','net_worth'}
    assert expected <= cols
    cur.close()
    conn.close()
