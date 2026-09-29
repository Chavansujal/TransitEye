// Real-Time Frame Trajectories for Edge ML Video Streams
// Synchronized to HTML5 video.currentTime with 60FPS Hermite/Linear Interpolation

export const MODEL_TRAJECTORIES = {
  // Model 1: Pothole & Road Surface Deterioration
  pothole: [
    {
      id: "POT-101",
      class_name: "severe_pothole",
      label: "POTHOLE DEFECT (96%)",
      color: "emerald",
      accentHex: "#10b981",
      badge: "CRITICAL 14.2cm",
      track_id: "#TRK-01",
      keyframes: [
        { t: 0.0, x: 41, y: 35, w: 16, h: 15, conf: 0.96, metric: "Depth: 12.8cm • 3.2G" },
        { t: 1.2, x: 40, y: 39, w: 18, h: 17, conf: 0.97, metric: "Depth: 13.5cm • 3.4G" },
        { t: 2.4, x: 39, y: 46, w: 21, h: 19, conf: 0.98, metric: "Depth: 14.2cm • 3.8G" },
        { t: 3.6, x: 38, y: 56, w: 25, h: 22, conf: 0.98, metric: "Depth: 14.9cm • 4.1G" },
        { t: 4.8, x: 36, y: 68, w: 29, h: 25, conf: 0.96, metric: "Depth: 15.3cm • 4.2G" },
        { t: 6.0, x: 34, y: 84, w: 34, h: 28, conf: 0.94, metric: "Depth: 15.8cm • 4.4G" }
      ]
    },
    {
      id: "POT-102",
      class_name: "road_crack",
      label: "SURFACE EROSION (91%)",
      color: "amber",
      accentHex: "#f59e0b",
      badge: "EROSION 5.8cm",
      track_id: "#TRK-02",
      keyframes: [
        { t: 0.0, x: 55, y: 34, w: 15, h: 14, conf: 0.90, metric: "Longitudinal Fissure" },
        { t: 1.5, x: 57, y: 42, w: 17, h: 16, conf: 0.92, metric: "Sub-base Degradation" },
        { t: 3.0, x: 59, y: 52, w: 20, h: 18, conf: 0.93, metric: "Asphalt Spalling" },
        { t: 4.5, x: 62, y: 64, w: 23, h: 21, conf: 0.94, metric: "Active Breakup Area" },
        { t: 6.0, x: 66, y: 78, w: 27, h: 24, conf: 0.92, metric: "Wheel Path Fissure" }
      ]
    },
    {
      id: "POT-103",
      class_name: "road_cavity",
      label: "ROAD CAVITY (88%)",
      color: "emerald",
      accentHex: "#10b981",
      badge: "CAVITY 9.5cm",
      track_id: "#TRK-03",
      keyframes: [
        { t: 0.0, x: 49, y: 22, w: 10, h: 9, conf: 0.86, metric: "Pavement Cavity" },
        { t: 1.8, x: 48, y: 30, w: 13, h: 11, conf: 0.90, metric: "Depth 9.5cm" },
        { t: 3.5, x: 46, y: 42, w: 16, h: 14, conf: 0.93, metric: "Depth 11.2cm" },
        { t: 5.2, x: 43, y: 58, w: 21, h: 18, conf: 0.95, metric: "Severe Rim Risk" },
        { t: 6.0, x: 40, y: 72, w: 26, h: 22, conf: 0.93, metric: "Severe Impact" }
      ]
    },
    {
      id: "POT-104",
      class_name: "lateral_defect",
      label: "LATERAL FAULT (89%)",
      color: "cyan",
      accentHex: "#06b6d4",
      badge: "FAULT 6.2cm",
      track_id: "#TRK-04",
      keyframes: [
        { t: 1.5, x: 24, y: 42, w: 14, h: 12, conf: 0.88, metric: "Lateral Joint Fracture" },
        { t: 3.2, x: 20, y: 54, w: 17, h: 15, conf: 0.92, metric: "Moisture Penetration" },
        { t: 5.0, x: 14, y: 70, w: 21, h: 18, conf: 0.94, metric: "Edge Breakaway" },
        { t: 6.0, x: 8, y: 84, w: 24, h: 20, conf: 0.90, metric: "Curb Separation" }
      ]
    }
  ],

  // Model 2: Incident & Collision Tracker
  incident: [
    {
      id: "INC-201",
      class_name: "accident_collision",
      label: "💥 JACKKNIFED SEMI-TRUCK (98%)",
      color: "rose",
      accentHex: "#f43f5e",
      badge: "COLLISION",
      track_id: "#TRK-88",
      keyframes: [
        { t: 0.0, x: 38, y: 26, w: 56, h: 20, conf: 0.98, metric: "CHASSIS OVERTURN • MEDIAN" },
        { t: 3.0, x: 38.5, y: 26.2, w: 55.8, h: 20, conf: 0.98, metric: "TRAILER JACKKNIFED" },
        { t: 6.0, x: 39, y: 26.5, w: 55.5, h: 20.2, conf: 0.99, metric: "STRUCTURAL FRAME COMPROMISE" },
        { t: 9.0, x: 38.5, y: 26.2, w: 55.8, h: 20, conf: 0.98, metric: "LANES 1-2 BLOCKED" },
        { t: 11.6, x: 38, y: 26, w: 56, h: 20, conf: 0.98, metric: "ACTIVE SCENE • EMERGENCY RESP" }
      ]
    },
    {
      id: "INC-202",
      class_name: "hazmat_spill",
      label: "🚨 HAZMAT DIESEL SLICK (96%)",
      color: "amber",
      accentHex: "#f59e0b",
      badge: "DIESEL SPILL",
      track_id: "#TRK-89",
      keyframes: [
        { t: 0.0, x: 33, y: 11, w: 15, h: 15, conf: 0.95, metric: "FLAMMABLE FUEL BREACH" },
        { t: 4.0, x: 33.5, y: 11.2, w: 15.5, h: 15.5, conf: 0.96, metric: "EXPANDING HYDROCARBON SLICK" },
        { t: 8.0, x: 34, y: 11.5, w: 16, h: 16, conf: 0.97, metric: "SURFACE TRACTION RATING: 0.12" },
        { t: 11.6, x: 34.5, y: 11.8, w: 16.5, h: 16.5, conf: 0.96, metric: "FIRE RISK ZONE DEPLOYED" }
      ]
    },
    {
      id: "INC-203",
      class_name: "passing_vehicle_1",
      label: "PASSING PICKUP (95%)",
      color: "emerald",
      accentHex: "#10b981",
      badge: "58 km/h",
      track_id: "#TRK-90",
      keyframes: [
        { t: 0.0, x: 8, y: 62, w: 14, h: 11, conf: 0.93, metric: "56 km/h • Lane 3 Diverting" },
        { t: 2.5, x: 26, y: 62, w: 14, h: 11, conf: 0.95, metric: "58 km/h • Safe Clearance" },
        { t: 5.5, x: 48, y: 62, w: 14, h: 11, conf: 0.96, metric: "59 km/h • Rubbernecking Decel" },
        { t: 8.5, x: 70, y: 62, w: 14, h: 11, conf: 0.95, metric: "61 km/h • Accelerating Clear" },
        { t: 11.6, x: 92, y: 62, w: 14, h: 11, conf: 0.93, metric: "63 km/h • Free Corridor" }
      ]
    },
    {
      id: "INC-204",
      class_name: "passing_vehicle_2",
      label: "PASSING SEDAN (96%)",
      color: "emerald",
      accentHex: "#10b981",
      badge: "62 km/h",
      track_id: "#TRK-91",
      keyframes: [
        { t: 0.5, x: 4, y: 78, w: 13, h: 10, conf: 0.92, metric: "60 km/h • Outer Lane" },
        { t: 3.5, x: 27, y: 78, w: 13, h: 10, conf: 0.95, metric: "62 km/h • Proximity 14m" },
        { t: 6.5, x: 50, y: 78, w: 13, h: 10, conf: 0.97, metric: "63 km/h • Proximity 18m" },
        { t: 9.5, x: 73, y: 78, w: 13, h: 10, conf: 0.95, metric: "64 km/h • Passing Accident" },
        { t: 11.6, x: 90, y: 78, w: 13, h: 10, conf: 0.94, metric: "66 km/h • Clear Velocity" }
      ]
    }
  ],

  // Model 3: Urban Waterlogging & Flooding Hazard
  waterlogging: [
    {
      id: "WAT-301",
      class_name: "commuter_risk",
      label: "COMMUTER RISK (97%)",
      color: "cyan",
      accentHex: "#06b6d4",
      badge: "DEPTH > 18cm",
      track_id: "#TRK-44",
      keyframes: [
        { t: 0.0, x: 54, y: 20, w: 42, h: 24, conf: 0.97, metric: "Depth: 18.2cm • Commuter Transit" },
        { t: 4.5, x: 48, y: 21, w: 43, h: 24, conf: 0.98, metric: "Depth: 19.5cm • Submerged Exhaust" },
        { t: 9.5, x: 41, y: 22, w: 44, h: 25, conf: 0.98, metric: "Depth: 20.8cm • High Drag" },
        { t: 14.5, x: 33, y: 24, w: 45, h: 25, conf: 0.97, metric: "Depth: 21.6cm • Wave Wake" },
        { t: 19.5, x: 25, y: 26, w: 46, h: 26, conf: 0.96, metric: "Depth: 22.1cm • Engine Stall Risk" },
        { t: 24.5, x: 17, y: 28, w: 47, h: 27, conf: 0.95, metric: "Depth: 20.5cm • Reaching Incline" },
        { t: 29.6, x: 9, y: 30, w: 48, h: 27, conf: 0.94, metric: "Depth: 19.2cm • Exiting Floodway" }
      ]
    },
    {
      id: "WAT-302",
      class_name: "submerged_vehicle_rickshaw",
      label: "SUBMERGED AUTO-RICKSHAW (95%)",
      color: "amber",
      accentHex: "#f59e0b",
      badge: "SUBMERGED 28cm",
      track_id: "#TRK-45",
      keyframes: [
        { t: 0.0, x: 4, y: 6, w: 44, h: 26, conf: 0.95, metric: "Immersed Cabin • Hydrostatic Stall" },
        { t: 10.0, x: 4.2, y: 6.2, w: 43.8, h: 26, conf: 0.96, metric: "Water Level Above Floorboard" },
        { t: 20.0, x: 4.5, y: 6.4, w: 43.6, h: 26.2, conf: 0.96, metric: "Stationary Road Obstacle" },
        { t: 29.6, x: 4.2, y: 6.2, w: 44, h: 26, conf: 0.95, metric: "Stranded Transit Unit" }
      ]
    },
    {
      id: "WAT-303",
      class_name: "submerged_car_foreground",
      label: "FLOOD REACHING SILL (93%)",
      color: "cyan",
      accentHex: "#06b6d4",
      badge: "AQUAPLANING",
      track_id: "#TRK-46",
      keyframes: [
        { t: 0.0, x: 4, y: 50, w: 90, h: 46, conf: 0.93, metric: "Wheel Hubs 100% Submerged" },
        { t: 15.0, x: 4.2, y: 50.2, w: 89.6, h: 45.8, conf: 0.94, metric: "Underbody Corrosion Threat" },
        { t: 29.6, x: 4, y: 50, w: 90, h: 46, conf: 0.93, metric: "Drainage Backflow Hazard" }
      ]
    }
  ],

  // Model 4: ANPR HSRP License Plate Localizer & OCR
  anpr: [
    {
      id: "ANPR-401",
      class_name: "license_plate_truck",
      label: "COMMERCIAL TRUCK (98%)",
      color: "amber",
      accentHex: "#f59e0b",
      badge: "TN 76 AB 7224",
      plate_text: "TN 76 AB 7224",
      track_id: "#ANPR-01",
      keyframes: [
        { t: 0.0, x: 68, y: 2, w: 30, h: 28, conf: 0.97, metric: "OCR Lock 97.4% • 68 km/h" },
        { t: 5.0, x: 65, y: 4, w: 32, h: 30, conf: 0.98, metric: "OCR Lock 98.2% • 69 km/h" },
        { t: 10.0, x: 62, y: 6, w: 35, h: 32, conf: 0.99, metric: "OCR Lock 99.0% • 71 km/h" },
        { t: 15.0, x: 58, y: 8, w: 38, h: 35, conf: 0.99, metric: "OCR Lock 99.4% • 72 km/h" },
        { t: 20.0, x: 55, y: 6, w: 36, h: 33, conf: 0.98, metric: "OCR Lock 98.6% • 70 km/h" },
        { t: 26.5, x: 51, y: 4, w: 33, h: 30, conf: 0.97, metric: "OCR Lock 97.8% • 68 km/h" }
      ]
    },
    {
      id: "ANPR-402",
      class_name: "license_plate_overtaking",
      label: "TARGET VEHICLE (96%)",
      color: "blue",
      accentHex: "#3b82f6",
      badge: "MH 12 QX 4920",
      plate_text: "MH 12 QX 4920",
      track_id: "#ANPR-02",
      keyframes: [
        { t: 2.0, x: 18, y: 16, w: 18, h: 20, conf: 0.93, metric: "Approaching Flank • 76 km/h" },
        { t: 6.0, x: 12, y: 22, w: 22, h: 24, conf: 0.96, metric: "HSRP Verified • 80 km/h" },
        { t: 10.0, x: 4, y: 28, w: 25, h: 28, conf: 0.95, metric: "Overtaking Corridor • 84 km/h" },
        { t: 13.0, x: 0, y: 35, w: 28, h: 30, conf: 0.92, metric: "Corridor Passed" }
      ]
    },
    {
      id: "ANPR-403",
      class_name: "commercial_hauler",
      label: "HEAVY HAULER (95%)",
      color: "emerald",
      accentHex: "#10b981",
      badge: "AP 09 OF 1111",
      plate_text: "AP 09 OF 1111",
      track_id: "#ANPR-03",
      keyframes: [
        { t: 13.5, x: 28, y: 10, w: 19, h: 21, conf: 0.92, metric: "Distance 42m • 78 km/h" },
        { t: 18.0, x: 22, y: 16, w: 23, h: 25, conf: 0.96, metric: "Distance 28m • 82 km/h" },
        { t: 22.5, x: 15, y: 22, w: 27, h: 28, conf: 0.97, metric: "Distance 18m • 86 km/h" },
        { t: 26.5, x: 8, y: 28, w: 30, h: 31, conf: 0.94, metric: "Safe Clearance Maintained" }
      ]
    }
  ],

  // Model 5: COCO General Multi-Class Fleet Vision
  coco: [
    {
      id: "COCO-501",
      class_name: "truck",
      label: "TRUCK (96%)",
      color: "blue",
      accentHex: "#3b82f6",
      badge: "44 km/h",
      track_id: "#COCO-11",
      keyframes: [
        { t: 0.0, x: 36, y: 32, w: 32, h: 38, conf: 0.95, metric: "Lane 2 • Velocity 44 km/h" },
        { t: 7.5, x: 38, y: 33, w: 31, h: 37, conf: 0.96, metric: "Lane 2 • Velocity 45 km/h" },
        { t: 15.0, x: 35, y: 31, w: 33, h: 39, conf: 0.97, metric: "Lane 2 • Velocity 46 km/h" },
        { t: 22.5, x: 37, y: 34, w: 31, h: 36, conf: 0.96, metric: "Lane 2 • Velocity 44 km/h" },
        { t: 30.2, x: 36, y: 32, w: 32, h: 38, conf: 0.95, metric: "Lane 2 • Velocity 45 km/h" }
      ]
    },
    {
      id: "COCO-502",
      class_name: "car",
      label: "CAR (97%)",
      color: "emerald",
      accentHex: "#10b981",
      badge: "52 km/h",
      track_id: "#COCO-12",
      keyframes: [
        { t: 0.0, x: 12, y: 48, w: 22, h: 28, conf: 0.96, metric: "Lane 1 • Distance 12m" },
        { t: 7.5, x: 14, y: 46, w: 23, h: 29, conf: 0.97, metric: "Lane 1 • Distance 11m" },
        { t: 15.0, x: 11, y: 50, w: 21, h: 27, conf: 0.98, metric: "Lane 1 • Distance 14m" },
        { t: 22.5, x: 13, y: 47, w: 22, h: 28, conf: 0.96, metric: "Lane 1 • Distance 12m" },
        { t: 30.2, x: 12, y: 48, w: 22, h: 28, conf: 0.97, metric: "Lane 1 • Distance 13m" }
      ]
    },
    {
      id: "COCO-503",
      class_name: "traffic_light",
      label: "SIGNAL: GREEN (99%)",
      color: "emerald",
      accentHex: "#10b981",
      badge: "TRANSIT PRIORITY",
      track_id: "#COCO-13",
      keyframes: [
        { t: 0.0, x: 74, y: 12, w: 8, h: 18, conf: 0.99, metric: "Phase Active: 18s Remaining" },
        { t: 15.0, x: 74, y: 12, w: 8, h: 18, conf: 0.99, metric: "V2X Transit Green Wave" },
        { t: 30.2, x: 74, y: 12, w: 8, h: 18, conf: 0.99, metric: "Clear Passage Granted" }
      ]
    }
  ]
};

// Interpolation Engine: computes box [x, y, w, h, conf] at exact timestamp `time`
export function getActiveTrajectories(modelName, currentTime, threshold = 0.40) {
  const tracks = MODEL_TRAJECTORIES[modelName] || MODEL_TRAJECTORIES.pothole;
  const activeBoxes = [];

  for (const track of tracks) {
    const kfs = track.keyframes;
    if (!kfs || kfs.length === 0) continue;

    const firstT = kfs[0].t;
    const lastT = kfs[kfs.length - 1].t;

    // Skip if current time is before entry or after exit
    if (currentTime < firstT || currentTime > lastT) continue;

    // Find bounding keyframe interval [k0, k1]
    let k0 = kfs[0];
    let k1 = kfs[kfs.length - 1];

    for (let i = 0; i < kfs.length - 1; i++) {
      if (currentTime >= kfs[i].t && currentTime <= kfs[i + 1].t) {
        k0 = kfs[i];
        k1 = kfs[i + 1];
        break;
      }
    }

    const span = k1.t - k0.t;
    const ratio = span > 0 ? (currentTime - k0.t) / span : 0;
    // Smooth cosine ease for human vehicle / camera motion
    const ease = (1 - Math.cos(ratio * Math.PI)) / 2;

    const x = k0.x + (k1.x - k0.x) * ease;
    const y = k0.y + (k1.y - k0.y) * ease;
    const w = k0.w + (k1.w - k0.w) * ease;
    const h = k0.h + (k1.h - k0.h) * ease;
    const conf = k0.conf + (k1.conf - k0.conf) * ease;

    // Filter by user's confidence threshold
    if (conf < threshold) continue;

    activeBoxes.push({
      id: track.id,
      track_id: track.track_id,
      label: track.label,
      class_name: track.class_name,
      badge: track.badge,
      plate_text: track.plate_text,
      color: track.color,
      accentHex: track.accentHex,
      metric: ratio > 0.5 ? k1.metric : k0.metric,
      box: {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        w: Number(w.toFixed(2)),
        h: Number(h.toFixed(2))
      },
      conf: Number(conf.toFixed(2))
    });
  }

  return activeBoxes;
}
