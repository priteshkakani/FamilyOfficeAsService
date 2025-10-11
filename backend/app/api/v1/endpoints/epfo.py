from fastapi import APIRouter, HTTPException, Request
from ...supabase_client import supabase
import requests
import os

router = APIRouter()

SUREPASS_API_KEY = os.getenv("SUREPASS_API_KEY", "<your-surepass-api-key>")
SUREPASS_BASE_URL = "https://api.surepass.io/v1"

# Store EPFO data in Supabase
def store_epfo_in_supabase(user_id, data):
    result = supabase.table("epfo").insert({"user_id": user_id, **data}).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return result["data"]

@router.post("/generate-otp")
async def generate_epfo_otp(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    uan = body.get("uan")
    mobile = body.get("mobile")
    if not (user_id and uan and mobile):
        raise HTTPException(status_code=400, detail="user_id, uan, mobile required")
    headers = {"Authorization": f"Bearer {SUREPASS_API_KEY}"}
    otp_url = f"{SUREPASS_BASE_URL}/epfo/generate-otp"  # Example endpoint
    otp_resp = requests.post(otp_url, json={"uan": uan, "mobile": mobile}, headers=headers)
    if otp_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="OTP generation failed")
    otp_data = otp_resp.json()
    return {"message": "OTP sent", "data": otp_data}

@router.post("/submit-otp")
async def submit_epfo_otp(request: Request):
    body = await request.json()
    user_id = body.get("user_id")
    uan = body.get("uan")
    otp = body.get("otp")
    if not (user_id and uan and otp):
        raise HTTPException(status_code=400, detail="user_id, uan, otp required")
    headers = {"Authorization": f"Bearer {SUREPASS_API_KEY}"}
    submit_url = f"{SUREPASS_BASE_URL}/epfo/submit-otp"  # Example endpoint
    submit_resp = requests.post(submit_url, json={"uan": uan, "otp": otp}, headers=headers)
    if submit_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="OTP submit failed")
    passbook_data = submit_resp.json()
    # Store in Supabase
    record = store_epfo_in_supabase(user_id, {"uan": uan, "passbook_data": passbook_data})
    return {"message": "EPFO passbook fetched", "data": record}

@router.get("/user/{user_id}")
def get_epfo_for_user(user_id: int):
    result = supabase.table("epfo").select("*").eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"epfo": result["data"]}
