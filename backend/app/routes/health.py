"""
SWARMNET Backend — Health Check Routes
========================================
System health and readiness endpoints for monitoring
and container orchestration health probes.
"""

from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(prefix="/api")


@router.get("/health")
async def health_check():
    """
    Basic health check endpoint.
    Returns the current status of the API server.
    Used by Docker health checks and load balancers.
    """
    return {
        "status": "healthy",
        "service": "swarmnet-backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "checks": {
            "api": "operational",
            "database": "not_connected",  # TODO: Add actual DB health check
            "redis": "not_connected",      # TODO: Add actual Redis health check
            "agents": "not_initialized",   # TODO: Add agent status check
        },
    }


@router.get("/health/ready")
async def readiness_check():
    """
    Readiness probe — indicates if the service is ready to accept traffic.
    TODO: Check database connection, Redis connection, etc.
    """
    return {
        "ready": True,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/health/live")
async def liveness_check():
    """
    Liveness probe — indicates if the service is alive.
    Used by Kubernetes / Docker for restart decisions.
    """
    return {
        "alive": True,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
