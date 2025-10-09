from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from ... import schemas, crud
from ...database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_asset(asset: schemas.AssetCreate, household_id: int, db: Session = Depends(get_db)):
    db_asset = crud.create_asset(db, asset, household_id)
    return {"message": "Asset added", "asset_id": db_asset.id}


# Upload endpoint for documents/assets
import os
from fastapi.responses import JSONResponse

UPLOAD_DIR = "/tmp/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return JSONResponse({"filename": file.filename, "url": f"/uploads/{file.filename}"})
