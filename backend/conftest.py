import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from unittest.mock import patch

@pytest.fixture
def mock_supabase_user():
    return {
        "id": "test-user-id",
        "email": "test@example.com",
        "is_onboarded": False
    }

@pytest.fixture(autouse=True)
def override_get_current_user(monkeypatch, mock_supabase_user):
    async def mock_dep():
        return mock_supabase_user
    monkeypatch.setattr("backend.app.auth_helpers.get_current_user", mock_dep)
