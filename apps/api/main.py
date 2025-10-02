import sys
import types
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

if __package__ in (None, ""):
    package_path = Path(__file__).resolve().parent
    parent_path = package_path.parent

    apps_pkg = sys.modules.setdefault("apps", types.ModuleType("apps"))
    if not getattr(apps_pkg, "__path__", None):
        apps_pkg.__path__ = [str(parent_path)]

    api_pkg = sys.modules.setdefault("apps.api", types.ModuleType("apps.api"))
    if not getattr(api_pkg, "__path__", None):
        api_pkg.__path__ = [str(package_path)]

    __package__ = "apps.api"

from .routers import reports

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
