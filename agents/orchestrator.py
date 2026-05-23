"""
SWARMNET — Agent Orchestrator
================================
The central coordinator for all SWARMNET agents.

Responsible for:
  - Managing the lifecycle of all agents
  - Routing tasks to the appropriate agent(s)
  - Coordinating multi-agent workflows
  - Managing agent communication and data flow
  - Handling agent failures and recovery
  - Prioritizing concurrent incidents

Architecture:
  The orchestrator follows a hub-and-spoke pattern:
    - Orchestrator (hub) receives all incident events
    - Routes tasks to specialized agents (spokes)
    - Collects results and coordinates responses
    - Reports status to the dashboard via WebSocket

Usage:
    orchestrator = Orchestrator()
    await orchestrator.start_all()
    await orchestrator.handle_incident(incident_data)
"""

from .base_agent import BaseAgent
from .incident_agent import IncidentAgent
from .traffic_agent import TrafficAgent
from .hospital_agent import HospitalAgent
from .alert_agent import AlertAgent


class Orchestrator:
    """
    Central orchestrator that coordinates all SWARMNET agents.
    Manages the swarm — starts, stops, and routes tasks to agents.
    """

    def __init__(self):
        # Initialize all agents
        self.agents: dict[str, BaseAgent] = {
            "incident": IncidentAgent(),
            "traffic": TrafficAgent(),
            "hospital": HospitalAgent(),
            "alert": AlertAgent(),
        }
        self.is_running = False

    async def start_all(self):
        """Start all agents in the swarm."""
        print("🧠 SWARMNET Orchestrator — Starting all agents...")
        for name, agent in self.agents.items():
            await agent.start()
            print(f"  ✅ {agent.agent_name} started")
        self.is_running = True
        print("🟢 All agents operational. SWARMNET is online.")

    async def stop_all(self):
        """Gracefully stop all agents."""
        print("🧠 SWARMNET Orchestrator — Stopping all agents...")
        for name, agent in self.agents.items():
            await agent.stop()
            print(f"  🔴 {agent.agent_name} stopped")
        self.is_running = False
        print("⬛ SWARMNET is offline.")

    async def handle_incident(self, incident_data: dict) -> dict:
        """
        Orchestrate the full emergency response workflow:

        1. Incident Agent — Classify the incident
        2. Traffic Agent — Compute rerouting
        3. Hospital Agent — Assign hospitals
        4. Alert Agent — Send public alerts

        Args:
            incident_data: Raw incident data from detection sources

        Returns:
            Comprehensive response plan from all agents

        TODO: Add parallel execution for independent agents
        TODO: Add retry logic for agent failures
        TODO: Add priority queue for concurrent incidents
        """
        print(f"🚨 Orchestrator handling new incident...")

        results = {}

        # Step 1: Classify the incident
        results["incident"] = await self.agents["incident"].process(incident_data)

        # Step 2: Compute traffic rerouting (can run in parallel with Step 3)
        results["traffic"] = await self.agents["traffic"].process(incident_data)

        # Step 3: Coordinate hospitals
        results["hospital"] = await self.agents["hospital"].process(incident_data)

        # Step 4: Generate public alerts
        results["alert"] = await self.agents["alert"].process(incident_data)

        print(f"✅ Incident response plan generated.")
        return results

    def get_swarm_status(self) -> dict:
        """Get the status of all agents in the swarm."""
        return {
            "orchestrator_running": self.is_running,
            "agents": {
                name: agent.get_status()
                for name, agent in self.agents.items()
            },
            "total_agents": len(self.agents),
        }
