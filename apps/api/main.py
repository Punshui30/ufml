"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.api.routers import ai, clients, disputes, reports

app = FastAPI(title="UFML API", version="0.1.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)

@app.get("/healthz")
def healthz():
    return {"ok": True}

# Log on startup so you KNOW this file is the one running
@app.on_event("startup")
async def _boot():
    print(">>> UFML API STARTED WITH CORS ENABLED <<<")
    print(">>> Allow Origins: http://127.0.0.1:3000, http://localhost:3000 <<<")

app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(clients.router, prefix="/clients", tags=["clients"])
app.include_router(disputes.router, prefix="/disputes", tags=["disputes"])
