import os
import requests
from fastapi import Depends, HTTPException, status, Request
from functools import lru_cache

# Import jose (python-jose) dynamically to avoid static analysis failures in
# environments that don't have python-jose installed. If unavailable, set jwt
# to None and JWTError to a generic Exception so runtime calls raise clear
# errors.
import importlib

_jose_spec = importlib.util.find_spec("jose")
if _jose_spec is not None:
    _jose = importlib.import_module("jose")
    jwt = getattr(_jose, "jwt", None)
    JWTError = getattr(_jose, "JWTError", Exception)
else:  # pragma: no cover - environment-dependent
    jwt = None
    JWTError = Exception

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
        if jwt is None:
            # Clear runtime error when jose isn't installed
            raise HTTPException(status_code=500, detail="jwt library not installed")
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
