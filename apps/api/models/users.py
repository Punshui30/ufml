from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from .base import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    account_id = Column(String, ForeignKey("accounts.id"), nullable=True)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)  # owner/staff/client/consumer
    pw_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
