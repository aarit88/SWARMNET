"""
SWARMNET — Base Agent Class
==============================
Abstract base class for all SWARMNET agents.
All agents inherit from this class to ensure consistent
lifecycle management, logging, and communication patterns.
"""

from abc import ABC, abstractmethod
from datetime import datetime, timezone


class BaseAgent(ABC):
    """
    Base class for all SWARMNET AI agents.

    Provides:
      - Consistent agent identity (id, name, description)
      - Lifecycle management (start, stop, status)
      - Logging utilities
      - Standard communication interface

    All agents must implement:
      - process()   — Core logic for handling incoming data
      - on_start()  — Initialization logic
      - on_stop()   — Cleanup logic
    """

    def __init__(self, agent_id: str, agent_name: str, description: str = ""):
        self.agent_id = agent_id
        self.agent_name = agent_name
        self.description = description
        self.is_running = False
        self.started_at = None
        self.tasks_completed = 0

    async def start(self):
        """Start the agent and initialize resources."""
        self.is_running = True
        self.started_at = datetime.now(timezone.utc)
        self.log(f"Agent '{self.agent_name}' started.")
        await self.on_start()

    async def stop(self):
        """Stop the agent and clean up resources."""
        self.is_running = False
        self.log(f"Agent '{self.agent_name}' stopped.")
        await self.on_stop()

    def get_status(self) -> dict:
        """Return the current status of the agent."""
        return {
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "is_running": self.is_running,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "tasks_completed": self.tasks_completed,
        }

    def log(self, message: str):
        """Simple logging utility for agents."""
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{self.agent_id}] {message}")

    @abstractmethod
    async def process(self, data: dict) -> dict:
        """
        Core processing logic. Each agent implements this
        to handle its specific domain tasks.
        """
        pass

    @abstractmethod
    async def on_start(self):
        """Called when the agent starts. Initialize resources here."""
        pass

    @abstractmethod
    async def on_stop(self):
        """Called when the agent stops. Clean up resources here."""
        pass
