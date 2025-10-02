from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from .base import Base
import uuid

class Tradeline(Base):
    __tablename__ = "tradelines"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    bureau = Column(String)
    creditor = Column(String)
    acct_hash = Column(String)
    opened_on = Column(Date)
    status = Column(String)
    balance_cents = Column(Integer)
    last_reported_on = Column(Date)
