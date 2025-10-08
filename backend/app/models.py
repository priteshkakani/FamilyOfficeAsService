from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, JSON, Boolean, TIMESTAMP
from sqlalchemy.orm import relationship
from .database import Base

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
    dob = Column(Date)
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
