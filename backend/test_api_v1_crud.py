
import pytest
import pytest_asyncio
from httpx import AsyncClient
from unittest.mock import patch, MagicMock
import sys
import os

# Set Supabase env vars for tests
os.environ["VITE_SUPABASE_URL"] = "https://fomyxahwvnfivxvrjtpf.supabase.co"
os.environ["VITE_SUPABASE_ANON_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbXl4YWh3dm5maXZ4dnJqdHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTgzMDAsImV4cCI6MjA3NTU3NDMwMH0.WT_DEOJ5otbwbhD_trLNa806d08WYwMfk0QWajsFVdw"
os.environ["SUPABASE_URL"] = os.environ["VITE_SUPABASE_URL"]
os.environ["SUPABASE_KEY"] = os.environ["VITE_SUPABASE_ANON_KEY"]

# Patch supabase.create_client before importing app.main
with patch("app.supabase_client.create_client", return_value=MagicMock()):
    from app.main import app

@pytest_asyncio.fixture
async def client():
    from app.main import app
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        yield ac

# --- Assets CRUD ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.supabase")
async def test_get_assets(mock_supabase, client):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1, "type": "Stock", "value": 1000}], "error": None}
    resp = await client.get("/api/v1/assets/?user_id=test-user")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert resp.json()[0]["type"] == "Stock"

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.supabase")
async def test_post_asset(mock_supabase, client):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = {"data": [{"id": 2, "type": "Bond", "value": 500}], "error": None}
    asset = {"type": "Bond", "value": 500}
    resp = await client.post("/api/v1/assets/?user_id=test-user", json=asset)
    assert resp.status_code == 200
    assert resp.json()["type"] == "Bond"

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.supabase")
async def test_put_asset(mock_supabase, client):
    mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1, "type": "Stock", "value": 2000}], "error": None}
    asset = {"type": "Stock", "value": 2000}
    resp = await client.put("/api/v1/assets/1?user_id=test-user", json=asset)
    assert resp.status_code == 200
    assert resp.json()["value"] == 2000

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.supabase")
async def test_delete_asset(mock_supabase, client):
    mock_supabase.table.return_value.delete.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1}], "error": None}
    resp = await client.delete("/api/v1/assets/1?user_id=test-user")
    assert resp.status_code == 200
    assert "message" in resp.json()

# --- Liabilities CRUD ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.liabilities.supabase")
async def test_get_liabilities(mock_supabase, client):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1, "type": "Loan", "value": 5000}], "error": None}
    resp = await client.get("/api/v1/liabilities/?user_id=test-user")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert resp.json()[0]["type"] == "Loan"

# --- Insurance CRUD ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.insurance.supabase")
async def test_get_insurance(mock_supabase, client):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1, "policy_name": "Life", "sum_assured": 100000}], "error": None}
    resp = await client.get("/api/v1/insurance/?user_id=test-user")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert resp.json()[0]["policy_name"] == "Life"

# --- EPFO CRUD ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.epfo.supabase")
async def test_get_epfo(mock_supabase, client):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1, "uan": "123456", "balance": 10000}], "error": None}
    resp = await client.get("/api/v1/epfo/?user_id=test-user")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert resp.json()[0]["uan"] == "123456"

# --- Dashboard Summary ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.dashboard.supabase")
async def test_dashboard_summary(mock_supabase, client):
    mock_supabase.rpc.return_value.execute.return_value = {"data": {"total_assets": 10000, "total_liabilities": 5000}, "error": None}
    resp = await client.get("/api/v1/dashboard/summary?user_id=test-user")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_assets" in data
    assert "total_liabilities" in data
