import asyncio

from app.core.config import get_settings
from app.core.database import engine, Base

from app.models.user import User
from app.models.incident import Incident
from app.models.agent import Agent
from app.models.telemetry import Telemetry

settings = get_settings()

print("SETTINGS DATABASE =", settings.database_url)

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Tables created successfully")

asyncio.run(main())