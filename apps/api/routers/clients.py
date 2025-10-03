from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr


class Client(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: str = "client"
    account_id: Optional[str] = None
    created_at: str


class ClientCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None


router = APIRouter()


def _now_iso() -> str:
    return datetime.utcnow().isoformat()


# In-memory store for development/demo. This is populated with a realistic
# starter client so the frontend has data immediately after boot.
CLIENTS: List[Client] = [
    Client(
        id="client_1759251660898",
        email="simmonds80@gmail.com",
        first_name="Alex",
        last_name="Simmonds",
        phone="+1 (555) 010-7788",
        role="client",
        account_id="acc_123456789",
        created_at=_now_iso(),
    )
]


@router.get("")
def list_clients():
    return {"clients": [client.model_dump() for client in CLIENTS]}


@router.post("")
def create_client(payload: ClientCreate):
    new_client = Client(
        id=f"client_{int(datetime.utcnow().timestamp() * 1000)}",
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone=payload.phone,
        role="client",
        account_id=f"acc_{datetime.utcnow().strftime('%H%M%S')}",
        created_at=_now_iso(),
    )
    CLIENTS.append(new_client)
    return new_client.model_dump()


@router.get("/{client_id}")
def get_client(client_id: str):
    client = next((c for c in CLIENTS if c.id == client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client.model_dump()
