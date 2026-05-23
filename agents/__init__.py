"""
SWARMNET — AI Agent Layer
============================
This package contains all autonomous AI agents that form the SWARMNET swarm.

Available Agents:
  - IncidentAgent  — Detects and classifies emergencies
  - TrafficAgent   — Manages traffic rerouting
  - HospitalAgent  — Coordinates hospital resources
  - AlertAgent     — Generates public safety alerts
  - Orchestrator   — Coordinates all agents (hub)

Architecture:
  All agents extend BaseAgent and implement:
    - process()    — Core domain logic
    - on_start()   — Initialization
    - on_stop()    — Cleanup
"""

from .base_agent import BaseAgent
from .incident_agent import IncidentAgent
from .traffic_agent import TrafficAgent
from .hospital_agent import HospitalAgent
from .alert_agent import AlertAgent
from .orchestrator import Orchestrator

__all__ = [
    "BaseAgent",
    "IncidentAgent",
    "TrafficAgent",
    "HospitalAgent",
    "AlertAgent",
    "Orchestrator",
]
