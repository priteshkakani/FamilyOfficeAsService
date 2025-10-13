from fastapi import FastAPI, Request, Depends
from app.auth import verify_jwt_token
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import users, households, assets, email_auth, tax_itr, epfo, profile, family, liabilities, insurance, reports, dashboard

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
app.include_router(profile.router, prefix="/api/v1/users", tags=["profile"])
app.include_router(households.router, prefix="/api/v1/households", tags=["households"])
app.include_router(family.router, prefix="/api/v1/family", tags=["family"])
app.include_router(assets.router, prefix="/api/v1/assets", tags=["assets"])
app.include_router(liabilities.router, prefix="/api/v1/liabilities", tags=["liabilities"])
app.include_router(insurance.router, prefix="/api/v1/insurance", tags=["insurance"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])
app.include_router(email_auth.router, prefix="/api/v1/users", tags=["auth"])
app.include_router(tax_itr.router, prefix="/api/v1/tax-itr", tags=["tax-itr"])
app.include_router(epfo.router, prefix="/api/v1/epfo", tags=["epfo"])

@app.get("/api/v1/protected-check")
def protected_check(user=Depends(verify_jwt_token)):
	return {"message": "You are authenticated!", "user": user}

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
