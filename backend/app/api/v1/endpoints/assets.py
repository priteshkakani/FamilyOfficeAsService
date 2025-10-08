from fastapi import APIRouter, Depends
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
