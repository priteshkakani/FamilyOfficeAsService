from fastapi import APIRouter, HTTPException, Request, Depends
from app.auth import verify_jwt_token
from app.supabase_client import get_supabase_client
import requests
import os
import datetime
from pydantic import BaseModel

router = APIRouter()

SUREPASS_API_KEY = os.getenv("SUREPASS_API_KEY", "<your-surepass-api-key>")
SUREPASS_BASE_URL = "https://api.surepass.io/v1"

class AISRequest(BaseModel):
    pan: str
    year: str

@router.post("/surepass/itr/ais")
async def itr_ais(payload: AISRequest, user=Depends(verify_jwt_token)):
    try:
        uid = user.get("sub")
        pan = payload.pan
        year = payload.year
        if not (uid and pan and year):
            raise HTTPException(status_code=400, detail="user_id, pan, year required")
        headers = {"Authorization": f"Bearer {SUREPASS_API_KEY}"}
        ais_url = f"{SUREPASS_BASE_URL}/itr/ais"
        ais_resp = requests.post(ais_url, json={"pan": pan, "year": year}, headers=headers)
        if ais_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="AIS fetch failed")
        ais_data = ais_resp.json()
        # TODO: normalize/store as needed
        return {"success": True, "data": ais_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch AIS: {str(e)}")
from fastapi import APIRouter, HTTPException, Request, Depends
from app.auth import verify_jwt_token
from app.supabase_client import get_supabase_client
import requests
import os
import datetime

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


# New endpoint: /api/surepass/itr/connect
@router.post("/surepass/itr/connect")
async def itr_connect(request: Request, user=Depends(verify_jwt_token)):
    body = await request.json()
    pan = body.get("pan")
    year = body.get("year")
    uid = user.get("sub")
    if not (uid and pan and year):
        raise HTTPException(status_code=400, detail="user_id, pan, year required")
    headers = {"Authorization": f"Bearer {SUREPASS_API_KEY}"}
    pan_url = f"{SUREPASS_BASE_URL}/pan/comprehensive-plus"
    pan_resp = requests.post(pan_url, json={"pan": pan}, headers=headers)
    if pan_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="PAN verification failed")
    pan_data = pan_resp.json()
    ais_url = f"{SUREPASS_BASE_URL}/itr/ais"
    ais_resp = requests.post(ais_url, json={"pan": pan, "year": year}, headers=headers)
    if ais_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="AIS fetch failed")
    ais_data = ais_resp.json()
    # Normalize summary for UI
    def normalize_itr(pan_data, ais_data):
        norm = {}
        if pan_data:
            norm["pan_name"] = pan_data.get("name") or pan_data.get("pan_holder_name")
            norm["pan_status"] = pan_data.get("status")
        if ais_data:
            norm["total_income"] = ais_data.get("total_income")
            norm["total_tax"] = ais_data.get("total_tax")
            norm["assessment_year"] = ais_data.get("assessment_year") or year
        norm["normalized_at"] = str(datetime.datetime.utcnow())
        return norm
    summary = normalize_itr(pan_data, ais_data)
    # Store in Supabase
    record = store_itr_in_supabase(uid, {"pan": pan, "year": year, "pan_data": pan_data, "ais_data": ais_data, "summary": summary})
    return {"success": True, "summary": summary, "data": record}
