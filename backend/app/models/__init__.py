"""
SWARMNET Backend — Models Package
===================================
Database models (SQLAlchemy ORM) and Pydantic schemas.
Each domain gets its own model file:

  - incident.py   — Incident records and classifications
  - resource.py   — Emergency resources (vehicles, personnel)
  - agent.py      — Agent state and task tracking
  - alert.py      — Public alert templates and history

Naming Convention:
  - SQLAlchemy models: PascalCase (e.g., Incident, Resource)
  - Pydantic schemas: PascalCase + suffix (e.g., IncidentCreate, IncidentResponse)
"""

from app.core.database import Base

from app.models.user import User
from app.models.incident import Incident
from app.models.agent import Agent
from app.models.telemetry import Telemetry
