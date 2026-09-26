# TransitEye — Mobile Urban Intelligence Platform

> **SIH 2026 Problem Statement 26124**: AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet  
> **Tagline**: Turning public transport fleets into intelligent mobile urban sensing infrastructure.

---

## 🌟 Executive Summary

**TransitEye** transforms public transport buses into mobile edge-sensing units for smart cities. Rather than uploading continuous heavy 1080p/4K video streams over cellular networks (which wastes bandwidth and storage), each bus runs **Edge AI inference locally**:
* Detects vehicles, road potholes, pedestrian hazards, and rash drivers in real-time.
* Filters normal video at the edge (**97.4% processed locally** with zero cloud transmission).
* Transmits **only critical event metadata + compressed evidence frames** (**2.6% transmitted**).
* Aggregates multi-bus road defect reports into weighted municipal maintenance priority scores.

---

## 🛠️ System Architecture

```
[ Public Bus Camera Feed ]
          │
          ▼
   [ Edge AI Module ] ──(97.4% Video Processed Locally @ Edge)
   ├── Object Detection (Cars, Bikes, Buses, Pedestrians)
   ├── Road Hazard Classifier (Potholes, Drainage, Debris)
   └── ANPR Plate Extractor & Speed Tracker
          │
   (2.6% Data Transmitted: Compressed Metadata + Evidence Snapshot)
          │
          ▼
   [ FastAPI Backend Engine ] ──(Pune Transit Fleet Simulator & Storage)
   ├── Fleet Simulation (12 Buses on real Pune routes)
   ├── Event Broadcast Pipeline (REST API + WebSockets)
   ├── Municipal Defect Priority Scoring Algorithm
   └── Actionable Analytics Engine
          │
          ▼
   [ TransitEye Command Center Dashboard ]
   ├── Overview & City Health Score
   ├── Live AI Camera Feed + Bounding Boxes + Demo Controls
   ├── Interactive Pune GIS Spatial Map (Leaflet)
   ├── Real-time Fleet Management Table
   ├── Actionable Road Condition Priorities
   ├── ANPR Incident Triage Workflow (NEW -> DISPATCHED -> RESOLVED)
   └── Route Delay & Traffic Analytics (Recharts)
```

---

## 🚀 Quickstart Guide

### Option 1: Automated 1-Click Launch (Recommended)

Run the automated launch script from PowerShell in the root project directory:

```powershell
.\run_all.ps1
```

This script will automatically:
1. Start the **Python FastAPI Backend Server** on `http://127.0.0.1:8000`.
2. Start the **React Vite Frontend Dashboard** on `http://localhost:5173`.
3. Trigger the **RF-DETR + ANPR AI Service** to post plate `MH02AR3934` live to the dashboard!

---

### Option 2: Step-by-Step Manual Launch (3 Terminals)

#### 1. Start Python FastAPI Backend (Terminal 1)
```bash
cd "C:\COMPLEX PROJECTS\Team-SentriX"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API online at: `http://127.0.0.1:8000`*  
*Swagger Documentation at: `http://127.0.0.1:8000/docs`*

#### 2. Start React Vite Frontend Dashboard (Terminal 2)
```bash
cd "C:\COMPLEX PROJECTS\Team-SentriX\frontend"
npm run dev
```
*Access Command Center Dashboard at: `http://localhost:5173/`*

#### 3. Run RF-DETR + ANPR Edge AI Service (Terminal 3)
Run the AI Python detector code to process detections and send POST HTTP requests directly to the FastAPI backend:

```bash
cd "C:\COMPLEX PROJECTS\Team-SentriX"

# Trigger an immediate ANPR detection event for plate MH02AR3934:
python ai/ai_service.py --plate MH02AR3934 --bus BUS-104 --vehicle "White SUV"

# Run continuous edge AI sensing daemon (simulating live bus cam edge hardware):
python ai/ai_service.py --continuous --interval 5

# Run detection on an input image file and post results to FastAPI:
python ai/ai_service.py --image test_images/bus.jpeg --bus BUS-101

# Send detections to a remote edge/cloud FastAPI server:
python ai/ai_service.py --plate MH02AR3934 --backend-url http://<IP>:8000/api/events
```

---

## 🔗 AI Model -> Backend -> Frontend Integration Flow

```
AI Python Service (RF-DETR + ANPR)
               │
   [ HTTP POST /api/events ]
               │
               ▼
   FastAPI Backend (DataStore DB)
               │
   [ WebSocket Broadcast /ws ]
               │
               ▼
   React Dashboard (Live Alert + ANPR Triage)
```

1. **AI Python Service (`ai/ai_service.py`)**: Executes RF-DETR + ANPR inference. When a license plate (e.g. `MH02AR3934`) or road hazard is detected, it constructs a JSON payload and sends an HTTP `POST` request to `http://127.0.0.1:8000/api/events`.
2. **FastAPI Backend (`backend/main.py` + `backend/data_store.py`)**: Receives the POST payload at `/api/events`, saves it to `DataStore`, automatically generates an ANPR incident entry in `incidents`, and broadcasts `EVENT_CREATED` over WebSockets (`/ws`).
3. **Frontend Dashboard (`frontend/src/App.jsx`)**: Subscribed to the WebSocket stream `/ws`, receives the live detection in real time, prepends it to the Event Stream & Incident Triage tables, and displays a glowing live AI detection notification banner!
