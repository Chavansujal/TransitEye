import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Filter, Layers, Info } from "lucide-react";

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

export default function GisMap({ buses = [], events = [], roadIssues = [], incidents = [] }) {
  const [filterType, setFilterType] = useState("ALL");
  const PUNE_CENTER = [18.5204, 73.8567];

  const filteredBuses = buses.filter(b => filterType === "ALL" || filterType === "BUSES");
  const filteredEvents = events.filter(e => {
    if (filterType === "ALL") return true;
    if (filterType === "POTHOLES") return e.type.includes("Pothole");
    if (filterType === "CONGESTION") return e.type.includes("Congestion");
    if (filterType === "INCIDENTS") return e.type.includes("Rash") || e.registrationNumber;
    return true;
  });

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      {/* Top Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 shrink-0 border-cyan-500/20">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <MapPin className="w-5 h-5 text-cyan-400" /> Pune City GIS Spatial Intelligence Map
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geospatial tracking of 12 mobile sensing buses, pothole defects, traffic bottlenecks & ANPR incidents.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {["ALL", "BUSES", "POTHOLES", "CONGESTION", "INCIDENTS"].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-bold transition duration-200 ${
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

      {/* Map Viewport Container */}
      <div className="flex-1 glass-panel p-2 relative rounded-3xl overflow-hidden border-slate-800/80 shadow-2xl">
        <MapContainer 
          center={PUNE_CENTER} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%", borderRadius: "18px" }}
        >
          {/* Free CartoDB Dark Matter / OpenStreetMap Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

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
                    <div>Camera: <span className="text-emerald-400 font-bold">ACTIVE</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hazard & Event Markers */}
          {filteredEvents.map((evt) => {
            const isPothole = evt.type.includes("Pothole");
            const isCongestion = evt.type.includes("Congestion");
            const icon = isPothole ? potholeIcon : isCongestion ? congestionIcon : incidentIcon;
            
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
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>Location: <strong className="text-white">{evt.locationName || "Pune"}</strong></div>
                      <div>Confidence: <strong className="text-emerald-400 font-mono font-bold">{(evt.confidence * 100).toFixed(0)}%</strong></div>
                      <div>Bus Unit: {evt.busId}</div>
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
        <div className="absolute bottom-6 right-6 z-[1000] glass-panel p-4 text-xs space-y-2.5 border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="font-bold text-white text-[10px] uppercase tracking-widest border-b border-slate-800 pb-1.5 flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> GIS Spatial Layers
          </div>
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
              <span className="text-slate-300">Active Buses (12 Units)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
              <span className="text-slate-300">Pothole Road Defects</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
              <span className="text-slate-300">Traffic Congestion Hotspots</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500"></span>
              <span className="text-slate-300">ANPR / Rash Driving Alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
