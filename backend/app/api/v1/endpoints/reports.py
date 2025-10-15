from fastapi import APIRouter, HTTPException, Request
from app.supabase_client import get_supabase_client

router = APIRouter()

# GET/POST /v1/reports
@router.get("")
def get_reports(user_id: str):
    supabase = get_supabase_client()
    result = supabase.table("reports").select("*").eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=404, detail=result["error"]["message"])
    return result["data"]

@router.post("")
def add_report(user_id: str, report: dict):
    report["user_id"] = user_id
    supabase = get_supabase_client()
    result = supabase.table("reports").insert(report).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Report added", "report": result["data"]}
