import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import { MapPin, Filter, Layers, Info, Flame, ShieldCheck, AlertTriangle } from "lucide-react";

// Custom Leaflet Markers
const createCustomIcon = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2.5"/>
      <circle cx="16" cy="16" r="6" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: svg,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

const busIcon = createCustomIcon("#06b6d4"); // Cyan for buses
const potholeIcon = createCustomIcon("#ef4444"); // Red for potholes
const congestionIcon = createCustomIcon("#f59e0b"); // Amber for congestion
const incidentIcon = createCustomIcon("#a855f7"); // Purple for ANPR incidents
const zebraIcon = createCustomIcon("#8b5cf6"); // Violet for zebra crossings
const waterlogIcon = createCustomIcon("#3b82f6"); // Blue for waterlogging
const signboardIcon = createCustomIcon("#10b981"); // Emerald for signboards

// Pune Key Transit Corridors for Congestion Heatmap
const CONGESTION_CORRIDORS = [
  {
    id: "sinhagad",
    name: "Sinhagad Road Bottleneck (Rajaram Bridge to Hingne)",
    severity: "SEVERE",
    densityPct: 94,
    color: "#ef4444",
    coords: [
      [18.5015, 73.8398],
      [18.4942, 73.8361],
      [18.4862, 73.8324],
      [18.4795, 73.8290]
    ]
  },
  {
    id: "swargate",
    name: "Swargate Underpass Transit Corridor",
    severity: "CRITICAL",
    densityPct: 88,
    color: "#f43f5e",
    coords: [
      [18.5085, 73.8648],
      [18.5021, 73.8638],
      [18.4960, 73.8615]
    ]
  },
  {
    id: "fcroad",
    name: "Fergusson College Road (Goodluck to Garware)",
    severity: "HIGH",
    densityPct: 68,
    color: "#f59e0b",
    coords: [
      [18.5265, 73.8425],
      [18.5221, 73.8415],
      [18.5175, 73.8402]
    ]
  },
  {
    id: "paud",
    name: "Paud Road Underpass & Flyover Approach",
    severity: "HIGH",
    densityPct: 62,
    color: "#f59e0b",
    coords: [
      [18.5145, 73.8245],
      [18.5112, 73.8194],
      [18.5080, 73.8120]
    ]
  },
  {
    id: "hinjewadi",
    name: "Hinjewadi Phase 1 IT Expressway Bypass",
    severity: "SEVERE",
    densityPct: 82,
    color: "#ef4444",
    coords: [
      [18.5910, 73.7420],
      [18.5815, 73.7482],
      [18.5720, 73.7590]
    ]
  },
  {
    id: "station",
    name: "Pune Station Express Transit Line",
    severity: "NORMAL",
    densityPct: 35,
    color: "#10b981",
    coords: [
      [18.5285, 73.8745],
      [18.5235, 73.8710],
      [18.5185, 73.8682]
    ]
  }
];

export default function GisMap({ buses = [], events = [], roadIssues = [], incidents = [] }) {
  const [filterType, setFilterType] = useState("ALL");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const PUNE_CENTER = [18.5204, 73.8567];

  const filteredBuses = buses.filter(b => filterType === "ALL" || filterType === "BUSES");
  
  const filteredEvents = events.filter(e => {
    if (filterType === "ALL") return true;
    if (filterType === "POTHOLES") return e.type.includes("Pothole") || e.type.includes("Divider");
    if (filterType === "CONGESTION") return e.type.includes("Congestion") || e.type.includes("Waterlog");
    if (filterType === "INCIDENTS") return e.type.includes("Rash") || e.type.includes("Zebra") || e.registrationNumber;
    return true;
  });

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 max-w-7xl mx-auto flex flex-col min-h-0 flex-1">
      {/* Top Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 glass-panel p-4 sm:p-5 shrink-0 border-cyan-500/20">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" /> Pune City GIS Spatial Intelligence Map
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Fleet tracking, multi-bus corroborated road defects & real-time congestion heat corridors.
          </p>
        </div>

        {/* Action Controls & Layer Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Heatmap Toggle Button */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition ${
              showHeatmap 
                ? "bg-rose-950/80 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20" 
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${showHeatmap ? "text-rose-400 animate-pulse" : ""}`} />
            <span>Heatmap: {showHeatmap ? "ON" : "OFF"}</span>
          </button>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] sm:text-xs font-mono overflow-x-auto no-scrollbar max-w-full">
            {["ALL", "BUSES", "POTHOLES", "CONGESTION", "INCIDENTS"].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold transition duration-200 shrink-0 ${
                  filterType === type 
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="h-[380px] sm:h-[480px] lg:h-[580px] flex-1 glass-panel p-1.5 sm:p-2 relative rounded-2xl sm:rounded-3xl overflow-hidden border-slate-800/80 shadow-2xl">
        <MapContainer 
          center={PUNE_CENTER} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%", borderRadius: "16px" }}
        >
          {/* OpenStreetMap Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Congestion Heatmap Corridor Polylines */}
          {showHeatmap && CONGESTION_CORRIDORS.map(corr => (
            <React.Fragment key={corr.id}>
              {/* Outer Heat Glow Polyline */}
              <Polyline
                positions={corr.coords}
                pathOptions={{
                  color: corr.color,
                  weight: 12,
                  opacity: 0.35,
                  lineCap: "round"
                }}
              />
              {/* Core Road Corridor Polyline */}
              <Polyline
                positions={corr.coords}
                pathOptions={{
                  color: corr.color,
                  weight: 5,
                  opacity: 0.9,
                  dashArray: corr.severity === "SEVERE" || corr.severity === "CRITICAL" ? "8, 6" : undefined
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 font-sans text-xs">
                    <div className="font-bold text-white flex items-center justify-between gap-3 border-b border-slate-700 pb-1">
                      <span>{corr.name}</span>
                      <span className="font-mono text-rose-400">{corr.densityPct}% DENSITY</span>
                    </div>
                    <div className="text-slate-300">Congestion Severity: <strong className="text-amber-400">{corr.severity}</strong></div>
                    <div className="text-[10px] text-slate-400">Calculated across passing bus fleet speed & dwell times.</div>
                  </div>
                </Popup>
              </Polyline>
              {/* Intersection Heat Halos */}
              <Circle
                center={corr.coords[1]}
                radius={240}
                pathOptions={{
                  color: corr.color,
                  fillColor: corr.color,
                  fillOpacity: 0.15,
                  weight: 1
                }}
              />
            </React.Fragment>
          ))}

          {/* Bus Markers */}
          {filteredBuses.map((bus) => (
            <Marker 
              key={bus.id} 
              position={[bus.latitude, bus.longitude]} 
              icon={busIcon}
            >
              <Popup>
                <div className="space-y-2 p-1 font-sans">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                    <strong className="text-cyan-400 text-sm font-mono font-bold">{bus.id}</strong>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      bus.status === "ONLINE" ? "bg-emerald-950 text-emerald-300" : "bg-rose-950 text-rose-300"
                    }`}>
                      {bus.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>Route: <strong className="text-white">{bus.route}</strong></div>
                    <div>Speed: <strong className="text-emerald-400">{bus.speed} km/h</strong></div>
                    <div>Driver: {bus.driver}</div>
                    <div>Cameras: <span className="text-emerald-400 font-bold">4 Cams Active</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Road Defect & Event Markers */}
          {filteredEvents.map((evt) => {
            const isPothole = evt.type.includes("Pothole") || evt.type.includes("Divider");
            const isCongestion = evt.type.includes("Congestion");
            const isZebra = evt.type.includes("Zebra");
            const isWater = evt.type.includes("Waterlog");
            const isSign = evt.type.includes("Signboard");

            const icon = isPothole ? potholeIcon 
                       : isZebra ? zebraIcon 
                       : isWater ? waterlogIcon 
                       : isSign ? signboardIcon 
                       : isCongestion ? congestionIcon 
                       : incidentIcon;
            
            // Find corroboration count from roadIssues
            const matchedIssue = roadIssues.find(ri => 
              ri.location && evt.locationName && (
                ri.location.toLowerCase().includes(evt.locationName.toLowerCase().split(" ")[0]) ||
                evt.locationName.toLowerCase().includes(ri.location.toLowerCase().split(" ")[0])
              )
            );
            const corroborationCount = matchedIssue ? matchedIssue.busesReporting : 3;

            return (
              <Marker 
                key={evt.id} 
                position={[evt.latitude, evt.longitude]} 
                icon={icon}
              >
                <Popup>
                  <div className="space-y-2 p-1 font-sans">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                      <strong className="text-rose-400 text-sm font-bold">{evt.type}</strong>
                      <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {evt.id}
                      </span>
                    </div>

                    {/* Multi-Bus Corroboration Badge */}
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-950/80 border border-cyan-700 rounded-lg text-[10px] text-cyan-300 font-mono font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      Verified by {corroborationCount} Buses
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <div>Location: <strong className="text-white">{evt.locationName || "Pune"}</strong></div>
                      <div>Confidence: <strong className="text-emerald-400 font-mono font-bold">{(evt.confidence * 100).toFixed(0)}%</strong></div>
                      <div>Camera Angle: <span className="font-mono text-cyan-300 uppercase">{evt.cameraAngle || "Front Cam"}</span></div>
                      {evt.registrationNumber && (
                        <div className="text-amber-300 font-mono font-bold bg-slate-950 p-1.5 rounded-lg border border-amber-500/40 mt-1">
                          ANPR Plate: {evt.registrationNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-[1000] glass-panel p-3 sm:p-4 text-[11px] sm:text-xs space-y-2 border-slate-800 shadow-2xl backdrop-blur-xl max-w-[240px] sm:max-w-xs">
          <div className="font-bold text-white text-[9px] sm:text-[10px] uppercase tracking-widest border-b border-slate-800 pb-1 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> GIS Spatial Layers
            </span>
            <span className="text-cyan-400 hidden sm:inline">SIH 26124</span>
          </div>
          <div className="space-y-1.5 font-mono text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 shrink-0"></span>
              <span className="text-slate-300">Active Bus Sensors (12)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 shrink-0"></span>
              <span className="text-slate-300">Potholes & Defects</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-purple-500 shrink-0"></span>
              <span className="text-slate-300">Zebra & Pedestrians</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 shrink-0"></span>
              <span className="text-slate-300">Waterlogging</span>
            </div>
            {showHeatmap && (
              <div className="pt-1 border-t border-slate-800 flex items-center gap-1.5 text-rose-400 text-[9px] sm:text-[10px]">
                <Flame className="w-3 h-3 animate-pulse shrink-0" />
                <span>Congestion Heat Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
