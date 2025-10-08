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

@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.create_user(db, user)
    # Simulate OTP send
    return {"message": "OTP sent to mobile", "user_id": db_user.id}
