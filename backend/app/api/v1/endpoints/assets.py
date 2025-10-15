from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, Request
from app.auth import verify_jwt_token
from app import schemas
from app.supabase_client import get_supabase_client
import uuid

router = APIRouter()


# --- CRUD endpoints for assets with Supabase JWT auth ---

@router.get("/", summary="Get all assets for user")
def get_assets(user=Depends(verify_jwt_token)):
    user_id = user["sub"] if isinstance(user, dict) and "sub" in user else user.get("user_id")
    supabase = get_supabase_client()
    result = supabase.table("assets").select("*").eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return result["data"]

@router.post("/", summary="Create new asset")
def create_asset(asset: schemas.AssetCreate, user=Depends(verify_jwt_token)):
    user_id = user["sub"] if isinstance(user, dict) and "sub" in user else user.get("user_id")
    data = asset.dict()
    data["user_id"] = user_id
    supabase = get_supabase_client()
    result = supabase.table("assets").insert(data).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return result["data"][0] if result["data"] else {}

@router.put("/{id}", summary="Update asset by id")
def update_asset(id: int, asset: schemas.AssetCreate, user=Depends(verify_jwt_token)):
    user_id = user["sub"] if isinstance(user, dict) and "sub" in user else user.get("user_id")
    data = asset.dict()
    supabase = get_supabase_client()
    result = supabase.table("assets").update(data).eq("id", id).eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return result["data"][0] if result["data"] else {}

@router.delete("/{id}", summary="Delete asset by id")
def delete_asset(id: int, user=Depends(verify_jwt_token)):
    user_id = user["sub"] if isinstance(user, dict) and "sub" in user else user.get("user_id")
    supabase = get_supabase_client()
    result = supabase.table("assets").delete().eq("id", id).eq("user_id", user_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Asset deleted"}

# Fetch all liabilities for a household from Supabase
@router.get("/supabase/liabilities")
def get_liabilities_supabase(household_id: int):
    supabase = get_supabase_client()
    result = supabase.table("liabilities").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"liabilities": result["data"]}

# Fetch all cashflows for a household from Supabase
@router.get("/supabase/cashflows")
def get_cashflows_supabase(household_id: int):
    supabase = get_supabase_client()
    result = supabase.table("cashflows").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"cashflows": result["data"]}

# Fetch all expenses for a household from Supabase
@router.get("/supabase/expenses")
def get_expenses_supabase(household_id: int):
    supabase = get_supabase_client()
    result = supabase.table("expenses").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"expenses": result["data"]}

# Fetch all family members for a household from Supabase
@router.get("/supabase/family")
def get_family_supabase(household_id: int):
    supabase = get_supabase_client()
    result = supabase.table("family_members").select("*").eq("household_id", household_id).execute()
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"family_members": result["data"]}

# Supabase: Store asset in Postgres table
@router.post("/supabase")
def create_asset_supabase(asset: schemas.AssetCreate, household_id: int):
    supabase = get_supabase_client()
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
    supabase = get_supabase_client()
    bucket = "documents"
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_bytes = await file.read()
    res = supabase.storage.from_(bucket).upload(filename, file_bytes, file.content_type)
    if res.get("error"):
        raise HTTPException(status_code=400, detail=res["error"]["message"])
    public_url = supabase.storage.from_(bucket).get_public_url(filename)
    return {"filename": filename, "url": public_url}
