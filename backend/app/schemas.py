from pydantic import BaseModel
from typing import List, Optional

class UserCreate(BaseModel):
    mobile: str
    name: Optional[str] = None
    email: Optional[str] = None

class FamilyMemberCreate(BaseModel):
    name: str
    dob: str
    relationship: str
    role: str

class HouseholdCreate(BaseModel):
    name: str
    members: List[FamilyMemberCreate]

class AssetCreate(BaseModel):
    type: str
    details: dict

class IncomeRecordCreate(BaseModel):
    source: str
    category: str
    amount: float
    frequency: str = None
    date_received: str
    notes: str = None

class IncomeRecordOut(IncomeRecordCreate):
    id: str
    user_id: str
    created_at: str = None
    updated_at: str = None

class ExpenseRecordCreate(BaseModel):
    category: str
    subcategory: str = None
    amount: float
    payment_mode: str = None
    date_incurred: str
    recurring: bool = False
    notes: str = None

class ExpenseRecordOut(ExpenseRecordCreate):
    id: str
    user_id: str
    created_at: str = None
    updated_at: str = None
