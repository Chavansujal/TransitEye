import React, { useState } from "react";
import { 
  Video, 
  Play, 
  Sliders, 
  Cpu, 
  AlertTriangle, 
  Car, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Camera,
  Layers,
  Sparkles
} from "lucide-react";
import { triggerDemoScenario } from "../services/api";

export default function LiveMonitoring({ buses = [], onEventTriggered }) {
  const [selectedBusId, setSelectedBusId] = useState("BUS-104");
  const [currentScenario, setCurrentScenario] = useState("normal");
  const [loadingScenario, setLoadingScenario] = useState(false);
  const [detectionState, setDetectionState] = useState({
    scenario: "normal",
    traffic_density: "MEDIUM",
    vehicle_count: 7,
    people_count: 2,
    detections: [
      { class: "car", confidence: 0.94, box: [120, 180, 240, 140], label: "Car - 94%" },
      { class: "car", confidence: 0.89, box: [400, 200, 210, 130], label: "Car - 89%" },
      { class: "bike", confidence: 0.91, box: [320, 220, 90, 110], label: "Bike - 91%" }
    ],
    edge_stats: { processed_locally_pct: 97.4, transmitted_pct: 2.6 }
  });

  const selectedBus = buses.find(b => b.id === selectedBusId) || buses[3] || {
    id: "BUS-104",
    route: "Route 38: Sinhagad Road -> Deccan",
    latitude: 18.4862,
    longitude: 73.8324,
    speed: 14,
    status: "INCIDENT",
    cameraStatus: "ACTIVE",
    driver: "Vikas Shinde"
  };

  const handleTriggerScenario = async (scenario) => {
    setCurrentScenario(scenario);
    setLoadingScenario(true);
    const res = await triggerDemoScenario(scenario, selectedBus.id);
    setLoadingScenario(false);
    if (res && res.scenarioResult) {
      setDetectionState(res.scenarioResult);
      if (onEventTriggered && res.scenarioResult.event) {
        onEventTriggered(res.scenarioResult.event);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Bus Unit Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 border-cyan-500/25">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE CAMERA FEED & REAL-TIME EDGE INFERENCE
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Bus Edge AI Telemetry & Object Detection
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulated camera feed running YOLOv8 + ANPR local edge inference on NVIDIA Jetson bus hardware.
          </p>
        </div>

        {/* Bus Selector */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0 shadow-lg">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div className="text-left font-mono">
            <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Select Mobile Sensor</label>
            <select
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pt-0.5"
            >
              {buses.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-950 text-white">
                  {b.id} • {b.route.split(":")[0]} ({b.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera View Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 relative overflow-hidden bg-slate-950 border-slate-800 rounded-3xl shadow-2xl">
            {/* Viewport Telemetry Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-900/90 rounded-xl mb-4 border border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <span className="live-dot"></span>
                <span className="font-bold">{selectedBus.id} LIVE EDGE CAMERA</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">1080p @ 30 FPS</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Model: <strong className="text-cyan-400 font-bold">YOLOv8 + EasyOCR</strong></span>
                <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 text-[10px] font-bold">
                  97.4% Bandwidth Saved
                </span>
              </div>
            </div>

            {/* Simulated Live Camera Viewport */}
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl flex items-center justify-center group">
              {/* Background Video Simulation Frame */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-all duration-700"
                style={{
                  backgroundImage: currentScenario === "pothole"
                    ? "url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1200&auto=format&fit=crop&q=80')"
                    : currentScenario === "rash_driving"
                    ? "url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80')"
                    : currentScenario === "congestion"
                    ? "url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&auto=format&fit=crop&q=80')"
                    : "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&auto=format&fit=crop&q=80')"
                }}
              />

              {/* Scanlines Effect */}
              <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30"></div>

              {/* Top-Left HUD Telemetry Overlay */}
              <div className="absolute top-4 left-4 font-mono text-[11px] text-cyan-400 space-y-1 bg-slate-950/90 p-3 rounded-xl border border-cyan-900/60 backdrop-blur shadow-xl">
                <div>GPS: {selectedBus.latitude.toFixed(4)}°N, {selectedBus.longitude.toFixed(4)}°E</div>
                <div>SPD: {selectedBus.speed} KM/H • DIR: 240° SW</div>
                <div>LATENCY: 12ms (Edge Inferencing)</div>
              </div>

              {/* Top-Right HUD Scenario Identifier */}
              <div className="absolute top-4 right-4 font-mono text-[11px] text-emerald-400 bg-slate-950/90 p-3 rounded-xl border border-emerald-900/60 backdrop-blur shadow-xl">
                <div>SCENARIO: <span className="uppercase text-white font-bold">{currentScenario.replace("_", " ")}</span></div>
                <div>OBJECTS DETECTED: {detectionState.detections ? detectionState.detections.length : 3}</div>
              </div>

              {/* Bounding Boxes Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {detectionState.detections && detectionState.detections.map((det, idx) => {
                  const [x, y, w, h] = det.box || [100 + idx * 100, 150 + idx * 50, 180, 120];
                  const isCritical = det.class === "pothole" || det.class === "anpr" || currentScenario === "rash_driving";
                  const isPerson = det.class === "person";
                  
                  const borderColor = isCritical ? "#f43f5e" : isPerson ? "#f59e0b" : "#06b6d4";
                  const bgColor = isCritical ? "rgba(244, 63, 94, 0.2)" : isPerson ? "rgba(245, 158, 11, 0.2)" : "rgba(6, 182, 212, 0.2)";
                  
                  return (
                    <div
                      key={idx}
                      className="ai-overlay-box transition-all duration-300"
                      style={{
                        left: `${(x / 6.4)}%`,
                        top: `${(y / 3.6)}%`,
                        width: `${(w / 6.4)}%`,
                        height: `${(h / 3.6)}%`,
                        borderColor: borderColor,
                        backgroundColor: bgColor
                      }}
                    >
                      <div 
                        className="px-2 py-0.5 rounded text-[10px] text-white font-extrabold font-mono tracking-wider shadow-md"
                        style={{ backgroundColor: borderColor }}
                      >
                        {det.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ANPR Reader Box Overlay */}
              {(currentScenario === "rash_driving" || detectionState.event?.registrationNumber) && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-rose-500 px-5 py-2.5 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3.5 animate-bounce">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                  <div className="font-mono text-left">
                    <div className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">ANPR Automatic Plate Reader</div>
                    <div className="text-base font-black text-white">
                      REG: <span className="text-amber-300 bg-slate-900 px-2.5 py-0.5 rounded-md border border-amber-500/50">MH12 AB 1234</span> <span className="text-xs text-emerald-400 font-bold">(91% Confidence)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Real-Time Telemetry Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-4 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Vehicles Count</div>
                <div className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <Car className="w-5 h-5 text-cyan-400" /> {detectionState.vehicle_count || 7}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Pedestrians</div>
                <div className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <Users className="w-5 h-5 text-amber-400" /> {detectionState.people_count || 2}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Traffic Density</div>
                <div className={`text-xl font-black mt-0.5 ${
                  detectionState.traffic_density === "SEVERE" ? "text-rose-400" :
                  detectionState.traffic_density === "HIGH" ? "text-amber-400" :
                  "text-emerald-400"
                }`}>
                  {detectionState.traffic_density || "MEDIUM"}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Edge Filtering</div>
                <div className="text-xl font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Scenario Control Triggers (Right Column) */}
        <div className="space-y-4">
          <div className="glass-panel p-6 space-y-4 border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" /> Demo Scenario Triggers
              </h3>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-0.5 rounded-full font-mono font-bold">
                SIH DEMO MODE
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Inject edge camera event triggers to demonstrate live synchronization across GIS Map, Road Priorities & ANPR Triage.
            </p>

            <div className="space-y-3">
              {/* Normal Traffic */}
              <button
                onClick={() => handleTriggerScenario("normal")}
                disabled={loadingScenario}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-xs transition duration-300 flex items-center justify-between group ${
                  currentScenario === "normal"
                    ? "bg-slate-800/90 border-cyan-500 text-white shadow-xl shadow-cyan-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-bold">1. Normal Traffic Flow</div>
                    <div className="text-[11px] text-slate-400 font-normal">Routine vehicle detection</div>
                  </div>
                </div>
                <Play className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition" />
              </button>

              {/* Heavy Congestion */}
              <button
                onClick={() => handleTriggerScenario("congestion")}
                disabled={loadingScenario}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-xs transition duration-300 flex items-center justify-between group ${
                  currentScenario === "congestion"
                    ? "bg-amber-950/50 border-amber-500 text-white shadow-xl shadow-amber-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-amber-300 font-bold">2. Heavy Congestion Bottleneck</div>
                    <div className="text-[11px] text-slate-400 font-normal">Flag 34+ stationary vehicles</div>
                  </div>
                </div>
                <Play className="w-4 h-4 text-amber-400" />
              </button>

              {/* Pothole Detected */}
              <button
                onClick={() => handleTriggerScenario("pothole")}
                disabled={loadingScenario}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-xs transition duration-300 flex items-center justify-between group ${
                  currentScenario === "pothole"
                    ? "bg-rose-950/50 border-rose-500 text-white shadow-xl shadow-rose-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-rose-300 font-bold">3. Pothole Road Defect (93%)</div>
                    <div className="text-[11px] text-slate-400 font-normal">Log defect with GPS + timestamp</div>
                  </div>
                </div>
                <Play className="w-4 h-4 text-rose-400" />
              </button>

              {/* Pedestrian Safety Alert */}
              <button
                onClick={() => handleTriggerScenario("pedestrian")}
                disabled={loadingScenario}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-xs transition duration-300 flex items-center justify-between group ${
                  currentScenario === "pedestrian"
                    ? "bg-amber-950/50 border-amber-500 text-white shadow-xl shadow-amber-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-amber-300 font-bold">4. Pedestrian Safety Hazard</div>
                    <div className="text-[11px] text-slate-400 font-normal">Detect school children near road</div>
                  </div>
                </div>
                <Play className="w-4 h-4 text-amber-400" />
              </button>

              {/* Rash Driving Incident */}
              <button
                onClick={() => handleTriggerScenario("rash_driving")}
                disabled={loadingScenario}
                className={`w-full p-4 rounded-2xl border text-left font-semibold text-xs transition duration-300 flex items-center justify-between group ${
                  currentScenario === "rash_driving"
                    ? "bg-purple-950/50 border-purple-500 text-white shadow-xl shadow-purple-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-purple-300 font-bold">5. Rash Driving + ANPR Extractor</div>
                    <div className="text-[11px] text-slate-400 font-normal">Extract plate: MH12 AB 1234</div>
                  </div>
                </div>
                <Play className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
