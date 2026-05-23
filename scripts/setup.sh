#!/bin/bash
# ============================================
# SWARMNET — Development Setup Script
# ============================================
# Sets up the development environment for both
# frontend and backend services.
#
# Usage:
#   chmod +x scripts/setup.sh
#   ./scripts/setup.sh
# ============================================

set -e

echo "🌐 SWARMNET — Development Setup"
echo "================================"

# ─── Backend Setup ───
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "  Creating Python virtual environment..."
    python -m venv venv
fi

echo "  Activating virtual environment..."
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

echo "  Installing Python dependencies..."
pip install -r requirements.txt --quiet

if [ ! -f ".env" ]; then
    echo "  Creating .env from .env.example..."
    cp .env.example .env
fi

cd ..

# ─── Frontend Setup ───
echo ""
echo "📦 Setting up Frontend..."
cd frontend

echo "  Installing Node.js dependencies..."
npm install --silent

if [ ! -f ".env.local" ]; then
    echo "  Creating .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    echo "NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws" >> .env.local
fi

cd ..

# ─── Done ───
echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  Frontend:  cd frontend && npm run dev"
echo "  Backend:   cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "  Docker:    docker-compose up --build"
