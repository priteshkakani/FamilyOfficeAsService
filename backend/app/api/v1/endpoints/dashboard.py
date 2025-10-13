
from fastapi import APIRouter, HTTPException, Request
import asyncpg
import os
import datetime

router = APIRouter()

# Helper to get asyncpg connection
async def get_pg_conn():
    pg_url = os.environ.get("SUPABASE_DB_URL") or os.environ.get("DATABASE_URL")
    if not pg_url:
        raise RuntimeError("SUPABASE_DB_URL or DATABASE_URL env var required")
    return await asyncpg.connect(pg_url)

# GET /v1/dashboard/summary
@router.get("/summary")
async def get_dashboard_summary(request: Request, user_id: str):
    """
    Returns: {
      total_assets, total_liabilities, net_worth, epfo_balance, last_updated
    }
    """
    conn = await get_pg_conn()
    try:
        # Assets
        assets_row = await conn.fetchrow("SELECT COALESCE(SUM(value),0) AS total FROM assets WHERE user_id = $1", user_id)
        total_assets = assets_row["total"] if assets_row else 0
        # Liabilities
        liabilities_row = await conn.fetchrow("SELECT COALESCE(SUM(value),0) AS total FROM liabilities WHERE user_id = $1", user_id)
        total_liabilities = liabilities_row["total"] if liabilities_row else 0
        # EPFO
        epfo_row = await conn.fetchrow("SELECT COALESCE(SUM(balance),0) AS total FROM epfo_data WHERE user_id = $1", user_id)
        epfo_balance = epfo_row["total"] if epfo_row else 0
        # Last updated (latest from any table)
        last_updated_row = await conn.fetchrow("""
            SELECT MAX(updated_at) AS last_updated FROM (
                SELECT MAX(updated_at) AS updated_at FROM assets WHERE user_id = $1
                UNION ALL
                SELECT MAX(updated_at) FROM liabilities WHERE user_id = $1
                UNION ALL
                SELECT MAX(updated_at) FROM epfo_data WHERE user_id = $1
            ) t
        """, user_id)
        last_updated = last_updated_row["last_updated"].isoformat() if last_updated_row and last_updated_row["last_updated"] else None
        net_worth = total_assets - total_liabilities
        return {
            "total_assets": total_assets,
            "total_liabilities": total_liabilities,
            "net_worth": net_worth,
            "epfo_balance": epfo_balance,
            "last_updated": last_updated,
        }
    finally:
        await conn.close()
