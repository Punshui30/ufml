from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import clients, credit_bureaus, disputes, relief, reports

try:
    from .routers import mail
except ModuleNotFoundError as mail_import_error:  # Optional dependency (lob)
    mail = None
    _mail_import_error = mail_import_error
else:
    _mail_import_error = None

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
app.include_router(clients.router, prefix="/clients", tags=["clients"])
app.include_router(disputes.router, prefix="/disputes", tags=["disputes"])
app.include_router(relief.router, prefix="/relief", tags=["relief"])
if mail is not None:
    app.include_router(mail.router, prefix="/mail", tags=["mail"])
else:
    print(
        ">>> Mail router disabled: optional dependency missing ->",
        repr(_mail_import_error),
    )

app.include_router(
    credit_bureaus.router,
    prefix="/credit-bureaus",
    tags=["credit-bureaus"],
)
