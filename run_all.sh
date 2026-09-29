#!/usr/bin/env bash
# TransitEye Launch Script (Backend + Frontend + Edge AI Service)

echo "============================================================"
echo " Starting TransitEye — Mobile Urban Intelligence Platform"
echo " SIH 2026 Problem Statement 26124"
echo "============================================================"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Auto-detect Python binary with RF-DETR & PyTorch support
if [ -x "/opt/miniconda3/envs/rfdetr/bin/python" ]; then
    PY_BIN="/opt/miniconda3/envs/rfdetr/bin/python"
elif [ -x "$ROOT_DIR/.venv/bin/python" ]; then
    PY_BIN="$ROOT_DIR/.venv/bin/python"
else
    PY_BIN="python3"
fi

echo "Using Python runtime: $PY_BIN"

# Backend port configuration
BACKEND_PORT="${PORT:-8000}"

# 1. Start Python FastAPI Backend in background
echo ""
echo "[1/3] Starting Python FastAPI Backend on http://127.0.0.1:$BACKEND_PORT ..."
cd "$ROOT_DIR"
"$PY_BIN" -m uvicorn backend.main:app --host 127.0.0.1 --port "$BACKEND_PORT" --reload &
BACKEND_PID=$!

sleep 3

# 2. Trigger initial AI Plate Detection Event
echo "[2/3] Triggering RF-DETR + ANPR AI Detection Service..."
"$PY_BIN" "$ROOT_DIR/ai/ai_service.py" --plate MH02AR3934 --bus BUS-104 --backend-url "http://127.0.0.1:$BACKEND_PORT/api/events"

# 3. Start Vite React Frontend
echo "[3/3] Starting React Vite Frontend on http://localhost:5173 ..."
cd "$ROOT_DIR/frontend"
npm run dev

cleanup() {
    echo ""
    echo "Stopping TransitEye processes..."
    kill "$BACKEND_PID" 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM
