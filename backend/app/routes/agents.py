from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.core.database import get_db
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentResponse, AgentUpdate

router = APIRouter(prefix="/agents", tags=["Agents"])

@router.get("/", response_model=list[AgentResponse])
async def list_agents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent))
    return result.scalars().all()

@router.post("/", response_model=AgentResponse)
async def create_agent(agent_in: AgentCreate, db: AsyncSession = Depends(get_db)):
    new_agent = Agent(
        status=agent_in.status,
        battery=agent_in.battery,
        latitude=agent_in.latitude,
        longitude=agent_in.longitude,
        current_incident_id=agent_in.current_incident_id
    )
    db.add(new_agent)
    await db.commit()
    await db.refresh(new_agent)
    return new_agent

@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: UUID, agent_update: AgentUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    update_data = agent_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(agent, key, value)

    await db.commit()
    await db.refresh(agent)
    return agent
