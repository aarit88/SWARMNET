"""
SWARMNET Backend — WebSocket Routes
======================================
Real-time communication endpoints for the dashboard.
Handles bidirectional streaming of:
  - Incident updates
  - Agent status changes
  - Emergency alerts
  - Map marker updates
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime, timezone
import json

router = APIRouter()


class ConnectionManager:
    """
    Manages active WebSocket connections.
    Supports broadcasting messages to all connected clients
    and targeted messaging to specific clients.

    TODO: Scale with Redis Pub/Sub for multi-instance deployments
    """

    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"📡 Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove a disconnected WebSocket client."""
        self.active_connections.remove(websocket)
        print(f"📡 Client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """Send a message to all connected clients."""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass  # Handle stale connections gracefully

    async def send_personal(self, websocket: WebSocket, message: dict):
        """Send a message to a specific client."""
        await websocket.send_json(message)


# Singleton connection manager
manager = ConnectionManager()


@router.websocket("/ws/dashboard")
async def dashboard_websocket(websocket: WebSocket):
    """
    Main dashboard WebSocket endpoint.
    Streams real-time updates to the frontend dashboard including:
      - Incident events
      - Agent status updates
      - Resource allocation changes
      - Emergency alerts

    TODO: Integrate with actual agent event streams
    TODO: Add authentication/authorization
    TODO: Add message type routing
    """
    await manager.connect(websocket)

    # Send initial connection confirmation
    await manager.send_personal(websocket, {
        "type": "connection",
        "status": "connected",
        "message": "Connected to SWARMNET Dashboard",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    try:
        while True:
            # Listen for messages from the client
            data = await websocket.receive_text()
            message = json.loads(data)

            # Echo back with server timestamp (placeholder behavior)
            response = {
                "type": "echo",
                "received": message,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            await manager.send_personal(websocket, response)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({
            "type": "system",
            "message": "A client has disconnected",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
