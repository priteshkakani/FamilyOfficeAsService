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
