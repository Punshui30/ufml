from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class Dispute(BaseModel):
    id: Optional[str] = None
    user_id: str  # Changed from client_id to match frontend
    target: str = "CRA"  # Added target field
    bureau: str
    reason_code: str  # Changed from dispute_reason to match frontend
    narrative: str = ""  # Changed from additional_details to match frontend
    # Legacy fields for compatibility
    client_id: Optional[str] = None
    dispute_reason: Optional[str] = None
    account_details: Optional[str] = None
    additional_details: Optional[str] = None

# In-memory storage for dev
DISPUTES = []

@router.get("")
def list_disputes() -> dict:
    return {"disputes": [Dispute(**dispute) for dispute in DISPUTES]}

@router.post("")
def create_dispute(dispute: Dispute):
    import uuid
    dispute.id = str(uuid.uuid4())
    DISPUTES.append(dispute.dict())
    return {"dispute_id": dispute.id, "status": "created", "dispute": dispute.dict()}

@router.get("/client/{client_id}/relief-integration")
def get_client_integration(client_id: str):
    # Mock integration data
    return {
        "client_id": client_id,
        "integrations": [],
        "status": "no_integrations"
    }