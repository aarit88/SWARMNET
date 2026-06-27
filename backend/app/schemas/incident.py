from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from app.models.incident import SeverityEnum

class IncidentBase(BaseModel):
    type: str
    severity: SeverityEnum = SeverityEnum.MEDIUM
    latitude: float
    longitude: float
    label: Optional[str] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    severity: Optional[SeverityEnum] = None
    label: Optional[str] = None
    resolved: Optional[bool] = False

class IncidentResponse(IncidentBase):
    id: UUID
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
