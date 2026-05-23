# SWARMNET — System Architecture

## Overview

SWARMNET is a real-time AI swarm coordination platform designed for emergency and disaster response. The system uses multiple autonomous AI agents that collaborate to detect incidents, allocate resources, manage traffic, coordinate hospitals, and generate public alerts.

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 Dashboard (TypeScript)              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ Live Map │ │ Agents   │ │ Incident │ │ Metrics      │  │  │
│  │  │ (Leaflet)│ │ Panel    │ │ Feed     │ │ Dashboard    │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
│                         │ HTTP / WebSocket                        │
├─────────────────────────┼────────────────────────────────────────┤
│                    API LAYER                                      │
│  ┌──────────────────────┴─────────────────────────────────────┐  │
│  │                  FastAPI Backend (Python)                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ REST API │ │ WebSocket│ │ Services │ │ Auth / CORS  │  │  │
│  │  │ Routes   │ │ Server   │ │ Layer    │ │ Middleware   │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
│                         │                                         │
├─────────────────────────┼────────────────────────────────────────┤
│                    AGENT LAYER                                    │
│  ┌──────────────────────┴─────────────────────────────────────┐  │
│  │                    Orchestrator (Hub)                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │ Incident │ │ Traffic  │ │ Hospital │ │ Alert        │  │  │
│  │  │ Agent    │ │ Agent    │ │ Agent    │ │ Agent        │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
│                         │                                         │
├─────────────────────────┼────────────────────────────────────────┤
│                    DATA LAYER                                     │
│  ┌─────────────────┐ ┌──┴──────────────┐ ┌───────────────────┐  │
│  │   PostgreSQL    │ │     Redis       │ │  External APIs    │  │
│  │   (Primary DB)  │ │  (Cache/PubSub) │ │  (Maps, Weather)  │  │
│  └─────────────────┘ └─────────────────┘ └───────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### Frontend (Next.js 15)

| Component        | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| Live Map         | Leaflet + OSM — incident markers, resource overlays |
| Active Agents    | Real-time agent status panel                     |
| Incident Feed    | Chronological incident event stream              |
| Emergency Metrics| KPI dashboard (response times, active incidents) |

**Key technologies:** TypeScript, Tailwind CSS, Leaflet, WebSocket client

### Backend (FastAPI)

| Module     | Purpose                                    |
| ---------- | ------------------------------------------ |
| `routes/`  | API endpoint handlers (REST + WebSocket)   |
| `services/`| Business logic and data processing         |
| `models/`  | Database models (SQLAlchemy) + Pydantic schemas |
| `agents/`  | Backend agent integration layer            |
| `websocket/`| Real-time connection management           |
| `core/`    | Configuration, security, shared utilities  |

### Agent Layer

All agents inherit from `BaseAgent` and implement:
- `process(data)` — Core domain logic
- `on_start()` — Initialization
- `on_stop()` — Cleanup

The **Orchestrator** follows a hub-and-spoke pattern:
1. Receives incident events
2. Routes to specialized agents
3. Collects and merges results
4. Reports to dashboard via WebSocket

### Data Layer

- **PostgreSQL** — Persistent storage for incidents, resources, alerts, agent state
- **Redis** — Real-time caching, WebSocket scaling (Pub/Sub), rate limiting

---

## Communication Patterns

| Pattern    | Technology | Use Case                            |
| ---------- | ---------- | ----------------------------------- |
| REST API   | HTTP/JSON  | CRUD operations, status queries     |
| WebSocket  | WS/JSON    | Real-time dashboard updates         |
| Pub/Sub    | Redis      | Inter-service & multi-instance sync |
| Event Bus  | Internal   | Agent-to-orchestrator communication |

---

## Deployment

The platform is containerized with Docker Compose:

```yaml
Services:
  - frontend  → :3000
  - backend   → :8000
  - postgres  → :5432
  - redis     → :6379
```

All services communicate over a Docker bridge network (`swarmnet-network`).

---

## Security Considerations (Future)

- [ ] JWT-based authentication
- [ ] Role-based access control (RBAC)
- [ ] HTTPS/WSS in production
- [ ] Rate limiting on public endpoints
- [ ] Input validation and sanitization
- [ ] Secrets management (Vault or similar)
