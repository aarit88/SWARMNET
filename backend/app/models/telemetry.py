import uuid
from sqlalchemy import Column, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

class Telemetry(Base):
    __tablename__ = "telemetry_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False)
    
    cpu_load = Column(Float, nullable=False)
    latency = Column(Float, nullable=False)
    
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    agent = relationship("Agent", back_populates="telemetry")
