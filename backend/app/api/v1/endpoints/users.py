
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from ... import schemas, crud
from ...database import SessionLocal
from ...supabase_client import supabase

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Supabase Auth: Signup
@router.post("/supabase-signup")
def supabase_signup(user: schemas.UserCreate):
    # Use mobile as email if email not provided
    email = user.email or f"{user.mobile}@foas.com"
    password = user.mobile  # For demo, use mobile as password (not secure)
    result = supabase.auth.sign_up({"email": email, "password": password, "phone": user.mobile})
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {"message": "Signup successful", "user": result["user"]}

# Supabase Auth: Login
@router.post("/supabase-login")
def supabase_login(mobile: str):
    email = f"{mobile}@foas.com"
    password = mobile
    result = supabase.auth.sign_in_with_password({"email": email, "password": password})
    if result.get("error"):
        raise HTTPException(status_code=401, detail=result["error"]["message"])
    return {"message": "Login successful", "session": result["session"]}
