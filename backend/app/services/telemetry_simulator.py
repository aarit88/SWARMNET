import asyncio
import random
import uuid
from datetime import datetime, timezone

from app.websocket.manager import manager

# Keep track of active dummy agents so they can move slightly
dummy_agents = []

def init_dummy_agents(count=100):
    """Initialize a list of dummy agents around a central coordinate."""
    center_lat = 37.7749 # San Francisco
    center_lng = -122.4194
    
    for _ in range(count):
        dummy_agents.append({
            "id": str(uuid.uuid4()),
            "lat": center_lat + random.uniform(-0.05, 0.05),
            "lng": center_lng + random.uniform(-0.05, 0.05),
            "status": random.choice(["IDLE", "ACTIVE", "EN_ROUTE"]),
            "battery": random.uniform(0.2, 1.0)
        })

async def telemetry_loop():
    """Background loop to broadcast telemetry data every second."""
    if not dummy_agents:
        init_dummy_agents()
        
    while True:
        # Move agents slightly
        for agent in dummy_agents:
            agent["lat"] += random.uniform(-0.0005, 0.0005)
            agent["lng"] += random.uniform(-0.0005, 0.0005)
            agent["battery"] = max(0.0, agent["battery"] - 0.001)

        payload = {
            "type": "telemetry_update",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agents": dummy_agents
        }
        print(f"Broadcasting {len(dummy_agents)} agents...")
        await manager.broadcast(payload)
        await asyncio.sleep(1.0) # 1 update per second
