import pytest
import httpx

BASE_URL = "http://localhost:8000/api/v1/assets"

# Replace with a valid JWT for your Supabase user (or use a fixture to obtain one)
JWT = "YOUR_VALID_JWT_HERE"

@pytest.mark.asyncio
async def test_assets_crud():
    headers = {"Authorization": f"Bearer {JWT}"}
    asset_data = {
        "type": "Test Asset",
        "value": 12345
    }

    # 1) POST a new asset
    async with httpx.AsyncClient() as client:
        post_resp = await client.post(BASE_URL + "/", json=asset_data, headers=headers)
        assert post_resp.status_code == 200, post_resp.text
        asset = post_resp.json()
        assert asset["type"] == asset_data["type"]
        asset_id = asset["id"]

        # 2) GET /v1/assets should return it
        get_resp = await client.get(BASE_URL + "/", headers=headers)
        assert get_resp.status_code == 200
        assets = get_resp.json()
        assert any(a["id"] == asset_id for a in assets)

        # 3) DELETE and verify it's removed
        del_resp = await client.delete(f"{BASE_URL}/{asset_id}", headers=headers)
        assert del_resp.status_code == 200
        # Confirm it's gone
        get_resp2 = await client.get(BASE_URL + "/", headers=headers)
        assets2 = get_resp2.json()
        assert not any(a["id"] == asset_id for a in assets2)
