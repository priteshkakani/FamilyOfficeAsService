from fastapi import APIRouter, HTTPException, Request, Depends
from ...supabase_client import supabase

router = APIRouter()

# GET/POST /v1/users/profile
@router.get("/profile")
def get_user_profile(user_id: str):
    result = supabase.table("profiles").select("*").eq("user_id", user_id).single().execute()
    if result.get("error"):
        raise HTTPException(status_code=404, detail=result["error"]["message"])
    return result["data"]

@router.post("/profile")
def update_user_profile(user_id: str, profile: dict):
    result = supabase.table("profiles").update(profile).eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Profile updated", "profile": result["data"]}
