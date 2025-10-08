from fastapi import FastAPI
from app.api.v1.endpoints import users, households, assets

app = FastAPI(title="Family Office as a Service")

app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(households.router, prefix="/api/v1/households", tags=["households"])
app.include_router(assets.router, prefix="/api/v1/assets", tags=["assets"])
