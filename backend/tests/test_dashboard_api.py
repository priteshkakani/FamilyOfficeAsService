import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_get_dashboard_summary(monkeypatch):
    async def fake_summary(user_id):
        return {"net_worth": 1500000, "income": 60000}
    monkeypatch.setattr("app.routers.dashboard.get_summary", fake_summary)
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/dashboard/summary", headers={"Authorization": "Bearer test"})
        assert r.status_code == 200
        assert "net_worth" in r.json()
