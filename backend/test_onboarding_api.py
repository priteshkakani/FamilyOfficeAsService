import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_onboarding_profile():
    resp = client.post("/api/v1/onboarding/profile", json={
        "full_name": "John Doe",
        "email": "john@example.com",
        "mobile_number": "9999999999"
    })
    assert resp.status_code == 200
    assert resp.json()["success"] is True

def test_onboarding_family():
    resp = client.post("/api/v1/onboarding/family", json={
        "family": [{"name": "Jane Doe", "relation": "Spouse"}]
    })
    assert resp.status_code == 200
    assert resp.json()["success"] is True

def test_onboarding_income_expense():
    resp = client.post("/api/v1/onboarding/income-expense", json={
        "income": 50000,
        "expenses": 20000
    })
    assert resp.status_code == 200
    assert resp.json()["success"] is True
