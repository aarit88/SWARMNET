"""
SWARMNET Backend — Main Application Entry Point
=================================================
FastAPI application factory with middleware, CORS, and router registration.
This is the single entry point for the entire backend.

Run with:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.redis import redis_dependency
from app.routes import health, websocket_routes, auth, incidents, agents
from app.services.telemetry_simulator import telemetry_loop
import asyncio

# ─── Load Settings ───
settings = get_settings()

# ─── Create FastAPI Application ───
app = FastAPI(
    title=settings.app_name,
    description="AI Multi-Agent Emergency Response Platform — Real-time swarm coordination for disaster response.",
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ─── CORS Middleware ───
# Allows the Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Startup & Shutdown Events ───
@app.on_event("startup")
async def on_startup():

    print(f"🚀 {settings.app_name} v{settings.app_version} starting up...")
    print(f"📍 Environment: {settings.environment}")
    print("📖 API Docs: http://localhost:8000/docs")

    try:
        await redis_dependency.init_redis()
        print("✅ Redis Connected")
    except Exception as e:
        print("⚠ Redis Not Available:", e)

    asyncio.create_task(telemetry_loop())
    print("✅ Telemetry Simulator Started")


@app.on_event("shutdown")
async def on_shutdown():
    """
    Clean up connections and services on application shutdown.
    TODO: Close database connection pool
    await redis_dependency.close()
    TODO: Gracefully stop agents
    """
    print(f"🛑 {settings.app_name} shutting down...")


# ─── Register Routers ───
# Health check endpoints
app.include_router(health.router, tags=["Health"])

# REST API routes
app.include_router(auth.router)
app.include_router(incidents.router)
app.include_router(agents.router)

# WebSocket endpoints for real-time communication
app.include_router(websocket_routes.router, tags=["WebSocket"])


# ─── Root Endpoint ───
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint — returns platform information."""
    return {
        "platform": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "description": "AI Multi-Agent Emergency Response Platform",
        "docs": "/docs",
    }
