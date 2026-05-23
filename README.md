<p align="center">
  <h1 align="center">🌐 SWARMNET</h1>
  <p align="center">
    <strong>AI Multi-Agent Emergency Response Platform</strong>
  </p>
  <p align="center">
    Real-time swarm coordination system for emergency and disaster response
  </p>
</p>

---

## 🚀 Overview

**SWARMNET** is a real-time AI swarm coordination system designed for emergency and disaster response. Multiple AI agents collaborate autonomously to:

- 🔍 **Detect Incidents** — Automatically identify and classify emergencies
- 🚑 **Allocate Resources** — Intelligently dispatch emergency services
- 🚗 **Reroute Traffic** — Dynamic traffic management around incident zones
- 🏥 **Coordinate Hospitals** — Real-time hospital capacity management
- 📢 **Generate Public Alerts** — Automated multi-channel alert broadcasting

All orchestrated through a **live command dashboard** with real-time visualization.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SWARMNET PLATFORM                     │
├─────────────┬─────────────┬─────────────┬───────────────┤
│  Frontend   │   Backend   │   Agents    │  Data Layer   │
│  (Next.js)  │  (FastAPI)  │  (Python)   │  (PG/Redis)   │
├─────────────┼─────────────┼─────────────┼───────────────┤
│ Dashboard   │ REST API    │ Incident    │ PostgreSQL    │
│ Live Map    │ WebSocket   │ Traffic     │ Redis Cache   │
│ Agent View  │ Services    │ Hospital    │ Event Stream  │
│ Metrics     │ Models      │ Alert       │               │
│             │             │ Orchestrator│               │
└─────────────┴─────────────┴─────────────┴───────────────┘
```

---

## 📁 Project Structure

```
swarmnet/
│
├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS
├── backend/           # FastAPI Python backend
├── agents/            # AI agent modules (placeholder)
├── docs/              # Architecture & API documentation
├── data/              # Sample data and seed scripts
├── docker/            # Docker configuration files
├── scripts/           # Utility and setup scripts
├── .github/           # GitHub workflows and templates
│
├── README.md          # This file
├── .gitignore         # Git ignore rules
└── docker-compose.yml # Multi-service Docker orchestration
```

---

## 🛠 Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Frontend       | Next.js 15, TypeScript, Tailwind CSS |
| Backend        | FastAPI (Python 3.11+)          |
| Database       | PostgreSQL 16                   |
| Cache/Realtime | Redis 7                         |
| Maps           | Leaflet + OpenStreetMap         |
| AI Agents      | Python (modular, extensible)    |
| Containerization | Docker + Docker Compose       |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.11
- **Docker** & **Docker Compose**
- **PostgreSQL** 16+ (or use Docker)
- **Redis** 7+ (or use Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/swarmnet.git
cd swarmnet
```

### 2. Start with Docker (Recommended)

```bash
docker-compose up --build
```

This starts all services:
- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:8000
- **API Docs** → http://localhost:8000/docs
- **PostgreSQL** → localhost:5432
- **Redis** → localhost:6379

### 3. Manual Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm test
```

### Environment Variables

Copy the example environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

---

## 📖 Documentation

- [Architecture Overview](docs/architecture.md)
- [API Specification](docs/api-spec.md)
- [Development Roadmap](docs/roadmap.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with 🧠 AI-first architecture for next-generation emergency response</strong>
</p>
