from sqlalchemy.orm import Session
from . import models, schemas

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(mobile=user.mobile, name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_household(db: Session, household: schemas.HouseholdCreate, owner_id: int):
    db_household = models.Household(name=household.name, owner_id=owner_id)
    db.add(db_household)
    db.commit()
    db.refresh(db_household)
    for member in household.members:
        db_member = models.FamilyMember(
            household_id=db_household.id,
            name=member.name,
            dob=member.dob,
            relationship=member.relationship,
            role=member.role
        )
        db.add(db_member)
    db.commit()
    return db_household

def create_asset(db: Session, asset: schemas.AssetCreate, household_id: int):
    db_asset = models.Asset(
        household_id=household_id,
        type=asset.type,
        details=asset.details
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset
