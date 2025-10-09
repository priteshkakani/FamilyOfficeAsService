from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from supabase import create_client, Client
import os
import asyncio

router = APIRouter()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/users/send-magic-link")
async def send_magic_link(request: Request):
    data = await request.json()
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    try:
        # supabase-py is sync, so run in thread
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(None, lambda: supabase.auth.sign_in_with_otp(email=email))
        if res.get("error"):
            return JSONResponse(status_code=400, content={"error": res["error"]["message"]})
        return {"message": "Magic link sent"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
