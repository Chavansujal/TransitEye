#!/usr/bin/env bash
# TransitEye Launch Script for macOS & Linux

echo "============================================================"
echo " Starting TransitEye — Mobile Urban Intelligence Platform"
echo " SIH 2026 Problem Statement 26124"
echo "============================================================"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start Python FastAPI Backend in background
echo ""
echo "[1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ..."
cd "$ROOT_DIR"
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

cleanup() {
    echo ""
    echo "Stopping TransitEye processes..."
    kill "$BACKEND_PID" 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start Vite React Frontend
echo "[2/2] Starting React Vite Frontend on http://localhost:5173 ..."
cd "$ROOT_DIR/frontend"
npm run dev
