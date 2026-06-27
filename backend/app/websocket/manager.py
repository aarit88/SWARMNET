import asyncio
import json
from fastapi import WebSocket
from typing import List
from app.core.redis import redis_dependency

class RedisPubSubManager:
    """
    Manages WebSocket connections and Redis Pub/Sub broadcasting.
    Allows horizontal scaling across multiple backend instances.
    """
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.pubsub = None
        self._listener_task = None

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        # Start listening to Redis if not already listening
        if self._listener_task is None:
            self._listener_task = asyncio.create_task(self._listen_to_redis())

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Publish a message to Redis or directly locally if Redis is not available."""
        redis = redis_dependency.redis_client
        if redis:
            await redis.publish("swarmnet_telemetry", json.dumps(message))
        else:
            message_str = json.dumps(message)
            tasks = [self._send_safe(conn, message_str) for conn in self.active_connections]
            if tasks:
                await asyncio.gather(*tasks)

    async def send_personal(self, websocket: WebSocket, message: dict):
        """Send a direct message to a specific connection."""
        await websocket.send_json(message)

    async def _listen_to_redis(self):
        """Listen to the Redis channel and broadcast to local WebSockets."""
        redis = redis_dependency.redis_client
        if not redis:
            return
            
        self.pubsub = redis.pubsub()
        await self.pubsub.subscribe("swarmnet_telemetry")
        
        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    data = message["data"]
                    # Broadcast to all local connections concurrently
                    tasks = [self._send_safe(conn, data) for conn in self.active_connections]
                    if tasks:
                        await asyncio.gather(*tasks)
        except Exception as e:
            print(f"Redis listener error: {e}")
        finally:
            self._listener_task = None

    async def _send_safe(self, websocket: WebSocket, message_str: str):
        try:
            await websocket.send_text(message_str)
        except Exception:
            pass

manager = RedisPubSubManager()
