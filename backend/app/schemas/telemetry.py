from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class TelemetryBase(BaseModel):
    agent_id: UUID
    cpu_load: float
    latency: float

class TelemetryCreate(TelemetryBase):
    pass

class TelemetryResponse(TelemetryBase):
    id: UUID
    recorded_at: datetime

    class Config:
        from_attributes = True
