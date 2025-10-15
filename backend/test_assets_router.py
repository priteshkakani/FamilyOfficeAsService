import pytest
import pytest_asyncio
from httpx import AsyncClient
from fastapi import FastAPI, status
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from app.main import app

@pytest_asyncio.fixture
def anyio_backend():
    return 'asyncio'

@pytest_asyncio.fixture
def client():
    return AsyncClient(app=app, base_url="http://testserver")

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.supabase")
async def test_get_assets(mock_supabase, client):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = {
        "data": [{"id": 1, "type": "Stock", "value": 1000}], "error": None
    }
    response = await client.get("/api/v1/assets/?user_id=test-user")
    assert response.status_code == 200
    assert response.json() == [{"id": 1, "type": "Stock", "value": 1000}]

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.supabase")
async def test_post_asset(mock_supabase, client):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = {
        "data": [{"id": 2, "type": "Bond", "value": 500}], "error": None
    }
    asset = {"type": "Bond", "value": 500}
    response = await client.post("/api/v1/assets/?user_id=test-user", json=asset)
    assert response.status_code == 200
    assert response.json()["type"] == "Bond"

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.supabase")
async def test_put_asset(mock_supabase, client):
    mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = {
        "data": [{"id": 1, "type": "Stock", "value": 2000}], "error": None
    }
    asset = {"type": "Stock", "value": 2000}
    response = await client.put("/api/v1/assets/1?user_id=test-user", json=asset)
    assert response.status_code == 200
    assert response.json()["asset"][0]["value"] == 2000

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.supabase")
async def test_delete_asset(mock_supabase, client):
    mock_supabase.table.return_value.delete.return_value.eq.return_value.execute.return_value = {
        "data": [{"id": 1}], "error": None
    }
    response = await client.delete("/api/v1/assets/1?user_id=test-user")
    assert response.status_code == 200
    assert response.json()["message"] == "Asset deleted"
