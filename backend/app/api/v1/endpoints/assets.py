from fastapi import APIRouter, File, UploadFile, HTTPException
from ... import schemas
from ...supabase_client import supabase
import uuid

router = APIRouter()

# Fetch all assets for a household from Supabase
@router.get("/supabase/assets")
def get_assets_supabase(household_id: int):
    result = supabase.table("assets").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"assets": result["data"]}

# Fetch all liabilities for a household from Supabase
@router.get("/supabase/liabilities")
def get_liabilities_supabase(household_id: int):
    result = supabase.table("liabilities").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"liabilities": result["data"]}

# Fetch all cashflows for a household from Supabase
@router.get("/supabase/cashflows")
def get_cashflows_supabase(household_id: int):
    result = supabase.table("cashflows").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"cashflows": result["data"]}

# Fetch all expenses for a household from Supabase
@router.get("/supabase/expenses")
def get_expenses_supabase(household_id: int):
    result = supabase.table("expenses").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"expenses": result["data"]}

# Fetch all family members for a household from Supabase
@router.get("/supabase/family")
def get_family_supabase(household_id: int):
    result = supabase.table("family_members").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"family_members": result["data"]}

# Supabase: Store asset in Postgres table
@router.post("/supabase")
def create_asset_supabase(asset: schemas.AssetCreate, household_id: int):
    # Insert asset into Supabase 'assets' table
    data = {
        "household_id": household_id,
        "type": asset.type,
        "details": asset.details,
    }
    result = supabase.table("assets").insert(data).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Asset added", "data": result["data"]}

# Supabase: Upload PDF/document to storage bucket
@router.post("/upload-supabase")
async def upload_file_supabase(file: UploadFile = File(...)):
    bucket = "documents"
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_bytes = await file.read()
    res = supabase.storage.from_(bucket).upload(filename, file_bytes, file.content_type)
    if res.get("error"):
        raise HTTPException(status_code=400, detail=res["error"]["message"])
    public_url = supabase.storage.from_(bucket).get_public_url(filename)
    return {"filename": filename, "url": public_url}
