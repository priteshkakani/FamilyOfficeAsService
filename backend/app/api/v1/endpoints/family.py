@router.delete("/{member_id}")
def delete_family_member(member_id: int, user_id: str):
    supabase = get_supabase_client()
    # Only allow delete if member belongs to user
    existing = supabase.table("family_members").select("*").eq("id", member_id).eq("user_id", user_id).single().execute()
    if not existing or existing.get("error") or not existing.get("data"):
        raise HTTPException(status_code=404, detail="Family member not found or does not belong to user.")
    result = supabase.table("family_members").delete().eq("id", member_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Family member deleted", "id": member_id}
from fastapi import APIRouter, HTTPException, Request, Depends
from app.supabase_client import get_supabase_client

router = APIRouter()

# GET/POST /v1/family
@router.get("")
def get_family(user_id: str):
    supabase = get_supabase_client()
    result = supabase.table("family_members").select("*").eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=404, detail=result["error"]["message"])
    return result["data"]

@router.post("")
def add_family_member(user_id: str, member: dict):
    member["user_id"] = user_id
    supabase = get_supabase_client()
    # Check for duplicate name for this user
    existing = supabase.table("family_members").select("*").eq("user_id", user_id).eq("name", member["name"]).execute()
    if existing["data"] and len(existing["data"]) > 0:
        raise HTTPException(status_code=400, detail="Family member name already exists for this user.")
    result = supabase.table("family_members").insert(member).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Family member added", "member": result["data"]}
