from fastapi import APIRouter, HTTPException, Request, Depends
from app.supabase_client import get_supabase_client

router = APIRouter()

# GET/POST /v1/users/profile
@router.get("/profile")
def get_user_profile(user_id: str):
    supabase = get_supabase_client()
    result = supabase.table("profiles").select("*").eq("user_id", user_id).single().execute()
    if result.get("error"):
        raise HTTPException(status_code=404, detail=result["error"]["message"])
    return result["data"]

@router.post("/profile")
def update_user_profile(user_id: str, profile: dict):
    supabase = get_supabase_client()
    result = supabase.table("profiles").update(profile).eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Profile updated", "profile": result["data"]}
