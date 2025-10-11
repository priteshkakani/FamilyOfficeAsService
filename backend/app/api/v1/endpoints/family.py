from fastapi import APIRouter, HTTPException, Request, Depends
from ...supabase_client import supabase

router = APIRouter()

# GET/POST /v1/family
@router.get("")
def get_family(user_id: str):
    result = supabase.table("family_members").select("*").eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=404, detail=result["error"]["message"])
    return result["data"]

@router.post("")
def add_family_member(user_id: str, member: dict):
    member["user_id"] = user_id
    result = supabase.table("family_members").insert(member).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Family member added", "member": result["data"]}
