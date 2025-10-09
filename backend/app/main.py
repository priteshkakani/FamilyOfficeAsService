from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.v1.endpoints import users, households, assets, email_auth

app = FastAPI(title="Family Office as a Service")

app.mount("/uploads", StaticFiles(directory="/tmp/uploads"), name="uploads")


app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(households.router, prefix="/api/v1/households", tags=["households"])
app.include_router(assets.router, prefix="/api/v1/assets", tags=["assets"])
app.include_router(email_auth.router, prefix="/api/v1/users", tags=["auth"])
