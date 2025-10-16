from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import verify_jwt_token
from app.models import IncomeRecord, ExpenseRecord
from app.schemas import IncomeRecordCreate, IncomeRecordOut, ExpenseRecordCreate, ExpenseRecordOut
from typing import List

router = APIRouter()

@router.post("/income", response_model=IncomeRecordOut, status_code=status.HTTP_201_CREATED)
def create_income(
    income: IncomeRecordCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_jwt_token),
):
    db_income = IncomeRecord(**income.dict(), user_id=user["id"])
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

@router.get("/income", response_model=List[IncomeRecordOut])
def get_income(
    db: Session = Depends(get_db),
    user=Depends(verify_jwt_token),
):
    return db.query(IncomeRecord).filter(IncomeRecord.user_id == user["id"]).all()

@router.post("/expenses", response_model=ExpenseRecordOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseRecordCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_jwt_token),
):
    db_expense = ExpenseRecord(**expense.dict(), user_id=user["id"])
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/expenses", response_model=List[ExpenseRecordOut])
def get_expenses(
    db: Session = Depends(get_db),
    user=Depends(verify_jwt_token),
):
    return db.query(ExpenseRecord).filter(ExpenseRecord.user_id == user["id"]).all()
