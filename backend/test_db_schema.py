import sqlite3
import pytest

@pytest.fixture(scope="module")
def db():
    conn = sqlite3.connect(":memory:")
    with open("schema.sql") as f:
        conn.executescript(f.read())
    yield conn
    conn.close()

def test_profiles_table(db):
    cur = db.execute("PRAGMA table_info(profiles)")
    columns = [row[1] for row in cur.fetchall()]
    assert "id" in columns
    assert "full_name" in columns
    assert "email" in columns
    assert "mobile_number" in columns

def test_goals_table(db):
    cur = db.execute("PRAGMA table_info(goals)")
    columns = [row[1] for row in cur.fetchall()]
    assert "id" in columns
    assert "profile_id" in columns
    assert "name" in columns
    assert "amount" in columns
