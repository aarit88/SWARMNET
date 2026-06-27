from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.core.database import get_db
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentResponse, IncidentUpdate
from app.services.ai_service import analyzer
from pydantic import BaseModel

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("/", response_model=list[IncidentResponse])
async def list_incidents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Incident))
    return result.scalars().all()

@router.post("/", response_model=IncidentResponse)
async def create_incident(incident_in: IncidentCreate, db: AsyncSession = Depends(get_db)):
    new_incident = Incident(
        type=incident_in.type,
        severity=incident_in.severity,
        latitude=incident_in.latitude,
        longitude=incident_in.longitude,
        label=incident_in.label
    )
    db.add(new_incident)
    await db.commit()
    await db.refresh(new_incident)
    return new_incident

@router.patch("/{incident_id}", response_model=IncidentResponse)
async def update_incident(incident_id: UUID, incident_update: IncidentUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    update_data = incident_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "resolved" and value is True:
            from sqlalchemy.sql import func
            incident.resolved_at = func.now()
        elif key != "resolved":
            setattr(incident, key, value)

    await db.commit()
    await db.refresh(incident)
    return incident

class AnalyzeRequest(BaseModel):
    raw_text: str
    latitude: float
    longitude: float

@router.post("/analyze", response_model=IncidentResponse)
async def analyze_and_create_incident(req: AnalyzeRequest, db: AsyncSession = Depends(get_db)):
    """
    Submit raw, unstructured text (e.g. from 911 dispatch).
    The AI Pipeline will extract severity and type to automatically generate the incident.
    """
    analysis = await analyzer.analyze_incident(req.raw_text)
    
    new_incident = Incident(
        type=analysis["type"],
        severity=analysis["severity"],
        latitude=req.latitude,
        longitude=req.longitude,
        label=req.raw_text[:50] + "..." # Use first 50 chars as label
    )
    
    db.add(new_incident)
    await db.commit()
    await db.refresh(new_incident)
    
    # Broadcast new incident via WebSockets could happen here
    from app.websocket.manager import manager
    await manager.broadcast({
        "type": "new_incident",
        "data": {
            "id": str(new_incident.id),
            "severity": new_incident.severity,
            "type": new_incident.type,
            "latitude": new_incident.latitude,
            "longitude": new_incident.longitude
        }
    })
    
    return new_incident
