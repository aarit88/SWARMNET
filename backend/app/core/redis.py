"""
SWARMNET Backend — Redis Configuration
==========================================
Async Redis connection pooling and pub/sub utilities.
"""

from redis.asyncio import Redis, from_url
from typing import AsyncGenerator
from app.core.config import get_settings

settings = get_settings()

class RedisDependency:
    def __init__(self):
        self.redis_client = None

    async def init_redis(self):
        """Initialize the connection pool."""
        self.redis_client = await from_url(
            settings.redis_url, 
            encoding="utf-8", 
            decode_responses=True
        )

    async def close(self):
        """Close the Redis connection pool."""
        if self.redis_client:
            await self.redis_client.aclose()

redis_dependency = RedisDependency()

async def get_redis() -> AsyncGenerator[Redis, None]:
    """Dependency to inject Redis clients into routes."""
    if redis_dependency.redis_client is None:
        await redis_dependency.init_redis()
    yield redis_dependency.redis_client
