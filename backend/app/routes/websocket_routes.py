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


from app.websocket.manager import manager


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
