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
  Sparkles,
  Eye,
  Crosshair,
  Maximize2,
  Compass,
  AlertCircle
} from "lucide-react";
import { triggerDemoScenario } from "../services/api";

export default function LiveMonitoring({ buses = [], onEventTriggered }) {
  const [selectedBusId, setSelectedBusId] = useState("BUS-104");
  const [activeCamera, setActiveCamera] = useState("front"); // "front", "side_left", "side_right", "rear", "cabin"
  const [currentScenario, setCurrentScenario] = useState("normal");
  const [loadingScenario, setLoadingScenario] = useState(false);
  const [detectionState, setDetectionState] = useState({
    scenario: "normal",
    camera_angle: "front",
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

  const cameraAngles = [
    { id: "front", label: "Front Cam", desc: "Road Defects & Traffic", angle: "0° Forward", icon: Eye },
    { id: "side_left", label: "Left Cam", desc: "Pedestrians & Zebra", angle: "90° Port", icon: Crosshair },
    { id: "side_right", label: "Right Cam", desc: "Dividers & Medians", angle: "90° Starboard", icon: Crosshair },
    { id: "rear", label: "Rear Cam", desc: "Tailgating & Hit-and-Run", angle: "180° Aft", icon: Compass },
    { id: "cabin", label: "Cabin Cam", desc: "Passenger Safety & Crowd", angle: "Interior Dome", icon: Users },
  ];

  const handleCameraChange = async (camId) => {
    setActiveCamera(camId);
    setLoadingScenario(true);
    const res = await triggerDemoScenario(currentScenario, selectedBus.id, camId);
    setLoadingScenario(false);
    if (res && res.scenarioResult) {
      setDetectionState(res.scenarioResult);
    }
  };

  const handleTriggerScenario = async (scenario, defaultCam = null) => {
    const camToUse = defaultCam || activeCamera;
    if (defaultCam && defaultCam !== activeCamera) {
      setActiveCamera(defaultCam);
    }
    setCurrentScenario(scenario);
    setLoadingScenario(true);
    const res = await triggerDemoScenario(scenario, selectedBus.id, camToUse);
    setLoadingScenario(false);
    if (res && res.scenarioResult) {
      setDetectionState(res.scenarioResult);
      if (onEventTriggered && res.scenarioResult.event) {
        onEventTriggered(res.scenarioResult.event);
      }
    }
  };

  // Helper background image generator based on camera angle & scenario
  const getCameraBg = () => {
    if (activeCamera === "cabin" || currentScenario === "cabin_crowd") {
      return "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80";
    }
    if (currentScenario === "pothole") {
      return "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1200&auto=format&fit=crop&q=80";
    }
    if (currentScenario === "rash_driving") {
      return "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80";
    }
    if (currentScenario === "congestion") {
      return "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&auto=format&fit=crop&q=80";
    }
    if (currentScenario === "waterlogging") {
      return "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80";
    }
    if (currentScenario === "zebra_crossing" || activeCamera === "side_left") {
      return "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=1200&auto=format&fit=crop&q=80";
    }
    if (activeCamera === "rear") {
      return "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&auto=format&fit=crop&q=80";
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
            Multi-Camera Edge AI Telemetry
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Transforming public transit buses into 360° mobile sensing units (Front, Sides, Rear & Cabin).
          </p>
        </div>

        {/* Bus Selector */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0 shadow-lg">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Camera className="w-5 h-5" />
          </div>
          <div className="text-left font-mono">
            <label className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Active Bus Node</label>
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

      {/* Multi-Camera Switcher Bar & Bus Schematic */}
      <div className="glass-panel p-4 border-slate-800/80 bg-slate-950/90 rounded-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Camera Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-2 hidden sm:inline">
              Camera Feeds:
            </span>
            {cameraAngles.map(cam => {
              const Icon = cam.icon;
              const isActive = activeCamera === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraChange(cam.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono text-xs transition duration-200 ${
                    isActive 
                      ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400 animate-pulse" : ""}`} />
                  <div className="text-left">
                    <span className="font-bold">{cam.label}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight">{cam.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Bus Schematic */}
          <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Bus Anatomy:</div>
            <div className="relative flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
              {/* Rear */}
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                activeCamera === "rear" ? "bg-cyan-400 border-white shadow-md shadow-cyan-400 scale-125" : "bg-slate-700 border-slate-600"
              }`} title="Rear Camera" />
              {/* Left */}
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                activeCamera === "side_left" ? "bg-cyan-400 border-white shadow-md shadow-cyan-400 scale-125" : "bg-slate-700 border-slate-600"
              }`} title="Left Mirror Camera" />
              {/* Cabin */}
              <span className={`w-3 h-3 rounded-sm border transition-all flex items-center justify-center text-[8px] font-bold ${
                activeCamera === "cabin" ? "bg-cyan-400 text-slate-950 border-white scale-125" : "bg-slate-800 text-slate-500 border-slate-700"
              }`} title="Cabin Camera">C</span>
              {/* Right */}
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                activeCamera === "side_right" ? "bg-cyan-400 border-white shadow-md shadow-cyan-400 scale-125" : "bg-slate-700 border-slate-600"
              }`} title="Right Mirror Camera" />
              {/* Front */}
              <span className={`w-2.5 h-2.5 rounded-full border transition-all ${
                activeCamera === "front" ? "bg-cyan-400 border-white shadow-md shadow-cyan-400 scale-125" : "bg-slate-700 border-slate-600"
              }`} title="Front Windshield Camera" />
            </div>
            <span className="text-cyan-400 font-bold text-[11px]">
              {cameraAngles.find(c => c.id === activeCamera)?.angle}
            </span>
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
                <span className="font-bold uppercase">{selectedBus.id} • {cameraAngles.find(c => c.id === activeCamera)?.label}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">1080p @ 30 FPS</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Edge Model: <strong className="text-cyan-400 font-bold">YOLOv8 + OCR</strong></span>
                <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 text-[10px] font-bold">
                  97.4% Local Edge Filtered
                </span>
              </div>
            </div>

            {/* Simulated Live Camera Viewport */}
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl flex items-center justify-center group">
              {/* Background Video Simulation Frame */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-all duration-700"
                style={{ backgroundImage: `url('${getCameraBg()}')` }}
              />

              {/* Scanlines Effect */}
              <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-30"></div>

              {/* Top-Left HUD Telemetry Overlay */}
              <div className="absolute top-4 left-4 font-mono text-[11px] text-cyan-400 space-y-1 bg-slate-950/90 p-3 rounded-xl border border-cyan-900/60 backdrop-blur shadow-xl">
                <div>GPS: {selectedBus.latitude.toFixed(4)}°N, {selectedBus.longitude.toFixed(4)}°E</div>
                <div>SPD: {selectedBus.speed} KM/H • CAM: {activeCamera.toUpperCase()}</div>
                <div>LATENCY: 14ms (NVIDIA Jetson Edge)</div>
              </div>

              {/* Top-Right HUD Scenario Identifier */}
              <div className="absolute top-4 right-4 font-mono text-[11px] text-emerald-400 bg-slate-950/90 p-3 rounded-xl border border-emerald-900/60 backdrop-blur shadow-xl">
                <div>SCENARIO: <span className="uppercase text-white font-bold">{currentScenario.replace("_", " ")}</span></div>
                <div>OBJECTS: {detectionState.detections ? detectionState.detections.length : 3} TRACKED</div>
              </div>

              {/* Bounding Boxes Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {detectionState.detections && detectionState.detections.map((det, idx) => {
                  const [x, y, w, h] = det.box || [100 + idx * 100, 150 + idx * 50, 180, 120];
                  const isCritical = det.class === "pothole" || det.class === "anpr" || det.class === "waterlogging" || det.class === "divider" || currentScenario === "rash_driving";
                  const isPerson = det.class === "person" || det.class === "passenger";
                  const isZebra = det.class === "zebra";
                  
                  const borderColor = isCritical ? "#f43f5e" : isZebra ? "#a855f7" : isPerson ? "#f59e0b" : "#06b6d4";
                  const bgColor = isCritical ? "rgba(244, 63, 94, 0.2)" : isZebra ? "rgba(168, 85, 247, 0.2)" : isPerson ? "rgba(245, 158, 11, 0.2)" : "rgba(6, 182, 212, 0.2)";
                  
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
                  <Car className="w-5 h-5 text-cyan-400" /> {detectionState.vehicle_count ?? 7}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">People / Passengers</div>
                <div className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                  <Users className="w-5 h-5 text-amber-400" /> {detectionState.people_count ?? 2}
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
          <div className="glass-panel p-5 space-y-4 border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Problem Statement 26124 Scenarios
              </h3>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-mono font-bold">
                SIH TRIGGERS
              </span>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {/* Category: Traffic & Road Hazards */}
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider pt-1">
                Road Defect Sensing (Onboard AI):
              </div>

              {/* Pothole */}
              <button
                onClick={() => handleTriggerScenario("pothole", "front")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "pothole"
                    ? "bg-rose-950/50 border-rose-500 text-white shadow-md shadow-rose-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-rose-300 font-bold text-xs">Pothole Defect (Front)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Deep asphalt crater detection</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-rose-400" />
              </button>

              {/* Missing Zebra Crossing */}
              <button
                onClick={() => handleTriggerScenario("zebra_crossing", "side_left")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "zebra_crossing"
                    ? "bg-purple-950/50 border-purple-500 text-white shadow-md shadow-purple-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shrink-0">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-purple-300 font-bold text-xs">Faded Zebra Crossing (Side)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Missing road markings in school zone</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-purple-400" />
              </button>

              {/* Broken Divider */}
              <button
                onClick={() => handleTriggerScenario("missing_divider", "side_right")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "missing_divider"
                    ? "bg-amber-950/50 border-amber-500 text-white shadow-md shadow-amber-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-amber-300 font-bold text-xs">Missing Road Divider</div>
                    <div className="text-[10px] text-slate-400 font-normal">Median gap & illegal U-turn hazard</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {/* Damaged Signboard */}
              <button
                onClick={() => handleTriggerScenario("signboard_defect", "front")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "signboard_defect"
                    ? "bg-cyan-950/50 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-cyan-300 font-bold text-xs">Damaged Signboard</div>
                    <div className="text-[10px] text-slate-400 font-normal">Twisted 40 km/h speed limit sign</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              {/* Waterlogging */}
              <button
                onClick={() => handleTriggerScenario("waterlogging", "front")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "waterlogging"
                    ? "bg-blue-950/50 border-blue-500 text-white shadow-md shadow-blue-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-blue-300 font-bold text-xs">Severe Waterlogging</div>
                    <div className="text-[10px] text-slate-400 font-normal">Submerged lane at underpass</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-blue-400" />
              </button>

              {/* Category: Traffic Management & Incidents */}
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider pt-2">
                Enforcement & Safety:
              </div>

              {/* Rash Driving + ANPR */}
              <button
                onClick={() => handleTriggerScenario("rash_driving", "rear")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "rash_driving"
                    ? "bg-rose-950/50 border-rose-500 text-white shadow-md shadow-rose-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 shrink-0">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-rose-300 font-bold text-xs">Rash Driving & ANPR</div>
                    <div className="text-[10px] text-slate-400 font-normal">Plate extraction: MH12 AB 1234</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-rose-400" />
              </button>

              {/* Pedestrian */}
              <button
                onClick={() => handleTriggerScenario("pedestrian", "front")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "pedestrian"
                    ? "bg-amber-950/50 border-amber-500 text-white shadow-md shadow-amber-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-amber-300 font-bold text-xs">Pedestrian Hazard</div>
                    <div className="text-[10px] text-slate-400 font-normal">School children crossing roadway</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-amber-400" />
              </button>

              {/* Cabin Overcrowding */}
              <button
                onClick={() => handleTriggerScenario("cabin_crowd", "cabin")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "cabin_crowd"
                    ? "bg-cyan-950/50 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-cyan-300 font-bold text-xs">Cabin Overcrowding</div>
                    <div className="text-[10px] text-slate-400 font-normal">Footboard & door safety alert</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              {/* Reset to Normal */}
              <button
                onClick={() => handleTriggerScenario("normal", "front")}
                disabled={loadingScenario}
                className={`w-full p-3 rounded-xl border text-left font-semibold text-xs transition duration-200 flex items-center justify-between group ${
                  currentScenario === "normal"
                    ? "bg-slate-800/90 border-cyan-500 text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">Normal Traffic Routine</div>
                    <div className="text-[10px] text-slate-400 font-normal">Clear edge telemetry</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
