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

### 1. Start Python FastAPI Backend
```bash
cd "c:\COMPLEX PROJECTS\Team-SentriX"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 2. Start React Vite Frontend
```bash
cd "c:\COMPLEX PROJECTS\Team-SentriX\frontend"
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.
