from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Integer, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from .base import Base
import uuid

class CreditReport(Base):
    __tablename__ = "credit_reports"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    bureau = Column(String)
    report_date = Column(Date)
    raw_pdf_url = Column(Text)
    parsed_json = Column(JSON)
    created_at = Column(DateTime)
