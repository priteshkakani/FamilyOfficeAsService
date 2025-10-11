from fastapi import APIRouter, HTTPException, Request
from ...supabase_client import supabase

router = APIRouter()

# GET /v1/dashboard/summary
@router.get("/summary")
def get_dashboard_summary(user_id: str):
    # Example: Aggregate net worth, assets, liabilities, insurance, etc.
    net_worth = 0
    assets = supabase.table("assets").select("amount").eq("user_id", user_id).execute()
    liabilities = supabase.table("liabilities").select("amount").eq("user_id", user_id).execute()
    insurance = supabase.table("insurance").select("amount").eq("user_id", user_id).execute()
    if assets.get("error") or liabilities.get("error") or insurance.get("error"):
        raise HTTPException(status_code=400, detail="Error fetching summary data")
    total_assets = sum([a["amount"] for a in assets["data"]])
    total_liabilities = sum([l["amount"] for l in liabilities["data"]])
    total_insurance = sum([i["amount"] for i in insurance["data"]])
    net_worth = total_assets - total_liabilities
    return {
        "net_worth": net_worth,
        "total_assets": total_assets,
        "total_liabilities": total_liabilities,
        "total_insurance": total_insurance
    }
