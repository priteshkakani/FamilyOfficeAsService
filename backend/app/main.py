from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import users, households, assets, email_auth

app = FastAPI(title="Family Office as a Service")

# Allow CORS for frontend
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # In production, set to your frontend domain
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="/tmp/uploads"), name="uploads")


app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(households.router, prefix="/api/v1/households", tags=["households"])
app.include_router(assets.router, prefix="/api/v1/assets", tags=["assets"])
app.include_router(email_auth.router, prefix="/api/v1/users", tags=["auth"])

# Supabase Google OAuth endpoint
import os
from fastapi.responses import RedirectResponse
from app.supabase_client import supabase

@app.get("/api/v1/users/google-login")
async def google_login(request: Request):
	# Use Supabase RESTful API for OAuth
	supabase_url = os.environ.get("SUPABASE_URL", "https://fomyxahwvnfivxvrjtpf.supabase.co")
	redirect_to = request.query_params.get("redirect_to") or "https://your-frontend-domain.com/login"  # Set to your frontend URL
	# Supabase OAuth URL
	oauth_url = f"{supabase_url}/auth/v1/authorize?provider=google&redirect_to={redirect_to}"
	return RedirectResponse(oauth_url)
