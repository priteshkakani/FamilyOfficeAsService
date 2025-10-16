import os
import httpx

SUREPASS_BASE = os.getenv("SUREPASS_BASE")
SUREPASS_API_KEY = os.getenv("SUREPASS_API_KEY")
SUREPASS_AUTH_HEADER = os.getenv("SUREPASS_AUTH_HEADER", "Authorization")

async def sp_post(path: str, payload: dict):
    url = f"{SUREPASS_BASE}{path}"
    headers = {
        SUREPASS_AUTH_HEADER: f"Bearer {SUREPASS_API_KEY}" if SUREPASS_AUTH_HEADER.lower() == "authorization" else SUREPASS_API_KEY,
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload, headers=headers, timeout=30)
        if resp.status_code == 200:
            return resp.json()
        raise Exception(f"Surepass error: {resp.status_code} {resp.text}")
