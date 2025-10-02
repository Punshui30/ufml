from fastapi import APIRouter
router = APIRouter()
@router.post("/cfpb/prepare")
def cfpb_prepare():
    return {"packet_url": "stub"}
