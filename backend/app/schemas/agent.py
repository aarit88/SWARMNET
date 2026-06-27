from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class AgentBase(BaseModel):
    status: str = "IDLE"
    battery: float = 1.0
    latitude: float
    longitude: float
    current_incident_id: Optional[UUID] = None

class AgentCreate(AgentBase):
    pass

class AgentUpdate(BaseModel):
    status: Optional[str] = None
    battery: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    current_incident_id: Optional[UUID] = None

class AgentResponse(AgentBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
