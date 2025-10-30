import pytest
from fastapi.testclient import TestClient
from backend.app.main import app


@pytest.fixture(autouse=True)
def mock_verify_jwt_token(monkeypatch):
    async def _mock(creds=None):
        return {"sub": "test-user-id"}

    monkeypatch.setattr("backend.app.main.verify_jwt_token", _mock)


def test_generate_otp_success(monkeypatch):
    async def fake_sp_post(path, payload):
        return {"transaction_id": "tx-12345", "status": "OTP_SENT"}

    monkeypatch.setattr("backend.app.surepass_client.sp_post", fake_sp_post)
    client = TestClient(app)
    resp = client.post(
        "/api/surepass/epfo/generate-otp",
        json={"pan": "ABCDE1234F", "mobile": "9999999999"},
        headers={"Authorization": "Bearer faketoken"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("success") is True
    assert data.get("transaction_id") == "tx-12345"


def test_verify_otp_success(monkeypatch):
    async def fake_sp_post(path, payload):
        return {"passbook": {"balance": 1000}, "request_id": payload.get("transaction_id")}

    monkeypatch.setattr("backend.app.surepass_client.sp_post", fake_sp_post)
    client = TestClient(app)
    resp = client.post(
        "/api/surepass/epfo/verify-otp",
        json={"transaction_id": "tx-12345", "otp": "123456"},
        headers={"Authorization": "Bearer faketoken"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("success") is True
    assert data.get("transaction_id") == "tx-12345"
    assert "data" in data
