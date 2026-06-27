"""
SWARMNET Backend — Database Configuration
=============================================
Async SQLAlchemy engine and session management.
"""

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator

from app.core.config import get_settings

settings = get_settings()

# Convert synchronous postgresql:// to asynchronous postgresql+asyncpg://
# if not already configured this way in settings
database_url = settings.database_url
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
print("DATABASE_URL =", database_url)
engine = create_async_engine(
    database_url,
    echo=settings.db_echo,
    future=True
)

# Async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to inject database sessions into routes."""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
database_url = settings.database_url
print("DATABASE_URL =", database_url)