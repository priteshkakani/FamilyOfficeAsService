import pytest
import httpx

BASE_URL = "http://localhost:8000/api/v1/users/profile"

# Replace with a valid JWT for your Supabase user (or use a fixture to obtain one)
JWT = "YOUR_VALID_JWT_HERE"

@pytest.mark.asyncio
async def test_profile_crud():
    headers = {"Authorization": f"Bearer {JWT}"}
    user_id = "YOUR_USER_ID_HERE"  # Replace with a real user_id from your Supabase 'profiles' table

    # 1) GET profile (should 404 if not present)
    async with httpx.AsyncClient() as client:
        get_resp = await client.get(BASE_URL, params={"user_id": user_id}, headers=headers)
        assert get_resp.status_code in (200, 404)

        # 2) POST/Update profile
        profile_data = {"full_name": "Test User", "is_onboarded": True}
        post_resp = await client.post(BASE_URL, params={"user_id": user_id}, json=profile_data, headers=headers)
        assert post_resp.status_code == 200, post_resp.text
        updated = post_resp.json()
        assert updated["profile"][0]["full_name"] == "Test User"

        # 3) GET profile again (should exist)
        get_resp2 = await client.get(BASE_URL, params={"user_id": user_id}, headers=headers)
        assert get_resp2.status_code == 200
        profile = get_resp2.json()
        assert profile["full_name"] == "Test User"
