import asyncio
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional, List
# pyrefly: ignore [missing-import]
import uvicorn

from backend.data_store import DataStore
from backend.simulation import FleetSimulator
from ai.detector import ProductionAIDetector

app = FastAPI(
    title="TransitEye Backend API",
    description="AI-Powered Mobile Urban Intelligence Platform API (SIH 2026 Problem 26124)",
    version="1.0.0"
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
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# Request Models
class DemoTriggerRequest(BaseModel):
    scenario: str # "normal", "congestion", "pothole", "pedestrian", "rash_driving", "zebra_crossing", "signboard_defect", "missing_divider", "waterlogging", "cabin_crowd"
    busId: Optional[str] = "BUS-104"
    cameraAngle: Optional[str] = "front" # "front", "side_left", "side_right", "rear", "cabin"

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

class IncidentStatusUpdateRequest(BaseModel):
    status: str # "NEW", "UNDER REVIEW", "DISPATCHED", "RESOLVED"

# Endpoints
@app.get("/")
def read_root():
    return {
        "platform": "TransitEye",
        "subtitle": "AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet",
        "sihProblemId": "26124",
        "status": "ONLINE",
        "version": "1.0.0",
        "puneFleetSize": len(data_store.buses)
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
    # Find requested bus or default to BUS-104
    bus = next((b for b in data_store.buses if b["id"] == req.busId), data_store.buses[3])
    gps = {"lat": bus["latitude"], "lng": bus["longitude"], "location": f"Route: {bus['route']}"}
    
    # Process scenario through Edge AI engine
    result = ai_detector.run_inference(req.scenario, bus["id"], gps, req.cameraAngle or "front")
    
    # Update bus state based on scenario
    bus["lastEvent"] = req.scenario.replace("_", " ").title()
    bus["trafficDensity"] = result.get("traffic_density", bus["trafficDensity"])
    
    # If an event was generated, add to data store and broadcast
    if result.get("event"):
        created_event = data_store.add_event(result["event"])
        await manager.broadcast({"type": "DEMO_EVENT_TRIGGERED", "data": created_event, "scenarioResult": result})
        
    return {
        "status": "SUCCESS",
        "scenario": req.scenario,
        "busId": bus["id"],
        "scenarioResult": result
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keepalive / ping listening
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
