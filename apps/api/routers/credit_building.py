from fastapi import APIRouter
router = APIRouter()
@router.post("/simulate")
def simulate():
    return {"utilization_delta": -12}
