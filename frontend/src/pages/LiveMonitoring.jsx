import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Play, 
  Pause,
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
  AlertCircle,
  Activity,
  Zap,
  RotateCw,
  ScanLine,
  Film
} from "lucide-react";
import { triggerDemoScenario } from "../services/api";

export default function LiveMonitoring({ buses = [], onEventTriggered }) {
  const [selectedBusId, setSelectedBusId] = useState("BUS-104");
  const [activeCamera, setActiveCamera] = useState("front"); // "front", "side_left", "side_right", "rear", "cabin"
  const [currentScenario, setCurrentScenario] = useState("normal");
  const [loadingScenario, setLoadingScenario] = useState(false);
  const [frontVideoFeed, setFrontVideoFeed] = useState("cockpit"); // "cockpit" (Driver Dashcam), "firefly" (Firefly 360 Continuous), "veo" (Gemini AI Bus), or "traffic" (Highway)
  
  // Real-time AI Vision Controls
  const [aiVisionEnabled, setAiVisionEnabled] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [showSpeedTags, setShowSpeedTags] = useState(true);
  const [fps, setFps] = useState(30.0);
  const [frameCount, setFrameCount] = useState(14820);
  const [latency, setLatency] = useState(13.4);
  const [snapshotFlash, setSnapshotFlash] = useState(false);
  const [snapshotMsg, setSnapshotMsg] = useState(null);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const tracksRef = useRef([]);
  const frameCounterRef = useRef(14820);

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

  // Initialize camera-specific real-time tracking objects
  const initTracks = (cam, scenario, videoType = frontVideoFeed) => {
    let tracks = [];

    if (cam === "front") {
      if (videoType === "cockpit") {
        // Real Bus Cockpit / Driver Dashcam view (Vikas Shinde)
        tracks = [
          {
            id: "DRIVER-01",
            class: "driver",
            label: "Driver: Vikas Shinde",
            color: "#10b981",
            x: 18, y: 56, w: 22, h: 36,
            vx: 0.003, vy: 0.003,
            growth: 0.0,
            speed: 0.0,
            confidence: 0.98,
            dist: 0.8,
            trail: [],
            type: "driver"
          },
          {
            id: "TRK-HVY-01",
            class: "truck",
            label: "Lead Truck",
            color: "#06b6d4",
            x: 52, y: 28, w: 18, h: 26,
            vx: 0.02, vy: 0.04,
            growth: 0.0006,
            speed: 38.2,
            confidence: 0.95,
            dist: 24.5,
            trail: [],
            type: "vehicle"
          },
          {
            id: "LANE-ARR-01",
            class: "lane",
            label: "Lane Vector",
            color: "#38bdf8",
            x: 44, y: 65, w: 14, h: 14,
            vx: 0.0, vy: 0.03,
            growth: 0.0003,
            speed: 0.0,
            confidence: 0.97,
            dist: 5.2,
            trail: [],
            type: "crosswalk"
          },
          {
            id: "DASH-CAN-01",
            class: "telemetry",
            label: "CAN Telemetry",
            color: "#a855f7",
            x: 26, y: 82, w: 30, h: 13,
            vx: 0.0, vy: 0.0,
            growth: 0.0,
            speed: selectedBus.speed || 42.0,
            confidence: 0.99,
            dist: 0.5,
            trail: [],
            type: "telemetry"
          }
        ];

        if (scenario === "pothole") {
          tracks.push({
            id: "POTHOLE-CP",
            class: "pothole",
            label: "Pothole Defect (6.4cm)",
            color: "#f43f5e",
            x: 46, y: 52, w: 14, h: 12,
            vx: 0.01, vy: 0.05,
            growth: 0.0007,
            speed: 0.0,
            confidence: 0.95,
            dist: 8.4,
            trail: [],
            isHazard: true,
            type: "defect"
          });
        }
      } else if (videoType === "firefly") {
        // Continuous 360-degree road camera feed tracks
        tracks = [
          {
            id: "TRK-360-A",
            class: "car",
            label: "Lead Vehicle (Lane 2)",
            color: "#06b6d4",
            x: 44, y: 46, w: 18, h: 20,
            vx: 0.03, vy: 0.08,
            growth: 0.0011,
            speed: 48.6,
            confidence: 0.96,
            dist: 14.8,
            trail: [],
            type: "vehicle"
          },
          {
            id: "TRK-360-B",
            class: "bus",
            label: "Transit Bus #18",
            color: "#10b981",
            x: 19, y: 38, w: 24, h: 28,
            vx: -0.02, vy: 0.05,
            growth: 0.0008,
            speed: 36.2,
            confidence: 0.95,
            dist: 24.5,
            trail: [],
            type: "vehicle"
          },
          {
            id: "TRK-360-C",
            class: "bike",
            label: "Motorcycle (Lane 1)",
            color: "#38bdf8",
            x: 35, y: 56, w: 10, h: 18,
            vx: -0.04, vy: 0.12,
            growth: 0.0014,
            speed: 54.0,
            confidence: 0.93,
            dist: 9.8,
            trail: [],
            type: "vehicle"
          }
        ];

        if (scenario === "pothole") {
          tracks.push({
            id: "DEFECT-01",
            class: "pothole",
            label: "Pothole Defect (7.8cm)",
            color: "#f43f5e",
            x: 46, y: 62, w: 16, h: 14,
            vx: 0.01, vy: 0.07,
            growth: 0.0009,
            speed: 0.0,
            confidence: 0.94,
            dist: 7.8,
            trail: [],
            isHazard: true,
            type: "defect"
          });
        }
      } else if (videoType === "veo") {
        // Aligned specifically to the Gemini Veo AI Bus Dashcam view
        tracks = [
          {
            id: "BUS-53",
            class: "bus",
            label: "PMPML Bus #53 (Route: Katraj)",
            color: "#06b6d4",
            x: 21, y: 15, w: 25, h: 36,
            vx: -0.01, vy: 0.03,
            growth: 0.0004,
            speed: 36.4,
            confidence: 0.96,
            dist: 18.2,
            trail: [],
            type: "vehicle"
          },
          {
            id: "CAR-72",
            class: "car",
            label: "Silver Sedan",
            color: "#38bdf8",
            x: 54, y: 31, w: 12, h: 16,
            vx: 0.02, vy: 0.04,
            growth: 0.0006,
            speed: 42.1,
            confidence: 0.94,
            dist: 22.8,
            trail: [],
            type: "vehicle"
          },
          {
            id: "ZEBRA-02",
            class: "zebra",
            label: "Crosswalk Marking (Grade A)",
            color: "#a855f7",
            x: 24, y: 68, w: 58, h: 14,
            vx: 0.0, vy: 0.03,
            growth: 0.0003,
            speed: 0.0,
            confidence: 0.97,
            dist: 4.8,
            trail: [],
            type: "crosswalk"
          }
        ];

        // Pothole / road defect right in front on asphalt
        if (scenario === "pothole") {
          tracks.push({
            id: "POTHOLE-01",
            class: "pothole",
            label: "Pothole Defect (8.4cm)",
            color: "#f43f5e",
            x: 43, y: 55, w: 16, h: 14,
            vx: 0.01, vy: 0.06,
            growth: 0.0008,
            speed: 0.0,
            confidence: 0.94,
            dist: 7.2,
            trail: [],
            isHazard: true,
            type: "defect"
          });
        }
      } else {
        // High density traffic video tracks
        tracks = [
          {
            id: "TRK-102",
            class: "car",
            label: "Car",
            color: "#06b6d4",
            x: 48, y: 52, w: 18, h: 22,
            vx: 0.05, vy: 0.09,
            growth: 0.0012,
            speed: 46.2,
            confidence: 0.95,
            dist: 16.4,
            trail: [],
            type: "vehicle"
          },
          {
            id: "TRK-108",
            class: "bike",
            label: "Two-Wheeler",
            color: "#38bdf8",
            x: 32, y: 58, w: 10, h: 18,
            vx: -0.03, vy: 0.12,
            growth: 0.0015,
            speed: 51.8,
            confidence: 0.92,
            dist: 11.2,
            trail: [],
            type: "vehicle"
          }
        ];
        if (scenario === "pothole") {
          tracks.push({
            id: "DEFECT-01",
            class: "pothole",
            label: "CRITICAL: Pothole (Depth 7.4cm)",
            color: "#f43f5e",
            x: 42, y: 64, w: 16, h: 14,
            vx: 0.01, vy: 0.08,
            growth: 0.001,
            speed: 0.0,
            confidence: 0.93,
            dist: 8.4,
            trail: [],
            isHazard: true,
            type: "defect"
          });
        }
      }

      if (scenario === "waterlogging") {
        tracks.push({
          id: "HAZARD-02",
          class: "waterlogging",
          label: "ALERT: Waterlogged Zone (14cm Submerged)",
          color: "#3b82f6",
          x: 26, y: 62, w: 32, h: 20,
          vx: 0.01, vy: 0.05,
          growth: 0.0008,
          speed: 0.0,
          confidence: 0.92,
          dist: 9.6,
          trail: [],
          isHazard: true,
          type: "hazard"
        });
      } else if (scenario === "signboard_defect") {
        tracks.push({
          id: "SIGN-40",
          class: "signboard",
          label: "SIGN DEFECT: Speed Limit 40 (Rotated -32°)",
          color: "#f59e0b",
          x: 72, y: 32, w: 12, h: 22,
          vx: 0.02, vy: 0.04,
          growth: 0.0005,
          speed: 0.0,
          confidence: 0.90,
          dist: 14.1,
          trail: [],
          isHazard: true,
          type: "sign"
        });
      }
    } else if (cam === "side_left") {
      tracks = [
        {
          id: "PED-01",
          class: "pedestrian",
          label: "Pedestrian (Sidewalk)",
          color: "#a855f7",
          x: 20, y: 48, w: 10, h: 26,
          vx: 0.08, vy: 0.01,
          growth: 0.0002,
          speed: 4.6,
          confidence: 0.96,
          dist: 4.2,
          trail: [],
          type: "pedestrian"
        },
        {
          id: "PED-02",
          class: "pedestrian",
          label: "Student Commuter",
          color: "#c084fc",
          x: 42, y: 52, w: 9, h: 24,
          vx: 0.07, vy: -0.01,
          growth: 0.0002,
          speed: 5.1,
          confidence: 0.94,
          dist: 5.0,
          trail: [],
          type: "pedestrian"
        },
        {
          id: "ZEBRA-01",
          class: "zebra",
          label: scenario === "zebra_crossing" ? "DEFECT: Faded Zebra (24% Contrast - PMC Alert)" : "Zebra Crosswalk (Active)",
          color: scenario === "zebra_crossing" ? "#f43f5e" : "#a855f7",
          x: 15, y: 65, w: 70, h: 22,
          vx: 0.01, vy: 0.03,
          growth: 0.0003,
          speed: 0.0,
          confidence: 0.97,
          dist: 3.5,
          trail: [],
          isHazard: scenario === "zebra_crossing",
          type: "crosswalk"
        }
      ];
    } else if (cam === "side_right") {
      tracks = [
        {
          id: "DIVIDER-01",
          class: "divider",
          label: scenario === "missing_divider" ? "ALERT: Missing Divider Gap (Illegal U-Turn Hazard)" : "Concrete Median Barrier",
          color: scenario === "missing_divider" ? "#f43f5e" : "#f59e0b",
          x: 12, y: 38, w: 34, h: 48,
          vx: -0.02, vy: 0.04,
          growth: 0.0005,
          speed: 0.0,
          confidence: 0.95,
          dist: 2.1,
          trail: [],
          isHazard: scenario === "missing_divider",
          type: "divider"
        },
        {
          id: "TRK-401",
          class: "car",
          label: "Overtaking Sedan",
          color: "#06b6d4",
          x: 58, y: 44, w: 22, h: 26,
          vx: 0.06, vy: 0.08,
          growth: 0.001,
          speed: 62.4,
          confidence: 0.94,
          dist: 8.5,
          trail: [],
          type: "vehicle"
        }
      ];
    } else if (cam === "rear") {
      const isRash = scenario === "rash_driving";
      tracks = [
        {
          id: isRash ? "RASH-01" : "TRK-842",
          class: isRash ? "anpr" : "car",
          label: isRash ? "ALERT: Tailgater [MH-12-AB-1234] 88 km/h" : "Following Car",
          color: isRash ? "#f43f5e" : "#06b6d4",
          x: 36, y: 48, w: isRash ? 28 : 22, h: isRash ? 28 : 22,
          vx: 0.01, vy: isRash ? 0.12 : 0.04,
          growth: isRash ? 0.0022 : 0.0008,
          speed: isRash ? 88.4 : 42.0,
          confidence: isRash ? 0.98 : 0.93,
          dist: isRash ? 6.2 : 19.4,
          trail: [],
          isHazard: isRash,
          type: "vehicle"
        }
      ];
      if (isRash) {
        tracks.push({
          id: "PLATE-01",
          class: "plate",
          label: "ANPR OCR: MH 12 AB 1234",
          color: "#e11d48",
          x: 43, y: 64, w: 14, h: 8,
          vx: 0.01, vy: 0.12,
          growth: 0.0012,
          speed: 88.4,
          confidence: 0.95,
          dist: 6.2,
          trail: [],
          isHazard: true,
          type: "anpr"
        });
      }
    } else if (cam === "cabin") {
      const isCrowd = scenario === "cabin_crowd";
      tracks = [
        {
          id: "ROUTE-DISP",
          class: "display",
          label: "Route 483 to Harrow",
          color: "#f59e0b",
          x: 36, y: 10, w: 28, h: 14,
          vx: 0.0, vy: 0.0,
          growth: 0.0,
          speed: 0.0,
          confidence: 0.99,
          dist: 5.8,
          trail: [],
          type: "display"
        },
        {
          id: "PASS-01",
          class: "passenger",
          label: "Passenger (Seated)",
          color: "#10b981",
          x: 18, y: 46, w: 16, h: 36,
          vx: 0.002, vy: 0.002,
          growth: 0.0,
          speed: 0.0,
          confidence: 0.97,
          dist: 3.2,
          trail: [],
          type: "passenger"
        },
        {
          id: "PASS-02",
          class: "passenger",
          label: "Passenger (Seated)",
          color: "#06b6d4",
          x: 36, y: 42, w: 14, h: 32,
          vx: -0.002, vy: 0.002,
          growth: 0.0,
          speed: 0.0,
          confidence: 0.96,
          dist: 4.5,
          trail: [],
          type: "passenger"
        },
        {
          id: "PASS-03",
          class: "passenger",
          label: "Passenger (Seated)",
          color: "#38bdf8",
          x: 62, y: 44, w: 16, h: 34,
          vx: 0.002, vy: -0.002,
          growth: 0.0,
          speed: 0.0,
          confidence: 0.94,
          dist: 3.8,
          trail: [],
          type: "passenger"
        },
        {
          id: "AISLE-MON",
          class: "safety",
          label: "Aisle Gangway: Clear",
          color: "#10b981",
          x: 44, y: 64, w: 14, h: 26,
          vx: 0.0, vy: 0.0,
          growth: 0.0,
          speed: 0.0,
          confidence: 0.98,
          dist: 2.1,
          trail: [],
          type: "safety"
        }
      ];
      if (isCrowd) {
        tracks.push({
          id: "CROWD-ALERT",
          class: "footboard",
          label: "OVERCROWD ALERT: Standing Passenger Density (Capacity: 86%)",
          color: "#f43f5e",
          x: 46, y: 38, w: 18, h: 42,
          vx: 0.01, vy: -0.01,
          growth: 0.0,
          speed: 0.8,
          confidence: 0.98,
          dist: 2.5,
          trail: [],
          isHazard: true,
          type: "crowd"
        });
      }
    }

    tracksRef.current = tracks;
  };

  // Sync tracks when camera, scenario, or front video feed toggles
  useEffect(() => {
    initTracks(activeCamera, currentScenario, frontVideoFeed);
  }, [activeCamera, currentScenario, frontVideoFeed]);

  // Real-time Canvas Rendering Animation Loop (60 FPS Native)
  useEffect(() => {
    let lastRenderTime = performance.now();
    let frameDeltaSamples = [];

    const renderLoop = (timestamp) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Sync canvas dimensions with display container
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.floor(rect.width);
      const displayHeight = Math.floor(rect.height);

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Frame stats calculation
      const delta = timestamp - lastRenderTime;
      lastRenderTime = timestamp;
      frameDeltaSamples.push(delta);
      if (frameDeltaSamples.length > 20) frameDeltaSamples.shift();

      frameCounterRef.current += 1;
      if (frameCounterRef.current % 12 === 0) {
        const avgDelta = frameDeltaSamples.reduce((a, b) => a + b, 0) / frameDeltaSamples.length;
        const calculatedFps = Math.min(60, Math.max(24, 1000 / (avgDelta || 33.3)));
        setFps(parseFloat(calculatedFps.toFixed(1)));
        setFrameCount(frameCounterRef.current);
        setLatency(parseFloat((12.5 + Math.random() * 2.5).toFixed(1)));
      }

      // Draw Perspective Lane Calibration Grid (Subtle)
      if (aiVisionEnabled && (activeCamera === "front" || activeCamera === "rear")) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);

        const vpX = displayWidth * 0.5;
        const vpY = displayHeight * 0.42;

        ctx.beginPath();
        ctx.moveTo(vpX - 40, vpY);
        ctx.lineTo(displayWidth * 0.1, displayHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(vpX + 40, vpY);
        ctx.lineTo(displayWidth * 0.9, displayHeight);
        ctx.stroke();

        ctx.setLineDash([]);
      }

      // Update and Draw Live AI Detection Tracks
      if (aiVisionEnabled) {
        const tracks = tracksRef.current;
        const t = timestamp * 0.003;

        tracks.forEach((track) => {
          // Physics movement & screen wrapping
          track.x += track.vx;
          track.y += track.vy;

          if (track.growth) {
            track.w += track.growth * 100;
            track.h += track.growth * 100;
          }

          // Micro-fluctuate confidence realistically
          track.confidence = Math.max(0.88, Math.min(0.99, track.confidence + (Math.random() - 0.5) * 0.004));

          // Screen boundary bounce or loop
          if (activeCamera === "front") {
            if (track.y > 86) {
              track.y = 44 + Math.random() * 6;
              track.x = 40 + (Math.random() - 0.5) * 22;
              track.w = track.class === "bus" ? 25 : track.class === "car" ? 14 : 16;
              track.h = track.class === "bus" ? 36 : track.class === "car" ? 18 : 14;
              track.trail = [];
            }
          } else if (activeCamera === "side_left") {
            if (track.x > 85) {
              track.x = 10;
              track.trail = [];
            }
          } else if (activeCamera === "rear") {
            if (track.y > 82) {
              track.y = 45;
              track.w = track.isHazard ? 24 : 18;
              track.h = track.isHazard ? 24 : 18;
              track.trail = [];
            }
          } else if (activeCamera === "cabin") {
            track.x += Math.sin(t + track.id.charCodeAt(3)) * 0.04;
          }

          // Compute absolute canvas pixels
          const px = (track.x / 100) * displayWidth;
          const py = (track.y / 100) * displayHeight;
          const pw = (track.w / 100) * displayWidth;
          const ph = (track.h / 100) * displayHeight;

          // Record motion trail breadcrumbs
          track.trail.push({ x: px + pw / 2, y: py + ph / 2 });
          if (track.trail.length > 12) track.trail.shift();

          // Draw Motion Trail
          if (showTrails && track.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(track.trail[0].x, track.trail[0].y);
            for (let i = 1; i < track.trail.length; i++) {
              ctx.lineTo(track.trail[i].x, track.trail[i].y);
            }
            ctx.strokeStyle = track.color + "55";
            ctx.lineWidth = 2;
            ctx.stroke();

            track.trail.forEach((pt) => {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = track.color + "88";
              ctx.fill();
            });
          }

          // Draw Bounding Box Fill Tint
          ctx.fillStyle = track.isHazard ? "rgba(244, 63, 94, 0.16)" : "rgba(6, 182, 212, 0.10)";
          ctx.fillRect(px, py, pw, ph);

          // Draw Corner Brackets (Custom Urban Vision AI style)
          const bracketLen = Math.min(14, pw * 0.25, ph * 0.25);
          ctx.strokeStyle = track.color;
          ctx.lineWidth = track.isHazard ? 2.5 : 2;
          ctx.lineCap = "round";

          // Top-Left
          ctx.beginPath();
          ctx.moveTo(px, py + bracketLen);
          ctx.lineTo(px, py);
          ctx.lineTo(px + bracketLen, py);
          ctx.stroke();

          // Top-Right
          ctx.beginPath();
          ctx.moveTo(px + pw - bracketLen, py);
          ctx.lineTo(px + pw, py);
          ctx.lineTo(px + pw, py + bracketLen);
          ctx.stroke();

          // Bottom-Left
          ctx.beginPath();
          ctx.moveTo(px, py + ph - bracketLen);
          ctx.lineTo(px, py + ph);
          ctx.lineTo(px + bracketLen, py + ph);
          ctx.stroke();

          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(px + pw - bracketLen, py + ph);
          ctx.lineTo(px + pw, py + ph);
          ctx.lineTo(px + pw, py + ph - bracketLen);
          ctx.stroke();

          // Pulsing Anomaly Sweep for Hazards
          if (track.isHazard) {
            const pulseSize = (Math.sin(t * 3) + 1) * 3;
            ctx.strokeStyle = "rgba(244, 63, 94, 0.4)";
            ctx.lineWidth = 1;
            ctx.strokeRect(px - pulseSize, py - pulseSize, pw + pulseSize * 2, ph + pulseSize * 2);
          }

          // Object Label Header Pill (Crisp, minimal, uncluttered)
          const confPct = Math.round(track.confidence * 100);
          const tagStat = showSpeedTags && track.speed >= 15 ? `${Math.round(track.speed)} km/h` : `${confPct}%`;
          const labelText = `${track.label} • ${tagStat}`;

          ctx.font = "bold 9px 'JetBrains Mono', monospace";
          const textMetrics = ctx.measureText(labelText);
          const tagW = textMetrics.width + 10;
          const tagH = 15;

          // Draw Label Background Badge
          ctx.fillStyle = track.isHazard ? "rgba(159, 18, 57, 0.90)" : "rgba(8, 20, 44, 0.88)";
          ctx.fillRect(px, py - tagH - 1, tagW, tagH);

          // Badge Border
          ctx.strokeStyle = track.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py - tagH - 1, tagW, tagH);

          // Status Dot
          ctx.beginPath();
          ctx.arc(px + 5, py - tagH / 2 - 1, 2, 0, Math.PI * 2);
          ctx.fillStyle = track.isHazard ? "#f43f5e" : "#10b981";
          ctx.fill();

          // Text String
          ctx.fillStyle = "#ffffff";
          ctx.fillText(labelText, px + 10, py - 4);

          // Velocity Vector Pointer
          if (showSpeedTags && (track.vx !== 0 || track.vy !== 0)) {
            const centerX = px + pw / 2;
            const centerY = py + ph / 2;
            const arrowLen = Math.min(24, Math.hypot(track.vx, track.vy) * 200);
            const angle = Math.atan2(track.vy, track.vx);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * arrowLen, centerY + Math.sin(angle) * arrowLen);
            ctx.strokeStyle = track.color + "aa";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [aiVisionEnabled, showTrails, showSpeedTags, activeCamera]);

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

  const handleSnapshotCapture = () => {
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 250);

    setSnapshotMsg(`Telemetry Snapshot Synced: ${selectedBus.id} [${cameraAngles.find(c => c.id === activeCamera)?.label}]`);
    setTimeout(() => setSnapshotMsg(null), 3500);

    if (onEventTriggered) {
      onEventTriggered({
        id: `CAP-${Date.now().toString().slice(-4)}`,
        busId: selectedBus.id,
        type: "TELEMETRY_SAMPLE",
        category: "TRAFFIC",
        severity: "LOW",
        title: `Manual Edge Snapshot (${activeCamera.toUpperCase()})`,
        location: `${selectedBus.route.split(":")[0]}, Pune`,
        latitude: selectedBus.latitude,
        longitude: selectedBus.longitude,
        timestamp: "Just now",
        status: "VERIFIED"
      });
    }
  };

  // Video source resolver
  const getCameraVideo = () => {
    if (activeCamera === "cabin" || currentScenario === "cabin_crowd") {
      return "/videos/bus-cabin-passengers.mp4";
    }
    if (currentScenario === "pedestrian" || currentScenario === "zebra_crossing" || activeCamera === "side_left") {
      return "/videos/pedestrian-flow.mp4";
    }
    if (activeCamera === "front") {
      if (frontVideoFeed === "cockpit") return "/videos/bus-cockpit-dashcam.mp4";
      if (frontVideoFeed === "firefly") return "/videos/firefly-360-road.mp4";
      if (frontVideoFeed === "veo") return "/videos/gemini-pothole-bus.mp4";
      return "/videos/road-traffic.mp4";
    }
    if (activeCamera === "side_right" || activeCamera === "rear") {
      return frontVideoFeed === "cockpit" ? "/videos/bus-cockpit-dashcam.mp4" : frontVideoFeed === "firefly" ? "/videos/firefly-360-road.mp4" : "/videos/road-traffic.mp4";
    }
    return "/videos/bus-cockpit-dashcam.mp4";
  };

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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-[var(--te-text)] animate-fade-in-up">
      {/* Page Title & Bus Unit Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 te-card p-5 border-l-4 border-l-[var(--te-lime)]">
        <div>
          <div className="flex items-center gap-2 text-[var(--te-lime)] text-xs font-semibold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 shrink-0 text-[var(--te-lime)]" /> Live Camera Feed & Real-Time Edge Inference
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--te-text)] tracking-tight">
            Multi-Camera Edge AI Telemetry Console
          </h2>
          <p className="text-xs sm:text-sm text-[var(--te-text-muted)] mt-1">
            Real-time Computer Vision (Custom Urban Vision AI + Multi-Object Tracking) running live across public transit bus sensor feeds.
          </p>
        </div>

        {/* Bus Selector */}
        <div className="flex items-center gap-3 bg-[var(--te-panel)] p-2.5 rounded-md border border-[var(--te-border)] shrink-0 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)] shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div className="text-left font-sans">
              <label className="text-[10px] text-[var(--te-text-muted)] uppercase tracking-wider block font-semibold">Active Bus Unit</label>
              <select
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
                className="bg-transparent text-[var(--te-text)] font-extrabold text-xs focus:outline-none cursor-pointer pt-0.5 max-w-[200px] sm:max-w-none"
              >
                {buses.map(b => (
                  <option key={b.id} value={b.id} className="bg-[var(--te-surface)] text-[var(--te-text)]">
                    {b.id} • {b.route.split(":")[0]} ({b.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Camera Switcher Bar & Bus Schematic */}
      <div className="te-card p-3 sm:p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Camera Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar text-xs">
            <span className="text-[11px] text-[var(--te-text-muted)] font-semibold uppercase tracking-wider mr-1 shrink-0 hidden sm:inline">
              Cameras:
            </span>
            {cameraAngles.map(cam => {
              const Icon = cam.icon;
              const isActive = activeCamera === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraChange(cam.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition shrink-0 font-medium ${
                    isActive 
                      ? "bg-[var(--te-lime-bg)] border-[var(--te-lime-border)] text-[var(--te-lime)] font-semibold shadow-sm"
                      : "bg-[var(--te-panel)] border-[var(--te-border)] text-[var(--te-text-muted)] hover:text-[var(--te-text)] hover:bg-[var(--te-panel-hover)]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[var(--te-lime)] animate-pulse" : "text-[var(--te-text-muted)]"}`} />
                  <span>{cam.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Bus Schematic */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5 bg-[var(--te-panel)] px-3 py-1.5 rounded-md border border-[var(--te-border)] text-xs shrink-0">
            <div className="text-[10px] text-[var(--te-text-muted)] font-semibold uppercase">Bus Anatomy:</div>
            <div className="relative flex items-center gap-1 px-2 py-0.5 bg-[var(--te-surface)] rounded border border-[var(--te-border)] text-[9px]">
              {/* Rear */}
              <span className={`w-2 h-2 rounded-full border transition-all ${
                activeCamera === "rear" ? "bg-[var(--te-lime)] border-white scale-125" : "bg-[var(--te-border-strong)] border-[var(--te-border)]"
              }`} title="Rear Camera" />
              {/* Left */}
              <span className={`w-2 h-2 rounded-full border transition-all ${
                activeCamera === "side_left" ? "bg-[var(--te-lime)] border-white scale-125" : "bg-[var(--te-border-strong)] border-[var(--te-border)]"
              }`} title="Left Mirror Camera" />
              {/* Cabin */}
              <span className={`w-2.5 h-2.5 rounded-sm border transition-all flex items-center justify-center text-[7px] font-bold ${
                activeCamera === "cabin" ? "bg-[var(--te-lime)] text-white scale-125" : "bg-[var(--te-panel)] text-[var(--te-text-muted)] border-[var(--te-border)]"
              }`} title="Cabin Camera">C</span>
              {/* Right */}
              <span className={`w-2 h-2 rounded-full border transition-all ${
                activeCamera === "side_right" ? "bg-[var(--te-lime)] border-white scale-125" : "bg-[var(--te-border-strong)] border-[var(--te-border)]"
              }`} title="Right Mirror Camera" />
              {/* Front */}
              <span className={`w-2 h-2 rounded-full border transition-all ${
                activeCamera === "front" ? "bg-[var(--te-lime)] border-white scale-125" : "bg-[var(--te-border-strong)] border-[var(--te-border)]"
              }`} title="Front Windshield Camera" />
            </div>
            <span className="text-[var(--te-lime)] font-semibold text-[10px]">
              {cameraAngles.find(c => c.id === activeCamera)?.angle}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Camera View Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="te-card p-3 sm:p-4 relative overflow-hidden">
            {/* Viewport Telemetry Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[var(--te-panel)] rounded-md mb-3 border border-[var(--te-border)] text-xs">
              <div className="flex items-center gap-2 text-[var(--te-text)]">
                <span className="live-pulse-dot shrink-0"></span>
                <span className="font-bold font-mono-code uppercase">{selectedBus.id}</span>
                <span className="text-[var(--te-text-dim)]">•</span>
                <span className="text-[var(--te-lime)] font-semibold">{cameraAngles.find(c => c.id === activeCamera)?.label}</span>
                <span className="text-[var(--te-text-dim)] hidden sm:inline">|</span>
                <span className="text-[var(--te-text-muted)] text-[11px] hidden sm:inline"><strong className="text-[var(--te-lime)]">{fps} FPS</strong></span>
              </div>

              {/* Real-time Video Controls */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                {/* Front Cam Feed Switcher */}
                {activeCamera === "front" && (
                  <div className="flex items-center gap-1 bg-[var(--te-surface)] p-0.5 rounded border border-[var(--te-border)]">
                    <button
                      onClick={() => setFrontVideoFeed("cockpit")}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        frontVideoFeed === "cockpit"
                          ? "bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)]"
                          : "text-[var(--te-text-muted)] hover:text-[var(--te-text)]"
                      }`}
                      title="Driver Cockpit Dashcam (Vikas Shinde)"
                    >
                      <Film className="w-3 h-3 text-[var(--te-lime)]" />
                      <span>Cockpit</span>
                    </button>

                    <button
                      onClick={() => setFrontVideoFeed("firefly")}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        frontVideoFeed === "firefly"
                          ? "bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)]"
                          : "text-[var(--te-text-muted)] hover:text-[var(--te-text)]"
                      }`}
                      title="360° Continuous Road Camera Feed"
                    >
                      <Film className="w-3 h-3 text-[var(--te-lime)]" />
                      <span>360° AI</span>
                    </button>

                    <button
                      onClick={() => setFrontVideoFeed("veo")}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        frontVideoFeed === "veo"
                          ? "bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)]"
                          : "text-[var(--te-text-muted)] hover:text-[var(--te-text)]"
                      }`}
                      title="Google Veo AI Municipal Bus Dashcam"
                    >
                      <Film className="w-3 h-3 text-[var(--te-lime)]" />
                      <span>Veo Bus</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setAiVisionEnabled(!aiVisionEnabled)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold transition ${
                    aiVisionEnabled
                      ? "bg-[var(--te-lime-bg)] border-[var(--te-lime-border)] text-[var(--te-lime)]"
                      : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text-muted)] hover:text-[var(--te-text)]"
                  }`}
                  title="Toggle Computer Vision Detection Layer"
                >
                  <ScanLine className="w-3 h-3" />
                  <span>Vision: {aiVisionEnabled ? "ON" : "OFF"}</span>
                </button>

                <button
                  onClick={() => setShowTrails(!showTrails)}
                  className={`px-2 py-0.5 rounded border text-[10px] font-semibold transition hidden sm:inline-block ${
                    showTrails
                      ? "bg-[var(--te-lime-bg)] border-[var(--te-lime-border)] text-[var(--te-lime)]"
                      : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text-muted)]"
                  }`}
                  title="Toggle Object Motion Trails"
                >
                  Trails
                </button>

                <button
                  onClick={handleSnapshotCapture}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--te-lime-bg)] hover:bg-[var(--te-lime-border)] border border-[var(--te-lime-border)] text-[var(--te-lime)] text-[10px] font-semibold transition"
                  title="Capture Instant Edge Telemetry Snapshot"
                >
                  <Zap className="w-3 h-3 text-[var(--te-lime)]" />
                  <span>Capture</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Camera Viewport with Real-Time Canvas Overlay */}
            <div 
              ref={containerRef}
              className="relative w-full aspect-video bg-black rounded-md overflow-hidden border border-[var(--te-border)] shadow flex items-center justify-center group select-none"
            >
              {/* Background Live Video Stream */}
              <video
                ref={videoRef}
                key={`${activeCamera}-${currentScenario}-${frontVideoFeed}`}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-85 scale-105 pointer-events-none"
                poster={getCameraBg()}
              >
                <source src={getCameraVideo()} type="video/mp4" />
              </video>

              {/* Real-time Computer Vision Tracking Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              />

              {/* ANPR Camera Laser Scan Line */}
              <div className="anpr-scan-line z-20"></div>

              {/* Camera Shutter Snapshot Flash Effect */}
              {snapshotFlash && (
                <div className="absolute inset-0 bg-white/80 pointer-events-none z-40 transition-opacity duration-200"></div>
              )}

              {/* Notification Toast for Snapshot */}
              {snapshotMsg && (
                <div className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 bg-black/90 border border-[var(--te-lime)] text-white px-3 sm:px-4 py-1.5 rounded font-mono-code text-xs shadow-2xl flex items-center gap-2 z-30 max-w-[90%] text-center">
                  <CheckCircle2 className="w-4 h-4 text-[var(--te-lime)] shrink-0" />
                  <span>{snapshotMsg}</span>
                </div>
              )}

              {/* Top-Left Sleek HUD Pill */}
              <div className="absolute top-2.5 left-2.5 font-mono-code text-[10px] text-white bg-black/80 px-2.5 py-1 rounded border border-white/20 backdrop-blur shadow flex items-center gap-1.5 z-20">
                <span className="w-2 h-2 rounded-full bg-[var(--te-lime)] animate-pulse" />
                <span className="font-bold text-white uppercase">{selectedBus.id}</span>
                <span className="text-white/40">|</span>
                <span>{fps} FPS</span>
              </div>

              {/* Top-Right Sleek Model Pill */}
              <div className="absolute top-2.5 right-2.5 font-sans text-[10px] bg-black/80 px-2.5 py-1 rounded border border-white/20 text-white backdrop-blur shadow flex items-center gap-1.5 z-20">
                <span className="text-white/70 hidden sm:inline">Urban Vision AI</span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-[var(--te-lime)] font-semibold uppercase">{currentScenario.replace("_", " ")}</span>
              </div>

              {/* Source Badge (Bottom Left) */}
              <div className="absolute bottom-2.5 left-2.5 z-20 bg-black/80 px-2.5 py-1 rounded border border-white/20 text-[10px] font-sans text-white flex items-center gap-1.5 backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--te-lime)] animate-pulse" />
                <span>{activeCamera === "cabin" ? "Interior Cabin Cam" : activeCamera === "front" && frontVideoFeed === "cockpit" ? "Driver Cockpit" : activeCamera === "front" && frontVideoFeed === "firefly" ? "360° Road Cam" : activeCamera === "front" && frontVideoFeed === "veo" ? "Veo AI Bus Cam" : `${activeCamera.toUpperCase()}`}</span>
              </div>

              {/* ANPR Reader Box Overlay */}
              {(currentScenario === "rash_driving" || detectionState.event?.registrationNumber) && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-black/90 border border-rose-500 px-4 py-2 rounded backdrop-blur shadow-xl flex items-center gap-3 z-20 max-w-[95%]">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <div className="font-mono-code text-left text-xs">
                    <div className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">ANPR Plate Extracted</div>
                    <div className="text-sm font-bold text-white">
                      REG: <span className="text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-500/50">MH12 AB 1234</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Real-Time Telemetry Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 font-sans text-xs">
              <div className="p-3 rounded bg-[var(--te-panel)] border border-[var(--te-border)]">
                <div className="text-[var(--te-text-muted)] text-[10px] uppercase font-semibold">Active Dynamic Tracks</div>
                <div className="text-lg font-extrabold text-[var(--te-text)] flex items-center gap-1.5 mt-0.5">
                  <Car className="w-4 h-4 text-[var(--te-lime)] shrink-0" /> {tracksRef.current.length || 3} Tracks
                </div>
              </div>

              <div className="p-3 rounded bg-[var(--te-panel)] border border-[var(--te-border)]">
                <div className="text-[var(--te-text-muted)] text-[10px] uppercase font-semibold">Passengers / Commuters</div>
                <div className="text-lg font-extrabold text-[var(--te-text)] flex items-center gap-1.5 mt-0.5">
                  <Users className="w-4 h-4 text-[var(--te-amber)] shrink-0" /> {activeCamera === "cabin" ? "48 / 40" : "2 Crosswalk"}
                </div>
              </div>

              <div className="p-3 rounded bg-[var(--te-panel)] border border-[var(--te-border)]">
                <div className="text-[var(--te-text-muted)] text-[10px] uppercase font-semibold">Traffic Density</div>
                <div className={`text-lg font-extrabold mt-0.5 ${
                  detectionState.traffic_density === "SEVERE" ? "text-rose-600 dark:text-rose-400" :
                  detectionState.traffic_density === "HIGH" ? "text-[var(--te-amber)]" :
                  "text-[var(--te-lime)]"
                }`}>
                  {detectionState.traffic_density || "MEDIUM"}
                </div>
              </div>

              <div className="p-3 rounded bg-[var(--te-panel)] border border-[var(--te-border)]">
                <div className="text-[var(--te-text-muted)] text-[10px] uppercase font-semibold">Edge Inference</div>
                <div className="text-lg font-extrabold text-[var(--te-lime)] flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--te-lime)] shrink-0" /> 97.4% Local
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Scenario Control Triggers (Right Column) */}
        <div className="space-y-4 font-sans">
          <div className="te-card p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--te-border)] pb-3">
              <h3 className="text-xs sm:text-sm font-bold text-[var(--te-text)] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[var(--te-lime)] shrink-0" /> Problem Statement 26124 Scenarios
              </h3>
              <span className="text-[10px] bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)] px-2 py-0.5 rounded font-semibold shrink-0">
                SIH TRIGGERS
              </span>
            </div>

            <div className="space-y-2.5 max-h-[480px] lg:max-h-[580px] overflow-y-auto pr-1">
              {/* Category: Traffic & Road Hazards */}
              <div className="text-[10px] font-semibold text-[var(--te-text-muted)] uppercase tracking-wider pt-1">
                Road Defect Sensing (Onboard AI):
              </div>

              {/* Pothole */}
              <button
                onClick={() => handleTriggerScenario("pothole", "front")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "pothole"
                    ? "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Pothole Defect (Front)</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Deep asphalt crater detection & telemetry</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              </button>

              {/* Missing Zebra Crossing */}
              <button
                onClick={() => handleTriggerScenario("zebra_crossing", "side_left")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "zebra_crossing"
                    ? "bg-[var(--te-lime-bg)] border-[var(--te-lime-border)] text-[var(--te-lime)] font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[var(--te-lime-bg)] flex items-center justify-center text-[var(--te-lime)] border border-[var(--te-lime-border)] shrink-0">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Faded Zebra Crossing (Side)</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Crosswalk marking degradation in school zone</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-[var(--te-lime)] shrink-0" />
              </button>

              {/* Broken Divider */}
              <button
                onClick={() => handleTriggerScenario("missing_divider", "side_right")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "missing_divider"
                    ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Missing Road Divider</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Median gap & illegal U-turn hazard</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </button>

              {/* Damaged Signboard */}
              <button
                onClick={() => handleTriggerScenario("signboard_defect", "front")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "signboard_defect"
                    ? "bg-[var(--te-lime-bg)] border-[var(--te-lime-border)] text-[var(--te-lime)] font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[var(--te-lime-bg)] flex items-center justify-center text-[var(--te-lime)] border border-[var(--te-lime-border)] shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Damaged Signboard</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Twisted 40 km/h speed limit sign</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-[var(--te-lime)] shrink-0" />
              </button>

              {/* Waterlogging */}
              <button
                onClick={() => handleTriggerScenario("waterlogging", "front")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "waterlogging"
                    ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Severe Waterlogging</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Submerged lane at underpass (14cm)</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </button>

              {/* Category: Traffic Management & Incidents */}
              <div className="text-[10px] font-semibold text-[var(--te-text-muted)] uppercase tracking-wider pt-2">
                Enforcement & Safety:
              </div>

              {/* Rash Driving + ANPR */}
              <button
                onClick={() => handleTriggerScenario("rash_driving", "rear")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "rash_driving"
                    ? "bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shrink-0">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Rash Driving & ANPR</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Tailgating plate extraction: MH12 AB 1234</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              </button>

              {/* Pedestrian */}
              <button
                onClick={() => handleTriggerScenario("pedestrian", "front")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "pedestrian"
                    ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Pedestrian Hazard</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Roadway crossing proximity warning</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </button>

              {/* Cabin Overcrowding */}
              <button
                onClick={() => handleTriggerScenario("cabin_crowd", "cabin")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "cabin_crowd"
                    ? "bg-[var(--te-lime-bg)] border-[var(--te-lime-border)] text-[var(--te-lime)] font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[var(--te-lime-bg)] flex items-center justify-center text-[var(--te-lime)] border border-[var(--te-lime-border)] shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Cabin Overcrowding</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Footboard & open-door commuter hazard</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-[var(--te-lime)] shrink-0" />
              </button>

              {/* Reset to Normal */}
              <button
                onClick={() => handleTriggerScenario("normal", "front")}
                disabled={loadingScenario}
                className={`w-full p-2.5 rounded-md border text-left text-xs transition flex items-center justify-between group ${
                  currentScenario === "normal"
                    ? "bg-[var(--te-lime-bg)] border-[var(--te-lime-border)] text-[var(--te-lime)] font-semibold"
                    : "bg-[var(--te-surface)] border-[var(--te-border)] text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[var(--te-lime-bg)] flex items-center justify-center text-[var(--te-lime)] border border-[var(--te-lime-border)] shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[var(--te-text)]">Normal Traffic Routine</div>
                    <div className="text-[10px] text-[var(--te-text-muted)] font-normal">Standard steady-state edge inference</div>
                  </div>
                </div>
                <Play className="w-3.5 h-3.5 text-[var(--te-text-muted)] shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
