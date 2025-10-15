import os
import requests
from fastapi import Depends, HTTPException, status, Request
from jose import jwt
from jose.exceptions import JWTError
from functools import lru_cache

SUPABASE_PROJECT_ID = os.getenv("SUPABASE_PROJECT_ID") or os.getenv("SUPABASE_URL", "").split(".co")[0].split("//")[-1]
SUPABASE_JWKS_URL = f"https://{SUPABASE_PROJECT_ID}.supabase.co/auth/v1/keys"

@lru_cache()
def get_jwks():
    resp = requests.get(SUPABASE_JWKS_URL)
    resp.raise_for_status()
    return resp.json()["keys"]

def get_current_user(request: Request):
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = auth.split(" ", 1)[1]
    try:
        jwks = get_jwks()
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header["kid"]
        key = next((k for k in jwks if k["kid"] == kid), None)
        if not key:
            raise HTTPException(status_code=401, detail="Invalid token: key not found")
        payload = jwt.decode(token, key, algorithms=[key["alg"]], options={"verify_aud": False})
        return {"id": payload.get("sub"), "email": payload.get("email")}
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
