from fastapi import APIRouter
router = APIRouter()
@router.post("/freeze")
def freeze():
    return {"ok": True}
