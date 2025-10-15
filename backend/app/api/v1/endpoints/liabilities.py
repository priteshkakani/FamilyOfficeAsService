from fastapi import APIRouter, HTTPException, Request
from app.supabase_client import get_supabase_client

router = APIRouter()

# GET/POST /v1/liabilities
@router.get("")
def get_liabilities(user_id: str):
    supabase = get_supabase_client()
    result = supabase.table("liabilities").select("*").eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=404, detail=result["error"]["message"])
    return result["data"]

@router.post("")
def add_liability(user_id: str, liability: dict):
    liability["user_id"] = user_id
    supabase = get_supabase_client()
    result = supabase.table("liabilities").insert(liability).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Liability added", "liability": result["data"]}
