import asyncio
import os
import time
from pathlib import Path
from typing import Optional, List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

from backend.data_store import DataStore
from backend.simulation import FleetSimulator
from ai.detector import ProductionAIDetector
from ai import rfdetr_service

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(
    title="TransitEye Backend API & Neural Vision Engine",
    description="AI-Powered Mobile Urban Intelligence Platform API with Embedded RF-DETR Neural Vision (SIH 2026 Problem 26124)",
    version="2.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data_store = DataStore()
simulator = FleetSimulator(data_store)
ai_detector = ProductionAIDetector()

@app.on_event("startup")
def startup_event():
    simulator.start()

@app.on_event("shutdown")
def shutdown_event():
    simulator.stop()

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# Request Models
class DemoTriggerRequest(BaseModel):
    scenario: str
    busId: Optional[str] = "BUS-104"
    cameraAngle: Optional[str] = "front"

class EventCreateRequest(BaseModel):
    type: str
    confidence: float
    busId: str
    latitude: float
    longitude: float
    locationName: Optional[str] = "Pune Transit Corridor"
    severity: str
    details: Optional[str] = None
    vehicleType: Optional[str] = None
    registrationNumber: Optional[str] = None
    anprConfidence: Optional[float] = None
    evidenceImage: Optional[str] = None

class IncidentStatusUpdateRequest(BaseModel):
    status: str

# -------------------------------------------------------------
# Core Fleet & Telemetry Endpoints
# -------------------------------------------------------------
@app.get("/")
def read_root():
    return {
        "platform": "TransitEye",
        "subtitle": "AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet",
        "sihProblemId": "26124",
        "status": "ONLINE",
        "version": "2.0.0",
        "puneFleetSize": len(data_store.buses),
        "hardwareAcceleration": rfdetr_service.get_device().upper(),
        "modelsAvailable": list(rfdetr_service.MODEL_PATHS.keys()) + ["coco"]
    }

@app.get("/api/buses")
def get_buses():
    return data_store.buses

@app.get("/api/events")
def get_events():
    return data_store.events

@app.post("/api/events")
async def create_event(req: EventCreateRequest):
    evt = data_store.add_event(req.dict())
    await manager.broadcast({"type": "EVENT_CREATED", "data": evt})
    return evt

@app.get("/api/road-issues")
def get_road_issues():
    return data_store.road_issues

@app.get("/api/incidents")
def get_incidents():
    return data_store.incidents

@app.patch("/api/incidents/{incident_id}")
async def update_incident(incident_id: str, req: IncidentStatusUpdateRequest):
    updated = data_store.update_incident_status(incident_id, req.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Incident not found")
    await manager.broadcast({"type": "INCIDENT_UPDATED", "data": updated})
    return updated

@app.get("/api/analytics")
def get_analytics():
    return data_store.analytics

@app.get("/api/edge-stats")
def get_edge_stats():
    return ai_detector.get_bandwidth_savings()

@app.post("/api/demo/trigger")
async def trigger_demo_scenario(req: DemoTriggerRequest):
    bus = next((b for b in data_store.buses if b["id"] == req.busId), data_store.buses[3])
    gps = {"lat": bus["latitude"], "lng": bus["longitude"], "location": f"Route: {bus['route']}"}
    
    result = ai_detector.run_inference(req.scenario, bus["id"], gps, req.cameraAngle or "front")
    bus["lastEvent"] = req.scenario.replace("_", " ").title()
    bus["trafficDensity"] = result.get("traffic_density", bus["trafficDensity"])
    
    if result.get("event"):
        created_event = data_store.add_event(result["event"])
        await manager.broadcast({"type": "DEMO_EVENT_TRIGGERED", "data": created_event, "scenarioResult": result})
        
    return {
        "status": "SUCCESS",
        "scenario": req.scenario,
        "busId": bus["id"],
        "scenarioResult": result
    }

# -------------------------------------------------------------
# Real RF-DETR Model Inspection & Testing APIs
# -------------------------------------------------------------
@app.get("/api/status")
def get_system_status():
    """Hardware acceleration status, model weights readiness, and live telemetry."""
    return rfdetr_service.get_system_status()

@app.get("/api/samples")
def get_sample_files():
    """Returns sample test images and videos from local dataset."""
    return rfdetr_service.get_samples()

@app.post("/api/detect/image")
async def detect_image(
    file: Optional[UploadFile] = File(None),
    sample_path: Optional[str] = Form(None),
    model_name: str = Form("pothole"),
    threshold: float = Form(0.45),
):
    """Run real RF-DETR object detection on an image (uploaded file or test sample)."""
    image_bytes = None
    image_path = None

    if file is not None and file.filename:
        image_bytes = await file.read()
    elif sample_path:
        target_path = BASE_DIR / sample_path
        if not target_path.exists():
            raise HTTPException(status_code=404, detail=f"Sample not found: {sample_path}")
        image_path = target_path
    else:
        raise HTTPException(status_code=400, detail="Provide an image file upload or sample_path.")

    try:
        result = rfdetr_service.detect_image(
            image_bytes=image_bytes,
            image_path=image_path,
            model_name=model_name,
            threshold=threshold,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/api/detect/video")
async def detect_video(
    file: Optional[UploadFile] = File(None),
    sample_path: Optional[str] = Form(None),
    model_name: str = Form("pothole"),
    threshold: float = Form(0.45),
    frame_skip: int = Form(2),
    max_seconds: int = Form(12),
):
    """Process a video through RF-DETR neural vision and return HTML5 playback URL."""
    video_input_path = None
    cleanup = False

    if file is not None and file.filename:
        temp_dir = BASE_DIR / "outputs" / "_temp"
        temp_dir.mkdir(parents=True, exist_ok=True)
        video_input_path = temp_dir / f"upload_{int(time.time())}_{file.filename}"
        with open(video_input_path, "wb") as f:
            f.write(await file.read())
        cleanup = True
    elif sample_path:
        target_path = BASE_DIR / sample_path
        if not target_path.exists():
            raise HTTPException(status_code=404, detail=f"Sample video not found: {sample_path}")
        video_input_path = target_path
    else:
        raise HTTPException(status_code=400, detail="Provide video file upload or sample_path.")

    try:
        result = rfdetr_service.detect_video(
            video_input_path=video_input_path,
            model_name=model_name,
            threshold=threshold,
            frame_skip=frame_skip,
            max_seconds=max_seconds,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video inference error: {str(e)}")
    finally:
        if cleanup and video_input_path and video_input_path.exists():
            try:
                video_input_path.unlink()
            except Exception:
                pass

# -------------------------------------------------------------
# LIVE ML FEED STREAMING (Continuous MJPEG Stream)
# -------------------------------------------------------------
@app.get("/api/stream/live")
@app.get("/api/stream/live/{model_name}")
def stream_live_ml_feed(
    model_name: str = "all",
    threshold: float = 0.35,
):
    """
    Live Unified ML Video Feed streaming endpoint.
    All models (Pothole, Incident, Waterlogging, ANPR, COCO) work together in real-time
    on every frame across all available transit videos.
    """
    try:
        feed_generator = rfdetr_service.stream_unified_live_feed(video_channel=model_name, threshold=threshold)
        return StreamingResponse(
            feed_generator,
            media_type="multipart/x-mixed-replace; boundary=frame"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live stream error: {str(e)}")

# -------------------------------------------------------------
# Static Mounts
# -------------------------------------------------------------
if (BASE_DIR / "outputs").exists():
    app.mount("/outputs", StaticFiles(directory=str(BASE_DIR / "outputs")), name="outputs")
if (BASE_DIR / "test_videos").exists():
    app.mount("/samples/test_videos", StaticFiles(directory=str(BASE_DIR / "test_videos")), name="samples_videos")
    app.mount("/test_videos", StaticFiles(directory=str(BASE_DIR / "test_videos")), name="test_videos")
if (BASE_DIR / "test_custom").exists():
    app.mount("/samples/test_custom", StaticFiles(directory=str(BASE_DIR / "test_custom")), name="samples_custom")
    app.mount("/test_custom", StaticFiles(directory=str(BASE_DIR / "test_custom")), name="test_custom")
if (BASE_DIR / "test_images").exists():
    app.mount("/samples/test_images", StaticFiles(directory=str(BASE_DIR / "test_images")), name="samples_images")
    app.mount("/test_images", StaticFiles(directory=str(BASE_DIR / "test_images")), name="test_images")

# WebSocket Endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="127.0.0.1", port=port, reload=True)
