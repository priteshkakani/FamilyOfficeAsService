from fastapi import APIRouter, HTTPException, Request, Depends
from app.supabase_client import get_supabase_client

router = APIRouter()

# GET/POST /v1/users/profile
@router.get("/profile")
def get_user_profile(user_id: str):
    supabase = get_supabase_client()
    result = supabase.table("profiles").select("*, monthly_income_details").eq("id", user_id).single().execute()
    if result.get("error"):
        raise HTTPException(status_code=404, detail=result["error"]["message"])
    data = result["data"]
    # Ensure monthly_income_details is present, default to empty dict if missing
    if "monthly_income_details" not in data or data["monthly_income_details"] is None:
        data["monthly_income_details"] = {}
    return data

@router.post("/profile")
def update_user_profile(user_id: str, profile: dict):
    supabase = get_supabase_client()
    # Ensure monthly_income_details is included in update if present
    update_data = dict(profile)
    if "monthly_income_details" not in update_data:
        update_data["monthly_income_details"] = profile.get("monthly_income_details", {})
    result = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Profile updated", "profile": result["data"]}
