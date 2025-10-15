import pytest
import asyncio
from httpx import AsyncClient
from fastapi import status
from unittest.mock import patch
from backend.app.main import app

# Use a fixture to create an AsyncClient for the FastAPI app
@pytest.fixture(scope="module")
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

# Example Supabase user mock
@pytest.fixture
def supabase_user():
    return {
        "id": "test-user-id",
        "email": "test@example.com",
        "is_onboarded": False
    }

# Patch get_current_user dependency to return mock user
@pytest.fixture
def override_get_current_user(supabase_user):
    with patch("backend.app.auth_helpers.get_current_user", return_value=supabase_user):
        yield

@pytest.mark.asyncio
async def test_signup_and_login_flow(async_client):
    # Simulate sign up
    response = await async_client.post("/api/v1/auth/signup", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "access_token" in data

    # Simulate login
    response = await async_client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data

@pytest.mark.asyncio
async def test_jwt_verification_and_onboarding(async_client, override_get_current_user):
    # Simulate accessing a protected endpoint
    response = await async_client.get("/api/v1/protected-endpoint")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user"]["email"] == "test@example.com"

    # Simulate onboarding check
    response = await async_client.get("/api/v1/onboarding-status")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["is_onboarded"] is False

    # Simulate onboarding completion
    response = await async_client.post("/api/v1/complete-onboarding")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["is_onboarded"] is True
