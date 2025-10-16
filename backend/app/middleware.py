from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from .logger import logger
import traceback
import time

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        try:
            response = await call_next(request)
            process_time = (time.time() - start) * 1000
            logger.info(f"🟢 {request.method} {request.url.path} {response.status_code} {process_time:.2f}ms")
            return response
        except Exception as exc:
            tb = traceback.format_exc()
            logger.error(f"🔴 {request.method} {request.url.path} 500\n{tb}")
            return JSONResponse(
                status_code=500,
                content={"error": "Internal server error", "detail": str(exc)},
            )
