from fastapi import APIRouter, HTTPException, Request
from ...supabase_client import supabase

router = APIRouter()

# GET/POST /v1/insurance
@router.get("")
def get_insurance(user_id: str):
    result = supabase.table("insurance").select("*").eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=404, detail=result["error"]["message"])
    return result["data"]

@router.post("")
def add_insurance(user_id: str, insurance: dict):
    insurance["user_id"] = user_id
    result = supabase.table("insurance").insert(insurance).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Insurance added", "insurance": result["data"]}
