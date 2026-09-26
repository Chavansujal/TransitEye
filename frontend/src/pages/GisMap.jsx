import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Flame, AlertTriangle, Bus } from "lucide-react";

// Helper component to fix Leaflet map tile rendering in tabbed layouts
function MapController() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Custom Leaflet Animated Markers with Restrained Palette
const createCustomIcon = (color, type = "normal") => {
  let innerEffect = "";
  if (type === "pulse") {
    innerEffect = `<circle cx="18" cy="18" r="14" fill="none" stroke="${color}" stroke-width="1.5">
      <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0.15;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>`;
  } else if (type === "ripple") {
    innerEffect = `<circle cx="18" cy="18" r="15" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,3">
      <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="6s" repeatCount="indefinite"/>
    </circle>`;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      ${innerEffect}
      <circle cx="18" cy="18" r="11" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="4.5" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: svg,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const busIcon = createCustomIcon("#65a30d", "pulse"); // Lime for active buses
const potholeIcon = createCustomIcon("#dc2626", "pulse"); // Restrained Red for potholes
const congestionIcon = createCustomIcon("#d97706", "normal"); // Amber for congestion
const incidentIcon = createCustomIcon("#dc2626", "pulse"); // Red for ANPR incidents
const waterlogIcon = createCustomIcon("#d97706", "ripple"); // Amber ripple for waterlogging

// Pune Transit Waypoints for Smooth Live Bus Position Interpolation
const BUS_WAYPOINTS = {
  "BUS-101": [
    [18.4862, 73.8324], [18.4920, 73.8350], [18.4980, 73.8380], [18.5040, 73.8420], [18.5100, 73.8450]
  ],
  "BUS-102": [
    [18.5285, 73.8745], [18.5250, 73.8720], [18.5210, 73.8690], [18.5170, 73.8660], [18.5130, 73.8630]
  ],
  "BUS-103": [
    [18.5910, 73.7420], [18.5860, 73.7460], [18.5800, 73.7510], [18.5740, 73.7560], [18.5680, 73.7610]
  ],
  "BUS-104": [
    [18.5145, 73.8245], [18.5120, 73.8200], [18.5090, 73.8150], [18.5060, 73.8100], [18.5020, 73.8050]
  ]
};

// Key Transit Corridors for Heatmap & Animated Polyline Flow
const CONGESTION_CORRIDORS = [
  {
    id: "sinhagad",
    name: "Sinhagad Road Corridor (Rajaram Bridge)",
    severity: "CRITICAL",
    densityPct: 94,
    color: "#dc2626",
    coords: [
      [18.5015, 73.8398],
      [18.4942, 73.8361],
      [18.4862, 73.8324],
      [18.4795, 73.8290]
    ]
  },
  {
    id: "swargate",
    name: "Swargate Underpass Corridor",
    severity: "HIGH",
    densityPct: 88,
    color: "#d97706",
    coords: [
      [18.5085, 73.8648],
      [18.5021, 73.8638],
      [18.4960, 73.8615]
    ]
  },
  {
    id: "fcroad",
    name: "FC Road Transit Line",
    severity: "MEDIUM",
    densityPct: 68,
    color: "#65a30d",
    coords: [
      [18.5265, 73.8425],
      [18.5221, 73.8415],
      [18.5175, 73.8402]
    ]
  },
  {
    id: "hinjewadi",
    name: "Hinjewadi IT Bypass Corridor",
    severity: "CRITICAL",
    densityPct: 82,
    color: "#dc2626",
    coords: [
      [18.5910, 73.7420],
      [18.5815, 73.7482],
      [18.5720, 73.7590]
    ]
  }
];

export default function GisMap({ buses = [], events = [], roadIssues = [], incidents = [] }) {
  const [filterType, setFilterType] = useState("ALL");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const PUNE_CENTER = [18.5204, 73.8567];

  // State for live moving bus marker simulation
  const [animatedBuses, setAnimatedBuses] = useState(buses);
  const waypointIndexRef = useRef({ "BUS-101": 0, "BUS-102": 0, "BUS-103": 0, "BUS-104": 0 });

  useEffect(() => {
    if (!buses || buses.length === 0) return;

    const interval = setInterval(() => {
      setAnimatedBuses(prev => {
        return prev.map(bus => {
          const waypoints = BUS_WAYPOINTS[bus.id];
          if (!waypoints) return bus;

          const currentIndex = waypointIndexRef.current[bus.id] || 0;
          const nextIndex = (currentIndex + 1) % waypoints.length;
          waypointIndexRef.current[bus.id] = nextIndex;

          const [nextLat, nextLng] = waypoints[nextIndex];
          return {
            ...bus,
            latitude: nextLat,
            longitude: nextLng
          };
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [buses]);

  const filteredBuses = animatedBuses.filter(b => filterType === "ALL" || filterType === "BUSES");
  
  const filteredEvents = events.filter(e => {
    if (filterType === "ALL") return true;
    if (filterType === "POTHOLES") return e.type.includes("Pothole") || e.type.includes("Divider");
    if (filterType === "CONGESTION") return e.type.includes("Congestion") || e.type.includes("Waterlog");
    if (filterType === "INCIDENTS") return e.type.includes("Rash") || e.type.includes("Zebra") || e.registrationNumber;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans animate-fade-in-up">
      
      {/* Top Header & Layer Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 te-card p-5 border-l-4 border-l-[var(--te-lime)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--te-text)] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--te-lime)] shrink-0" /> Pune City GIS Spatial Intelligence Map
          </h2>
          <p className="text-xs text-[var(--te-text-muted)] mt-0.5">
            Real-time fleet tracking along transit routes, multi-bus corroborated defects & animated congestion heat corridors across Pune.
          </p>
        </div>

        {/* Action Controls & Layer Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          {/* Heatmap Toggle Button */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition ${
              showHeatmap 
                ? "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold" 
                : "bg-[var(--te-panel)] border-[var(--te-border)] text-[var(--te-text-muted)] hover:text-[var(--te-text)]"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? "text-rose-500 animate-pulse" : ""}`} />
            <span>Heatmap Overlay</span>
          </button>

          {/* Filter Buttons */}
          <div className="flex items-center gap-1 bg-[var(--te-panel)] p-1 rounded-md border border-[var(--te-border)] overflow-x-auto no-scrollbar">
            {["ALL", "BUSES", "POTHOLES", "CONGESTION", "INCIDENTS"].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition shrink-0 ${
                  filterType === type 
                    ? "bg-[var(--te-lime)] text-[var(--te-lime-pill-text)]" 
                    : "text-[var(--te-text-muted)] hover:text-[var(--te-text)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="h-[480px] sm:h-[540px] lg:h-[600px] te-card p-1.5 relative overflow-hidden shadow-md">
        <MapContainer 
          center={PUNE_CENTER} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%", borderRadius: "8px" }}
        >
          <MapController />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Congestion Corridors with Animated Flow Polylines */}
          {showHeatmap && CONGESTION_CORRIDORS.map(corr => (
            <React.Fragment key={corr.id}>
              {/* Outer Heat Glow */}
              <Polyline
                positions={corr.coords}
                pathOptions={{
                  color: corr.color,
                  weight: 10,
                  opacity: 0.3,
                  lineCap: "round"
                }}
              />
              {/* Moving Polyline Direction Flow */}
              <Polyline
                positions={corr.coords}
                pathOptions={{
                  color: corr.color,
                  weight: 4,
                  opacity: 0.9,
                  className: "route-polyline-animated"
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 font-sans text-xs">
                    <div className="font-bold text-[var(--te-text)] flex items-center justify-between gap-3 border-b border-[var(--te-border)] pb-1">
                      <span>{corr.name}</span>
                      <span className="font-mono-code text-rose-500 font-bold">{corr.densityPct}% DENSITY</span>
                    </div>
                    <div className="text-[var(--te-text-muted)]">Congestion Severity: <strong className="text-amber-500">{corr.severity}</strong></div>
                  </div>
                </Popup>
              </Polyline>
              {/* Intersection Halo */}
              <Circle
                center={corr.coords[1]}
                radius={200}
                pathOptions={{
                  color: corr.color,
                  fillColor: corr.color,
                  fillOpacity: 0.12,
                  weight: 1
                }}
              />
            </React.Fragment>
          ))}

          {/* Live Moving Bus Markers */}
          {filteredBuses.map((bus) => (
            <Marker 
              key={bus.id} 
              position={[bus.latitude, bus.longitude]} 
              icon={busIcon}
            >
              <Popup>
                <div className="space-y-1.5 p-1 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--te-border)] pb-1">
                    <strong className="text-[var(--te-lime)] font-mono-code font-bold">{bus.id}</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--te-lime-bg)] text-[var(--te-lime)] font-semibold border border-[var(--te-lime-border)]">
                      {bus.status}
                    </span>
                  </div>
                  <div className="text-[var(--te-text-muted)] space-y-0.5">
                    <div>Route: <strong className="text-[var(--te-text)]">{bus.route}</strong></div>
                    <div>Speed: <strong className="text-[var(--te-lime)]">{bus.speed} km/h</strong></div>
                    <div>Driver: {bus.driver}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Road Defect & Event Markers */}
          {filteredEvents.map((evt) => {
            const isPothole = evt.type.includes("Pothole") || evt.type.includes("Divider");
            const isCongestion = evt.type.includes("Congestion");
            const isWater = evt.type.includes("Waterlog");

            const icon = isPothole ? potholeIcon 
                       : isWater ? waterlogIcon 
                       : isCongestion ? congestionIcon 
                       : incidentIcon;

            return (
              <Marker 
                key={evt.id} 
                position={[evt.latitude, evt.longitude]} 
                icon={icon}
              >
                <Popup>
                  <div className="space-y-1.5 p-1 font-sans text-xs max-w-[220px]">
                    <div className="flex items-center justify-between border-b border-[var(--te-border)] pb-1">
                      <span className="font-bold text-[var(--te-text)]">{evt.type}</span>
                      <span className="text-[10px] font-mono-code font-bold text-amber-500">{((evt.confidence || 0.94) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-[var(--te-text-muted)] space-y-0.5">
                      <div>Location: <strong className="text-[var(--te-text)]">{evt.locationName || "Pune Corridor"}</strong></div>
                      <div>Source Bus: <strong className="text-[var(--te-lime)] font-mono-code">{evt.busId}</strong></div>
                      {evt.registrationNumber && (
                        <div className="text-[var(--te-lime)] font-mono-code font-bold">ANPR Plate: {evt.registrationNumber}</div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
