# SWARMNET — API Specification

## Base URL

```
Development: http://localhost:8000
Production:  https://api.swarmnet.io  (future)
```

---

## Authentication (Future)

All endpoints (except health checks) will require JWT authentication:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Root

#### `GET /`

Returns platform information.

**Response:**
```json
{
  "platform": "SWARMNET",
  "version": "0.1.0",
  "status": "operational",
  "description": "AI Multi-Agent Emergency Response Platform",
  "docs": "/docs"
}
```

---

### Health Checks

#### `GET /api/health`

Full health check with dependency status.

**Response:**
```json
{
  "status": "healthy",
  "service": "swarmnet-backend",
  "timestamp": "2025-01-01T00:00:00Z",
  "checks": {
    "api": "operational",
    "database": "connected",
    "redis": "connected",
    "agents": "operational"
  }
}
```

#### `GET /api/health/ready`

Readiness probe for container orchestration.

#### `GET /api/health/live`

Liveness probe for container orchestration.

---

### Incidents (Planned)

#### `GET /api/incidents`

List all incidents with pagination and filtering.

**Query Parameters:**
| Parameter  | Type   | Description                          |
| ---------- | ------ | ------------------------------------ |
| `page`     | int    | Page number (default: 1)             |
| `limit`    | int    | Items per page (default: 20)         |
| `severity` | string | Filter by severity (low/medium/high/critical) |
| `status`   | string | Filter by status (active/resolved)   |

#### `GET /api/incidents/{id}`

Get a single incident by ID.

#### `POST /api/incidents`

Create a new incident (manual report).

**Request Body:**
```json
{
  "title": "Highway pileup on I-95",
  "description": "Multi-vehicle accident with potential injuries",
  "severity": "high",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "type": "traffic_accident"
}
```

---

### Agents (Planned)

#### `GET /api/agents`

List all agents and their status.

**Response:**
```json
{
  "total_agents": 4,
  "agents": [
    {
      "agent_id": "incident-agent",
      "agent_name": "Incident Detection Agent",
      "is_running": true,
      "tasks_completed": 42
    }
  ]
}
```

#### `POST /api/agents/{agent_id}/start`

Start a specific agent.

#### `POST /api/agents/{agent_id}/stop`

Stop a specific agent.

---

### Resources (Planned)

#### `GET /api/resources`

List available emergency resources (vehicles, personnel).

#### `POST /api/resources/allocate`

Allocate resources to an incident.

---

### Alerts (Planned)

#### `GET /api/alerts`

List all active and past alerts.

#### `POST /api/alerts`

Create and distribute a public alert.

---

## WebSocket Endpoints

### `WS /ws/dashboard`

Real-time dashboard event stream.

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/dashboard');
```

**Message Types:**

| Type          | Direction     | Description                     |
| ------------- | ------------- | ------------------------------- |
| `connection`  | Server → Client | Connection confirmation        |
| `incident`    | Server → Client | New or updated incident        |
| `agent_status`| Server → Client | Agent status change            |
| `alert`       | Server → Client | New emergency alert            |
| `metrics`     | Server → Client | Updated metrics snapshot        |
| `command`     | Client → Server | Dashboard command to backend   |

**Example Message (Incident):**
```json
{
  "type": "incident",
  "data": {
    "id": "inc-001",
    "title": "Structure fire on Main St",
    "severity": "critical",
    "location": { "lat": 40.7128, "lng": -74.0060 },
    "status": "active",
    "assigned_agents": ["incident-agent", "alert-agent"]
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Incident with ID 'inc-999' not found",
    "details": null
  }
}
```

**Standard HTTP Status Codes:**

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 422  | Validation Error      |
| 500  | Internal Server Error |
| 503  | Service Unavailable   |

---

## Rate Limiting (Future)

| Tier       | Limit             |
| ---------- | ----------------- |
| Anonymous  | 60 requests/min   |
| Authenticated | 300 requests/min |
| Admin      | Unlimited         |
