from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from .base import Base
import uuid

class Dispute(Base):
    __tablename__ = "disputes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    target = Column(String)  # CRA/FURNISHER
    bureau = Column(String)
    reason_code = Column(String)
    narrative = Column(Text)
    letter_url = Column(Text)
    tracking_no = Column(String)
    status = Column(String, default="draft")
    sent_at = Column(DateTime)
    due_at = Column(DateTime)
