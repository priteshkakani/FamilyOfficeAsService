from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from app.surepass_client import sp_post
from app.auth import verify_jwt_token
from app.logger import logger
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app import models
import os
import datetime
from typing import Any, Dict

router = APIRouter()


class GenerateOTPRequest(BaseModel):
    pan: str
    mobile: str



class SubmitOTPRequest(BaseModel):
    transaction_id: str
    otp: str

class PassbookRequest(BaseModel):
    uan: str
    dob: str
    pan: str = None

class ConsentUpsertRequest(BaseModel):
    source: str
    scope: str
    duration: str
    active: bool = True
@router.post("/surepass/epfo/submit-otp")
async def submit_otp(payload: SubmitOTPRequest, user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    try:
        uid = user.get("sub")
        logger.info(f"[surepass_epfo.submit_otp] user={uid} txn={payload.transaction_id}")
        body = {"transaction_id": payload.transaction_id, "otp": payload.otp}
        resp = await sp_post("/v1/epfo/submit-otp", body)
        # TODO: normalize/store as needed
        return {"success": True, "data": resp}
    except Exception as e:
        logger.error(f"[surepass_epfo.submit_otp] error={str(e)}")
        raise HTTPException(status_code=502, detail="Upstream Surepass error")

@router.post("/surepass/epfo/passbook")
async def epfo_passbook(payload: PassbookRequest, user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    try:
        uid = user.get("sub")
        logger.info(f"[surepass_epfo.passbook] user={uid} uan={payload.uan}")
        body = {"uan": payload.uan, "dob": payload.dob}
        if payload.pan:
            body["pan"] = payload.pan
        resp = await sp_post("/v1/epfo/passbook", body)
        # TODO: normalize/store as needed
        return {"success": True, "data": resp}
    except Exception as e:
        logger.error(f"[surepass_epfo.passbook] error={str(e)}")
        raise HTTPException(status_code=502, detail="Upstream Surepass error")

@router.post("/consent/upsert")
async def upsert_consent(payload: ConsentUpsertRequest, user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    try:
        uid = user.get("sub")
        logger.info(f"[consent.upsert] user={uid} source={payload.source}")
        # Upsert consent
        consent = db.query(models.Consent).filter(models.Consent.user_id == uid, models.Consent.source == payload.source).first()
        if consent:
            consent.scope = payload.scope
            consent.duration = payload.duration
            consent.active = payload.active
        else:
            consent = models.Consent(user_id=uid, source=payload.source, scope=payload.scope, duration=payload.duration, active=payload.active, created_at=datetime.datetime.utcnow())
            db.add(consent)
        db.commit()
        db.refresh(consent)
        return {"success": True, "consent": {"id": consent.id, "source": consent.source, "scope": consent.scope, "duration": consent.duration, "active": consent.active}}
    except Exception as e:
        logger.error(f"[consent.upsert] error={str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upsert consent")

@router.get("/rls/check")
async def rls_check(user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    try:
        uid = user.get("sub")
        # Example: check if user has active consent for EPFO
        consent = db.query(models.Consent).filter(models.Consent.user_id == uid, models.Consent.source == "epfo", models.Consent.active == True).first()
        return {"success": True, "rls": bool(consent)}
    except Exception as e:
        logger.error(f"[rls.check] error={str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check RLS")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/surepass/epfo/generate-otp")
async def generate_otp(payload: GenerateOTPRequest, user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    try:
        uid = user.get("sub")
        logger.info(f"[surepass_epfo.generate_otp] user={uid}")
        body = {"pan": payload.pan, "mobile": payload.mobile}
        # call surepass
        resp = await sp_post("/v1/epfo/generate-otp", body)
        # expected resp contains transaction_id or similar
        txn = resp.get("transaction_id") or resp.get("txn_id") or resp.get("request_id")
        # persist otp request
        rec = models.EPFOOTPRequest(user_id=uid, pan=payload.pan, mobile=payload.mobile, transaction_id=txn)
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return {"success": True, "transaction_id": txn, "message": "OTP generated", "raw": resp}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[surepass_epfo.generate_otp] error={str(e)}")
        raise HTTPException(status_code=502, detail="Upstream Surepass error")


@router.post("/surepass/epfo/verify-otp")
async def verify_otp(payload: VerifyOTPRequest, user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    try:
        uid = user.get("sub")
        logger.info(f"[surepass_epfo.verify_otp] user={uid} txn={payload.transaction_id}")
        body = {"transaction_id": payload.transaction_id, "otp": payload.otp}
        resp = await sp_post("/v1/epfo/verify-otp", body)
        # normalize and store summary
        def normalize_epfo(raw: Any) -> Dict[str, Any]:
            # Heuristic normalization for Surepass EPFO response
            norm: Dict[str, Any] = {}
            # Try common locations
            try:
                if isinstance(raw, dict):
                    # passbook with balance
                    pb = raw.get("passbook") or raw.get("data") or raw
                    if isinstance(pb, dict):
                        # balance
                        bal = pb.get("balance") or pb.get("total_balance") or pb.get("current_balance")
                        if bal is not None:
                            norm["balance"] = bal
                        # last contribution date
                        last = pb.get("last_contribution_date") or pb.get("last_contribution") or pb.get("last_contribution_on")
                        if last:
                            norm["last_contribution"] = last
                        # employer
                        emp = pb.get("employer") or pb.get("employer_name") or pb.get("establishment")
                        if emp:
                            norm["employer"] = emp
                        # member name / uan
                        member = pb.get("member_name") or pb.get("name") or pb.get("member")
                        if member:
                            norm["member_name"] = member
                        uan = pb.get("uan") or raw.get("uan") or pb.get("member_uan")
                        if uan:
                            norm["uan"] = uan
                        # contributions count
                        contribs = pb.get("contributions_count") or (isinstance(pb.get("contributions"), list) and len(pb.get("contributions")))
                        if contribs:
                            norm["contributions_count"] = contribs
            except Exception:
                pass
            # fallback: include top-level keys if nothing found
            if not norm and isinstance(raw, dict):
                # try find numeric fields
                for k in ("balance", "total", "amount"):
                    if k in raw:
                        norm["balance"] = raw.get(k)
                        break
            norm["normalized_at"] = datetime.datetime.utcnow().isoformat()
            return norm

        normalized = normalize_epfo(resp)
        summary = models.EPFOSummary(user_id=uid, transaction_id=payload.transaction_id, raw_json=resp, normalized_json=normalized)
        db.add(summary)
        db.commit()
        db.refresh(summary)
        # return normalized payload for UI
        return {"success": True, "transaction_id": payload.transaction_id, "data": resp, "normalized": normalized}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[surepass_epfo.verify_otp] error={str(e)}")
        raise HTTPException(status_code=502, detail="Upstream Surepass error")


@router.get("/epfo/summaries")
async def list_epfo_summaries(user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    try:
        uid = user.get("sub")
        logger.info(f"[surepass_epfo.list_epfo_summaries] user={uid}")
        rows = db.query(models.EPFOSummary).filter(models.EPFOSummary.user_id == uid).order_by(models.EPFOSummary.created_at.desc()).all()
        results = []
        for r in rows:
            results.append({
                "id": r.id,
                "transaction_id": r.transaction_id,
                "raw": r.raw_json,
                "normalized": r.normalized_json,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            })
        return {"success": True, "data": results}
    except Exception as e:
        logger.error(f"[surepass_epfo.list_epfo_summaries] error={str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch EPFO summaries")


@router.get("/epfo/latest")
async def latest_epfo_summary(user=Depends(verify_jwt_token), db: Session = Depends(get_db)):
    try:
        uid = user.get("sub")
        logger.info(f"[surepass_epfo.latest_epfo_summary] user={uid}")
        r = db.query(models.EPFOSummary).filter(models.EPFOSummary.user_id == uid).order_by(models.EPFOSummary.created_at.desc()).first()
        if not r:
            return {"success": True, "data": None}
        return {"success": True, "data": {"id": r.id, "transaction_id": r.transaction_id, "raw": r.raw_json, "normalized": r.normalized_json, "created_at": r.created_at.isoformat()}}
    except Exception as e:
        logger.error(f"[surepass_epfo.latest_epfo_summary] error={str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch EPFO summary")
