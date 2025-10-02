from fastapi import APIRouter

router = APIRouter()

@router.get("")
def list_clients():
    return {
        "clients": [
            {
                "id": "client_1759251660898",
                "email": "simmonds80@gmail.com",
                "role": "client",
                "account_id": "acc_123456789",
                "created_at": "2025-01-01T00:00:00Z"
            }
        ]
    }