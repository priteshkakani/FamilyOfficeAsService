import pytest
from httpx import AsyncClient
from app.main import app
from unittest.mock import AsyncMock, patch
import json

@pytest.fixture
async def test_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_get_dashboard_summary(test_client, monkeypatch):
    # Mock the dashboard service
    mock_summary = {
        "net_worth": 1500000,
        "assets": {"total": 2000000, "by_type": [{"type": "savings", "amount": 500000}, {"type": "investment", "amount": 1500000}]},
        "liabilities": {"total": 500000, "by_type": [{"type": "loan", "amount": 500000}]},
        "recent_transactions": [
            {"id": 1, "description": "Salary Credit", "amount": 100000, "type": "credit", "date": "2023-11-01"},
            {"id": 2, "description": "Rent Payment", "amount": -25000, "type": "debit", "date": "2023-11-05"}
        ]
    }

    # Mock the auth middleware
    async def mock_verify_token(*args, **kwargs):
        return {"sub": "test-user-123", "email": "test@example.com"}

    # Mock the database call
    async def mock_get_dashboard_data(*args, **kwargs):
        return mock_summary

    # Apply mocks
    monkeypatch.setattr("app.middleware.verify_token", mock_verify_token)
    monkeypatch.setattr("app.services.dashboard_service.get_dashboard_data", mock_get_dashboard_data)

    # Make the request
    response = await test_client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": "Bearer test-token"}
    )

    # Verify the response
    assert response.status_code == 200
    data = response.json()
    assert "net_worth" in data
    assert data["net_worth"] == 1500000
    assert "assets" in data
    assert "liabilities" in data
    assert "recent_transactions" in data

@pytest.mark.asyncio
async def test_unauthorized_access(test_client):
    # Test without auth token
    response = await test_client.get("/api/v1/dashboard/summary")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_assets_summary(test_client, monkeypatch):
    # Mock data
    mock_assets = {
        "total": 2000000,
        "by_type": [
            {"type": "savings", "amount": 500000},
            {"type": "investment", "amount": 1500000}
        ]
    }

    # Mock the auth middleware
    async def mock_verify_token(*args, **kwargs):
        return {"sub": "test-user-123", "email": "test@example.com"}

    # Mock the database call
    async def mock_get_assets_summary(*args, **kwargs):
        return mock_assets

    # Apply mocks
    monkeypatch.setattr("app.middleware.verify_token", mock_verify_token)
    monkeypatch.setattr("app.services.dashboard_service.get_assets_summary", mock_get_assets_summary)

    # Make the request
    response = await test_client.get(
        "/api/v1/dashboard/assets/summary",
        headers={"Authorization": "Bearer test-token"}
    )

    # Verify the response
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2000000
    assert len(data["by_type"]) == 2

@pytest.mark.asyncio
async def test_get_liabilities_summary(test_client, monkeypatch):
    # Mock data
    mock_liabilities = {
        "total": 500000,
        "by_type": [
            {"type": "loan", "amount": 500000}
        ]
    }

    # Mock the auth middleware
    async def mock_verify_token(*args, **kwargs):
        return {"sub": "test-user-123", "email": "test@example.com"}

    # Mock the database call
    async def mock_get_liabilities_summary(*args, **kwargs):
        return mock_liabilities

    # Apply mocks
    monkeypatch.setattr("app.middleware.verify_token", mock_verify_token)
    monkeypatch.setattr("app.services.dashboard_service.get_liabilities_summary", mock_get_liabilities_summary)

    # Make the request
    response = await test_client.get(
        "/api/v1/dashboard/liabilities/summary",
        headers={"Authorization": "Bearer test-token"}
    )

    # Verify the response
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 500000
    assert len(data["by_type"]) == 1

@pytest.mark.asyncio
async def test_get_recent_transactions(test_client, monkeypatch):
    # Mock data
    mock_transactions = [
        {"id": 1, "description": "Salary Credit", "amount": 100000, "type": "credit", "date": "2023-11-01"},
        {"id": 2, "description": "Rent Payment", "amount": -25000, "type": "debit", "date": "2023-11-05"}
    ]

    # Mock the auth middleware
    async def mock_verify_token(*args, **kwargs):
        return {"sub": "test-user-123", "email": "test@example.com"}

    # Mock the database call
    async def mock_get_recent_transactions(*args, **kwargs):
        return mock_transactions

    # Apply mocks
    monkeypatch.setattr("app.middleware.verify_token", mock_verify_token)
    monkeypatch.setattr("app.services.dashboard_service.get_recent_transactions", mock_get_recent_transactions)

    # Make the request
    response = await test_client.get(
        "/api/v1/dashboard/transactions/recent",
        headers={"Authorization": "Bearer test-token"}
    )

    # Verify the response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["description"] == "Salary Credit"

@pytest.mark.asyncio
async def test_dashboard_error_handling(test_client, monkeypatch):
    # Mock the auth middleware
    async def mock_verify_token(*args, **kwargs):
        return {"sub": "test-user-123", "email": "test@example.com"}

    # Mock a database error
    async def mock_get_dashboard_data(*args, **kwargs):
        raise Exception("Database connection error")

    # Apply mocks
    monkeypatch.setattr("app.middleware.verify_token", mock_verify_token)
    monkeypatch.setattr("app.services.dashboard_service.get_dashboard_data", mock_get_dashboard_data)

    # Make the request
    response = await test_client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": "Bearer test-token"}
    )

    # Verify error handling
    assert response.status_code == 500
    data = response.json()
    assert "error" in data
