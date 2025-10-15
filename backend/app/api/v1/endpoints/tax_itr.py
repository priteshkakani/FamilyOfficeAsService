from fastapi import APIRouter, HTTPException, Request
from app.supabase_client import get_supabase_client
import requests
import os

router = APIRouter()

SUREPASS_API_KEY = os.getenv("SUREPASS_API_KEY", "<your-surepass-api-key>")
SUREPASS_BASE_URL = "https://api.surepass.io/v1"

# Collect Tax-ITR data, call Surepass, store in Supabase
def store_itr_in_supabase(user_id, data):
    supabase = get_supabase_client()
    result = supabase.table("tax_itr").insert({"user_id": user_id, **data}).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return result["data"]

@router.post("/collect")
async def collect_itr(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    pan = body.get("pan")
    year = body.get("year")
    if not (user_id and pan and year):
        raise HTTPException(status_code=400, detail="user_id, pan, year required")
    # Call Surepass PAN Comprehensive Plus
    headers = {"Authorization": f"Bearer {SUREPASS_API_KEY}"}
    pan_url = f"{SUREPASS_BASE_URL}/pan/comprehensive-plus"  # Example endpoint
    pan_resp = requests.post(pan_url, json={"pan": pan}, headers=headers)
    if pan_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="PAN verification failed")
    pan_data = pan_resp.json()
    # Call Surepass Get AIS
    ais_url = f"{SUREPASS_BASE_URL}/itr/ais"  # Example endpoint
    ais_resp = requests.post(ais_url, json={"pan": pan, "year": year}, headers=headers)
    if ais_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="AIS fetch failed")
    ais_data = ais_resp.json()
    # Store in Supabase
    record = store_itr_in_supabase(user_id, {"pan": pan, "year": year, "pan_data": pan_data, "ais_data": ais_data})
    return {"message": "ITR data collected", "data": record}

@router.get("/user/{user_id}")
def get_itr_for_user(user_id: int):
    supabase = get_supabase_client()
    result = supabase.table("tax_itr").select("*").eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"tax_itr": result["data"]}
