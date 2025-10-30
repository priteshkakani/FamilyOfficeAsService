from fastapi import FastAPI, Request, Depends
from app.auth import verify_jwt_token
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.middleware import LoggingMiddleware

from app.api.v1.endpoints import users, households, assets, email_auth, tax_itr, epfo, profile, family, liabilities, insurance, reports, dashboard, income_expense
from app.api.v1.endpoints import surepass_epfo
from app.models import IncomeRecord, ExpenseRecord
from app.database import SessionLocal
from app.schemas import IncomeRecordCreate, IncomeRecordOut, ExpenseRecordCreate, ExpenseRecordOut
from fastapi import status
from typing import List
from sqlalchemy.orm import Session
import datetime

app = FastAPI(title="Family Office as a Service")
app.add_middleware(LoggingMiddleware)

# Allow CORS for frontend
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # In production, set to your frontend domain
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="/tmp/uploads"), name="uploads")




app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(profile.router, prefix="/api/v1/users", tags=["profile"])
app.include_router(households.router, prefix="/api/v1/households", tags=["households"])
app.include_router(family.router, prefix="/api/v1/family", tags=["family"])
app.include_router(assets.router, prefix="/api/v1/assets", tags=["assets"])
app.include_router(liabilities.router, prefix="/api/v1/liabilities", tags=["liabilities"])
app.include_router(insurance.router, prefix="/api/v1/insurance", tags=["insurance"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(email_auth.router, prefix="/api/v1/users", tags=["auth"])
app.include_router(income_expense.router, prefix="/api/v1", tags=["income-expense"])
app.include_router(tax_itr.router, prefix="/api/v1/tax-itr", tags=["tax-itr"])
app.include_router(epfo.router, prefix="/api/v1/epfo", tags=["epfo"])
app.include_router(surepass_epfo.router, prefix="/api", tags=["surepass"])

@app.get("/api/v1/protected-check")
def protected_check(user=Depends(verify_jwt_token)):
	return {"message": "You are authenticated!", "user": user}


@app.get("/api/health")
async def health():
    return {"status": "ok"}

# Supabase Google OAuth endpoint
import os
from fastapi.responses import RedirectResponse

# Surepass integration
from app.surepass_client import sp_post
from app.logger import logger
from fastapi import HTTPException
from pydantic import BaseModel


@app.get("/api/v1/users/google-login")
async def google_login(request: Request):
	supabase_url = os.environ.get("SUPABASE_URL", "https://fomyxahwvnfivxvrjtpf.supabase.co")
	redirect_to = request.query_params.get("redirect_to") or "https://your-frontend-domain.com/login"  # Set to your frontend URL
	oauth_url = f"{supabase_url}/auth/v1/authorize?provider=google&redirect_to={redirect_to}"
	return RedirectResponse(oauth_url)


# --- Surepass API Proxy Endpoints ---

class EPFOGenerateOTPRequest(BaseModel):
	uan: str
	dob: str
	mobile: str

class EPFOSubmitOTPRequest(BaseModel):
	uan: str
	otp: str
	txn_id: str

class EPFOPassbookRequest(BaseModel):
	uan: str
	dob: str
	txn_id: str

class ITRAISRequest(BaseModel):
	pan: str
	dob: str
	mobile: str
	otp: str
	txn_id: str

@app.post("/api/v1/surepass/epfo/generate-otp")
async def surepass_epfo_generate_otp(payload: EPFOGenerateOTPRequest, user=Depends(verify_jwt_token)):
	try:
		logger.info(f"EPFO Generate OTP request by user: {user.get('sub')}")
		result = await sp_post("/epfo/generate-otp", payload.dict())
		return result
	except Exception as e:
		logger.error(f"EPFO Generate OTP error: {str(e)}")
		raise HTTPException(status_code=500, detail="Surepass EPFO Generate OTP failed")

@app.post("/api/v1/surepass/epfo/submit-otp")
async def surepass_epfo_submit_otp(payload: EPFOSubmitOTPRequest, user=Depends(verify_jwt_token)):
	try:
		logger.info(f"EPFO Submit OTP request by user: {user.get('sub')}")
		result = await sp_post("/epfo/submit-otp", payload.dict())
		return result
	except Exception as e:
		logger.error(f"EPFO Submit OTP error: {str(e)}")
		raise HTTPException(status_code=500, detail="Surepass EPFO Submit OTP failed")

@app.post("/api/v1/surepass/epfo/passbook")
async def surepass_epfo_passbook(payload: EPFOPassbookRequest, user=Depends(verify_jwt_token)):
	try:
		logger.info(f"EPFO Passbook request by user: {user.get('sub')}")
		result = await sp_post("/epfo/passbook", payload.dict())
		return result
	except Exception as e:
		logger.error(f"EPFO Passbook error: {str(e)}")
		raise HTTPException(status_code=500, detail="Surepass EPFO Passbook failed")

@app.post("/api/v1/surepass/itr/ais")
async def surepass_itr_ais(payload: ITRAISRequest, user=Depends(verify_jwt_token)):
	try:
		logger.info(f"ITR AIS request by user: {user.get('sub')}")
		result = await sp_post("/itr/ais", payload.dict())
		return result
	except Exception as e:
		logger.error(f"ITR AIS error: {str(e)}")
		raise HTTPException(status_code=500, detail="Surepass ITR AIS failed")


# Dependency to get DB session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/income", response_model=IncomeRecordOut, status_code=status.HTTP_201_CREATED)
async def create_income_record(payload: IncomeRecordCreate, user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    record = IncomeRecord(
        user_id=user["sub"],
        source=payload.source,
        category=payload.category,
        amount=payload.amount,
        frequency=payload.frequency,
        date_received=payload.date_received,
        notes=payload.notes,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.get("/api/income", response_model=List[IncomeRecordOut])
async def list_income_records(user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    return db.query(IncomeRecord).filter(IncomeRecord.user_id == user["sub"]).all()

@app.post("/api/expenses", response_model=ExpenseRecordOut, status_code=status.HTTP_201_CREATED)
async def create_expense_record(payload: ExpenseRecordCreate, user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    record = ExpenseRecord(
        user_id=user["sub"],
        category=payload.category,
        subcategory=payload.subcategory,
        amount=payload.amount,
        payment_mode=payload.payment_mode,
        date_incurred=payload.date_incurred,
        recurring=payload.recurring,
        notes=payload.notes,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.get("/api/expenses", response_model=List[ExpenseRecordOut])
async def list_expense_records(user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    return db.query(ExpenseRecord).filter(ExpenseRecord.user_id == user["sub"]).all()
