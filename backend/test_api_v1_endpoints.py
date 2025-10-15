import pytest
import pytest_asyncio
from httpx import AsyncClient
from fastapi import status
from unittest.mock import patch
from app.main import app

@pytest_asyncio.fixture
async def client():
    from app.main import app
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        yield ac

# --- Assets Router ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.get_supabase_client")
async def test_get_assets(mock_supabase, client):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1, "type": "Stock", "value": 1000}], "error": None}
    resp = await client.get("/api/v1/assets/?user_id=test-user")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.get_supabase_client")
async def test_post_asset(mock_supabase, client):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = {"data": [{"id": 2, "type": "Bond", "value": 500}], "error": None}
    asset = {"type": "Bond", "value": 500}
    resp = await client.post("/api/v1/assets/?user_id=test-user", json=asset)
    assert resp.status_code == 200
    assert resp.json()["type"] == "Bond"

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.get_supabase_client")
async def test_put_asset(mock_supabase, client):
    mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1, "type": "Stock", "value": 2000}], "error": None}
    asset = {"type": "Stock", "value": 2000}
    resp = await client.put("/api/v1/assets/1?user_id=test-user", json=asset)
    assert resp.status_code == 200
    assert resp.json()["value"] == 2000

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.assets.get_supabase_client")
async def test_delete_asset(mock_supabase, client):
    mock_supabase.table.return_value.delete.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1}], "error": None}
    resp = await client.delete("/api/v1/assets/1?user_id=test-user")
    assert resp.status_code == 200
    assert "message" in resp.json()

# --- Profile Router ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.profile.get_supabase_client")
async def test_get_user_profile(mock_supabase, client):
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = {"data": {"id": "test-user", "full_name": "Test"}, "error": None}
    resp = await client.get("/api/v1/users/profile?user_id=test-user")
    assert resp.status_code == 200
    assert "id" in resp.json()

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.profile.supabase")
async def test_update_user_profile(mock_supabase, client):
    mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = {"data": [{"id": "test-user", "full_name": "Test"}], "error": None}
    profile = {"full_name": "Test"}
    resp = await client.post("/api/v1/users/profile?user_id=test-user", json=profile)
    assert resp.status_code == 200
    assert "profile" in resp.json()

# --- Users Router ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.users.supabase")
async def test_supabase_signup(mock_supabase, client):
    mock_supabase.auth.sign_up.return_value = {"user": {"id": "test-user"}, "error": None}
    user = {"mobile": "1234567890", "email": "test@example.com"}
    resp = await client.post("/api/v1/users/supabase-signup", json=user)
    assert resp.status_code == 200
    assert "user" in resp.json()

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.users.supabase")
async def test_supabase_login(mock_supabase, client):
    mock_supabase.auth.sign_in_with_password.return_value = {"session": {"access_token": "abc"}, "error": None}
    resp = await client.post("/api/v1/users/supabase-login", json={"mobile": "1234567890"})
    assert resp.status_code == 200
    assert "session" in resp.json()

# --- Households Router ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.households.crud.create_household")
async def test_create_household(mock_create_household, client):
    mock_create_household.return_value = type("obj", (object,), {"id": 1})()
    household = {"name": "Test Household"}
    resp = await client.post("/api/v1/households/?owner_id=1", json=household)
    assert resp.status_code == 200
    assert "household_id" in resp.json()

# --- Family Router ---
@pytest.mark.asyncio
@patch("app.api.v1.endpoints.family.supabase")
async def test_get_family(mock_supabase, client):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = {"data": [{"id": 1, "name": "Test Member"}], "error": None}
    resp = await client.get("/api/v1/family?user_id=test-user")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

@pytest.mark.asyncio
@patch("app.api.v1.endpoints.family.supabase")
async def test_add_family_member(mock_supabase, client):
    mock_supabase.table.return_value.insert.return_value.execute.return_value = {"data": [{"id": 2, "name": "Test Member"}], "error": None}
    member = {"name": "Test Member"}
    resp = await client.post("/api/v1/family?user_id=test-user", json=member)
    assert resp.status_code == 200
    assert "member" in resp.json()
