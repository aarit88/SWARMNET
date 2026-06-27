import uuid
from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base

class SeverityEnum(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(100), nullable=False)
    severity = Column(Enum(SeverityEnum), nullable=False, default=SeverityEnum.MEDIUM)
    
    # Store coordinates directly as floats for simplicity unless PostGIS is fully integrated
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    label = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    agents = relationship("Agent", back_populates="incident")
