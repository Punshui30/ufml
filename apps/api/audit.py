from functools import wraps
from fastapi import Request
from models.base import SessionLocal
from models.other import Event
import json, datetime

def audit(entity: str, action: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Execute
            result = await func(*args, **kwargs) if callable(getattr(func, "__await__", None)) else func(*args, **kwargs)
            # Log
            db = SessionLocal()
            e = Event(user_id=None, entity=entity, entity_id=None, action=action, meta=None)
            db.add(e); db.commit()
            db.close()
            return result
        return wrapper
    return decorator
