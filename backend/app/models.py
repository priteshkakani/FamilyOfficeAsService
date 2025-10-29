from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, JSON, Boolean, TIMESTAMP, Numeric, DateTime
from sqlalchemy.orm import relationship
from .database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String(15), unique=True, nullable=False)
    name = Column(String(100))
    email = Column(String(100))
    created_at = Column(TIMESTAMP)

class Household(Base):
    __tablename__ = "households"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(TIMESTAMP)

class FamilyMember(Base):
    __tablename__ = "family_members"
    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"))
    name = Column(String(100))
    relationship = Column(String(50))
    role = Column(Enum("decision-maker", "view-only"))

class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"))
    type = Column(String(50))
    details = Column(JSON)

class Consent(Base):
    __tablename__ = "consents"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    source = Column(String(100))
    scope = Column(String(255))
    duration = Column(String(50))
    active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP)

class IncomeRecord(Base):
    __tablename__ = "income_records"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    source = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    frequency = Column(String(50))
    date_received = Column(Date, nullable=False)
    notes = Column(String(255))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class ExpenseRecord(Base):
    __tablename__ = "expense_records"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100))
    amount = Column(Numeric(12, 2), nullable=False)
    payment_mode = Column(String(50))
    date_incurred = Column(Date, nullable=False)
    recurring = Column(Boolean, default=False)
    notes = Column(String(255))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
