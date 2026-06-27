import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(String(50), nullable=False, default="IDLE") # IDLE, EN_ROUTE, ACTIVE
    battery = Column(Float, nullable=False, default=1.0)
    
    # Store coordinates directly as floats for simplicity unless PostGIS is fully integrated
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    current_incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    incident = relationship("Incident", back_populates="agents")
    telemetry = relationship("Telemetry", back_populates="agent")
