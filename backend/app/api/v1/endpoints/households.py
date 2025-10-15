from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_household(household: schemas.HouseholdCreate, owner_id: int, db: Session = Depends(get_db)):
    db_household = crud.create_household(db, household, owner_id)
    return {"message": "Household created", "household_id": db_household.id}
