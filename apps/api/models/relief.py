from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float
from .base import Base
import uuid
from datetime import datetime

class ReliefProgram(Base):
    __tablename__ = "relief_programs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    slug = Column(String, unique=True)
    title = Column(String)
    jurisdiction = Column(String)
    eligibility = Column(Text)  # JSON stored as text for SQLite
    docs_required = Column(Text)  # JSON stored as text for SQLite
    source_url = Column(Text)
    # embedding stored in separate table or extension; keep simple here

class ReliefRecommendation(Base):
    __tablename__ = "relief_recommendations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    program_id = Column(String, ForeignKey("relief_programs.id"))
    why = Column(Text)
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="proposed")
