import time
import copy

class DataStore:
    def __init__(self):
        self.init_data()

    def init_data(self):
        self.buses = [
            {
                "id": "BUS-101",
                "route": "Route 17: Pune Station -> Swargate",
                "latitude": 18.5185,
                "longitude": 73.8682,
                "speed": 32,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Normal Traffic",
                "trafficDensity": "MEDIUM",
                "driver": "Rajesh Kumar",
                "edgeStats": {"processed": 98.2, "transmitted": 1.8}
            },
            {
                "id": "BUS-102",
                "route": "Route 24: Kothrud -> Viman Nagar",
                "latitude": 18.5241,
                "longitude": 73.8425,
                "speed": 28,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Normal Traffic",
                "trafficDensity": "LOW",
                "driver": "Sanjay Patil",
                "edgeStats": {"processed": 97.5, "transmitted": 2.5}
            },
            {
                "id": "BUS-103",
                "route": "Route 42: Katraj -> Shivajinagar",
                "latitude": 18.4952,
                "longitude": 73.8521,
                "speed": 35,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Pothole Logged",
                "trafficDensity": "MEDIUM",
                "driver": "Amit Deshmukh",
                "edgeStats": {"processed": 96.8, "transmitted": 3.2}
            },
            {
                "id": "BUS-104",
                "route": "Route 38: Sinhagad Road -> Deccan",
                "latitude": 18.4862,
                "longitude": 73.8324,
                "speed": 14,
                "status": "INCIDENT",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Rash Driving / ANPR Trigger",
                "trafficDensity": "SEVERE",
                "driver": "Vikas Shinde",
                "edgeStats": {"processed": 95.4, "transmitted": 4.6}
            },
            {
                "id": "BUS-105",
                "route": "Route 105: Hadapsar -> Hinjewadi Phase 1",
                "latitude": 18.5623,
                "longitude": 73.7854,
                "speed": 42,
                "status": "LOW NETWORK",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Road Debris",
                "trafficDensity": "HIGH",
                "driver": "Prakash Pawar",
                "edgeStats": {"processed": 99.1, "transmitted": 0.9}
            },
            {
                "id": "BUS-106",
                "route": "Route 17: Swargate -> Pune Station",
                "latitude": 18.5054,
                "longitude": 73.8641,
                "speed": 22,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Congestion Flagged",
                "trafficDensity": "HIGH",
                "driver": "Ganesh Kadam",
                "edgeStats": {"processed": 97.9, "transmitted": 2.1}
            },
            {
                "id": "BUS-107",
                "route": "Route 24: Viman Nagar -> Kothrud",
                "latitude": 18.5512,
                "longitude": 73.8923,
                "speed": 31,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Normal Traffic",
                "trafficDensity": "LOW",
                "driver": "Rahul More",
                "edgeStats": {"processed": 98.4, "transmitted": 1.6}
            },
            {
                "id": "BUS-108",
                "route": "Route 38: Deccan -> Sinhagad Road",
                "latitude": 18.4981,
                "longitude": 73.8365,
                "speed": 18,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Pothole Defect",
                "trafficDensity": "HIGH",
                "driver": "Sunil Jadhav",
                "edgeStats": {"processed": 96.5, "transmitted": 3.5}
            },
            {
                "id": "BUS-109",
                "route": "Route 42: Shivajinagar -> Katraj",
                "latitude": 18.5298,
                "longitude": 73.8471,
                "speed": 0,
                "status": "OFFLINE",
                "cameraStatus": "DISCONNECTED",
                "lastEvent": "Maintenance Check",
                "trafficDensity": "LOW",
                "driver": "Nitin Gaikwad",
                "edgeStats": {"processed": 0.0, "transmitted": 0.0}
            },
            {
                "id": "BUS-110",
                "route": "Route 105: Hinjewadi -> Hadapsar",
                "latitude": 18.5821,
                "longitude": 73.7495,
                "speed": 40,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Normal Traffic",
                "trafficDensity": "MEDIUM",
                "driver": "Deepak Thorat",
                "edgeStats": {"processed": 98.7, "transmitted": 1.3}
            },
            {
                "id": "BUS-111",
                "route": "Route 17: Pune Station Express",
                "latitude": 18.5255,
                "longitude": 73.8712,
                "speed": 36,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Pedestrian Safety Alert",
                "trafficDensity": "MEDIUM",
                "driver": "Mahesh Bhosale",
                "edgeStats": {"processed": 97.1, "transmitted": 2.9}
            },
            {
                "id": "BUS-112",
                "route": "Route 24: FC Road Shuttle",
                "latitude": 18.5215,
                "longitude": 73.8402,
                "speed": 20,
                "status": "ONLINE",
                "cameraStatus": "ACTIVE",
                "lastEvent": "Normal Traffic",
                "trafficDensity": "HIGH",
                "driver": "Sachin Chavan",
                "edgeStats": {"processed": 98.0, "transmitted": 2.0}
            }
        ]

        self.events = [
            {
                "id": "EVT-90412",
                "type": "Pothole Defect",
                "confidence": 0.94,
                "busId": "BUS-104",
                "latitude": 18.4862,
                "longitude": 73.8324,
                "locationName": "Sinhagad Road, near Rajaram Bridge",
                "timestamp": "2026-09-04T16:10:00Z",
                "severity": "HIGH",
                "details": "Major deep surface asphalt degradation logged by 6 passing buses.",
                "vehicleType": None,
                "registrationNumber": None,
                "status": "UNRESOLVED"
            },
            {
                "id": "EVT-90413",
                "type": "Rash Driving",
                "confidence": 0.97,
                "busId": "BUS-104",
                "latitude": 18.5082,
                "longitude": 73.8361,
                "locationName": "Karve Road Flyover Corridor",
                "timestamp": "2026-09-04T16:25:00Z",
                "severity": "CRITICAL",
                "details": "Speeds exceeded 85km/h in congested urban corridor. Tracked ID #842.",
                "vehicleType": "White SUV",
                "registrationNumber": "MH12 AB 1234",
                "anprConfidence": 0.91,
                "status": "NEW"
            },
            {
                "id": "EVT-90414",
                "type": "Traffic Congestion",
                "confidence": 0.92,
                "busId": "BUS-106",
                "latitude": 18.5021,
                "longitude": 73.8638,
                "locationName": "Swargate Chowk Underpass",
                "timestamp": "2026-09-04T16:32:00Z",
                "severity": "HIGH",
                "details": "42 stationary vehicles identified. Average bus delay +14 minutes.",
                "vehicleType": None,
                "registrationNumber": None,
                "status": "ACTIVE"
            },
            {
                "id": "EVT-90415",
                "type": "Pedestrian Hazard",
                "confidence": 0.95,
                "busId": "BUS-111",
                "latitude": 18.5221,
                "longitude": 73.8415,
                "locationName": "FC Road near Goodluck Chowk",
                "timestamp": "2026-09-04T16:40:00Z",
                "severity": "MEDIUM",
                "details": "Pedestrians stepping into traffic lane due to obstructed pavement.",
                "vehicleType": None,
                "registrationNumber": None,
                "status": "LOGGED"
            }
        ]

        self.incidents = [
            {
                "id": "INC-701",
                "type": "Rash Driving & Speed Violation",
                "vehicle": "White Sedan (Toyota Corolla)",
                "registrationNumber": "TN 76 AB 7224",
                "anprConfidence": 0.94,
                "busId": "BUS-104",
                "location": "Karve Road Flyover Corridor",
                "latitude": 18.5082,
                "longitude": 73.8361,
                "timestamp": "2026-09-04T16:25:00Z",
                "severity": "CRITICAL",
                "status": "NEW",
                "evidenceImage": "/outputs/snapshots/test_forensic_snap.jpg",
                "plateImage": "/outputs/snapshots/plate_tn76ab7224.jpg",
                "violationCode": "MVA Sec 184 (Dangerous & Reckless Driving)",
                "fineAmount": "₹5,000 Fine & License Endorsement",
                "details": "Automated AI Edge Detection: High-velocity erratic lane switching without indicator signaling; severe proximity breach to public transit corridor at 94 km/h.",
                "telemetry": {
                    "t0_label": "T0 • Approach Velocity",
                    "t0_val": "Speed: 94 km/h (+34 km/h Above Urban Limit)",
                    "t0_sensor": "Rear Radar Sensor",
                    "t1_label": "T1 • Anomaly Event",
                    "t1_val": "Erratic Multi-Lane Swerving & Cut-In",
                    "t1_sensor": "Side Cam Dynamic Tracking",
                    "t2_label": "T2 • ANPR Locked",
                    "t2_val": "TN 76 AB 7224",
                    "t2_sensor": "Dual-Stage RF-DETR + OCR (94% Match)"
                }
            },
            {
                "id": "INC-702",
                "type": "Crash Collision & Overturn",
                "vehicle": "Heavy Commercial Semi-Truck",
                "registrationNumber": "AP 09 OF 1111",
                "anprConfidence": 0.97,
                "busId": "BUS-105",
                "location": "Hinjewadi Phase 1 Bypass",
                "latitude": 18.5815,
                "longitude": 73.7482,
                "timestamp": "2026-09-04T15:10:00Z",
                "severity": "CRITICAL",
                "status": "NEW",
                "evidenceImage": "/outputs/snapshots/test_truck_crash_snap.jpg",
                "plateImage": "/outputs/snapshots/plate_ap09of1111.jpg",
                "violationCode": "MVA Sec 134 / Sec 184 (Major Collision Obstruction)",
                "fineAmount": "Court Summon / Impound",
                "details": "Automated AI Edge Detection: Jackknifed semi-trailer structural rollover detected across transit lanes. Rapid deceleration from 68 km/h to 0 km/h with 7.4G kinetic impact force.",
                "telemetry": {
                    "t0_label": "T0 • Approach Velocity",
                    "t0_val": "Speed: 68 km/h (Emergency Decel -7.9 m/s²)",
                    "t0_sensor": "Forward Radar",
                    "t1_label": "T1 • Anomaly Event",
                    "t1_val": "Jackknife Collision & Rollover (7.4G Impact)",
                    "t1_sensor": "360° Optical Telemetry",
                    "t2_label": "T2 • ANPR Locked",
                    "t2_val": "AP 09 OF 1111",
                    "t2_sensor": "Dual-Stage RF-DETR + OCR (97% Match)"
                }
            },
            {
                "id": "INC-703",
                "type": "Illegal Parking in Bus Lane",
                "vehicle": "Commercial Delivery Van",
                "registrationNumber": "MH 12 KP 5511",
                "anprConfidence": 0.95,
                "busId": "BUS-101",
                "location": "Laxmi Road Commercial Zone",
                "latitude": 18.5142,
                "longitude": 73.8569,
                "timestamp": "2026-09-04T14:45:00Z",
                "severity": "MEDIUM",
                "status": "RESOLVED",
                "evidenceImage": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
                "plateImage": None,
                "violationCode": "MVA Sec 122 (Obstruction of Transit Lane)",
                "fineAmount": "₹1,500 Fine Auto-Challan",
                "details": "Stationary vehicle blocking public transit dedicated corridor for > 15 minutes. Towing notice auto-issued.",
                "telemetry": {
                    "t0_label": "T0 • Approach Velocity",
                    "t0_val": "Speed: 0 km/h (Stationary)",
                    "t0_sensor": "Forward Cam",
                    "t1_label": "T1 • Anomaly Event",
                    "t1_val": "Dedicated Bus Lane Encroachment (>15 min)",
                    "t1_sensor": "GPS Geofence Match",
                    "t2_label": "T2 • ANPR Locked",
                    "t2_val": "MH 12 KP 5511",
                    "t2_sensor": "Dual-Stage RF-DETR + OCR (95% Match)"
                }
            }
        ]

        self.road_issues = [
            {
                "id": "RD-301",
                "category": "pothole",
                "location": "Sinhagad Road Corridor (Mitra Mandal to Hingne)",
                "ward": "Ward 11 - Sinhagad Road Division (PMC)",
                "issueType": "Severe Surface Potholes & Cracks",
                "reports": 17,
                "busesReporting": 6,
                "severity": "CRITICAL",
                "priorityScore": 92,
                "status": "NEEDS_ATTENTION",
                "recommendation": "Prioritize urgent asphalt resurfacing and deploy temporary traffic warning signs.",
                "lastReported": "12 mins ago",
                "latitude": 18.4862,
                "longitude": 73.8324
            },
            {
                "id": "RD-302",
                "category": "zebra_crossing",
                "location": "Fergusson College (FC) Road Main Gate",
                "ward": "Ward 8 - Shivajinagar / Deccan Division (PMC)",
                "issueType": "Faded / Missing Zebra Crossing Paint",
                "reports": 11,
                "busesReporting": 4,
                "severity": "HIGH",
                "priorityScore": 84,
                "status": "IN_REVIEW",
                "recommendation": "Thermoplastic re-striping of pedestrian crosswalk outside college campus gate.",
                "lastReported": "24 mins ago",
                "latitude": 18.5221,
                "longitude": 73.8415
            },
            {
                "id": "RD-303",
                "category": "divider",
                "location": "Sinhagad Road near Hingne Khurd Median",
                "ward": "Ward 11 - Sinhagad Road Division (PMC)",
                "issueType": "Missing Road Divider & Broken Barrier Gap",
                "reports": 14,
                "busesReporting": 5,
                "severity": "CRITICAL",
                "priorityScore": 89,
                "status": "NEEDS_ATTENTION",
                "recommendation": "Install precast concrete median barriers to eliminate illegal U-turns across active bus lanes.",
                "lastReported": "18 mins ago",
                "latitude": 18.4981,
                "longitude": 73.8365
            },
            {
                "id": "RD-304",
                "category": "signboard",
                "location": "Karve Road near Nal Stop Junction",
                "ward": "Ward 14 - Kothrud Transit Division (PMC)",
                "issueType": "Damaged Mandatory Speed Signboard (Twisted 45°)",
                "reports": 8,
                "busesReporting": 3,
                "severity": "MEDIUM",
                "priorityScore": 72,
                "status": "SCHEDULED",
                "recommendation": "Re-align and secure retro-reflective 40 km/h regulatory speed signboard.",
                "lastReported": "40 mins ago",
                "latitude": 18.5082,
                "longitude": 73.8361
            },
            {
                "id": "RD-305",
                "category": "waterlogging",
                "location": "Paud Road Flyover Underpass",
                "ward": "Ward 14 - Kothrud Transit Division (PMC)",
                "issueType": "Severe Waterlogging (Submerged Left Lane)",
                "reports": 19,
                "busesReporting": 7,
                "severity": "HIGH",
                "priorityScore": 87,
                "status": "NEEDS_ATTENTION",
                "recommendation": "Deploy mobile high-capacity dewatering pump & unblock clogged storm drain inlet.",
                "lastReported": "8 mins ago",
                "latitude": 18.5112,
                "longitude": 73.8194
            },
            {
                "id": "RD-306",
                "category": "signboard",
                "location": "Swargate Bus Terminal Approach",
                "ward": "Ward 9 - Swargate Transit Hub (PMC)",
                "issueType": "Missing Street Divider Reflectors & Cat-Eyes",
                "reports": 5,
                "busesReporting": 2,
                "severity": "LOW",
                "priorityScore": 48,
                "status": "SCHEDULED",
                "recommendation": "Replace missing solar cat-eye studs along BRTS entry corridor.",
                "lastReported": "2 hours ago",
                "latitude": 18.5021,
                "longitude": 73.8638
            }
        ]

        self.analytics = {
            "cityHealthScore": 84,
            "busesActive": 11,
            "totalBuses": 12,
            "eventsToday": 142,
            "roadDefectsTotal": 36,
            "safetyAlerts": 14,
            "criticalIncidents": 3,
            "edgeDataSavedGb": 48.6,
            "odAnalysis": [
                {
                    "route": "Route 17",
                    "origin": "Pune Station",
                    "destination": "Swargate",
                    "avgDelayMin": 11,
                    "trafficImpact": "HIGH",
                    "cause": "Underpass bottleneck & double parking"
                },
                {
                    "route": "Route 38",
                    "origin": "Sinhagad Road",
                    "destination": "Deccan",
                    "avgDelayMin": 16,
                    "trafficImpact": "SEVERE",
                    "cause": "Flyover construction & road pothole clusters"
                },
                {
                    "route": "Route 24",
                    "origin": "Kothrud Depot",
                    "destination": "Viman Nagar",
                    "avgDelayMin": 6,
                    "trafficImpact": "MEDIUM",
                    "cause": "Peak hour signal delay at University Chowk"
                },
                {
                    "route": "Route 105",
                    "origin": "Hadapsar",
                    "destination": "Hinjewadi",
                    "avgDelayMin": 14,
                    "trafficImpact": "HIGH",
                    "cause": "Highway bypass merging congestion"
                }
            ],
            "eventsByType": [
                {"name": "Pothole Defect", "count": 58, "color": "#ef4444"},
                {"name": "Traffic Congestion", "count": 42, "color": "#f59e0b"},
                {"name": "Pedestrian Hazard", "count": 24, "color": "#3b82f6"},
                {"name": "Rash Driving / ANPR", "count": 18, "color": "#8b5cf6"}
            ],
            "trafficDensityHourly": [
                {"time": "06:00", "density": 15},
                {"time": "08:00", "density": 45},
                {"time": "10:00", "density": 78},
                {"time": "12:00", "density": 52},
                {"time": "14:00", "density": 48},
                {"time": "16:00", "density": 86},
                {"time": "18:00", "density": 94},
                {"time": "20:00", "density": 65}
            ]
        }

    def add_event(self, event_data: dict):
        event = copy.deepcopy(event_data)
        if "id" not in event:
            event["id"] = f"EVT-{int(time.time() * 1000) % 100000}"
        self.events.insert(0, event)
        if len(self.events) > 50:
            self.events = self.events[:50]
        
        # Process road defects (Pothole, Zebra Crossing, Signboard, Divider, Waterlogging)
        event_type = event.get("type", "")
        defect_mapping = {
            "Pothole": ("pothole", "Pothole Surface Defect", "Prioritize urgent asphalt patching and resurfacing."),
            "Zebra Crossing": ("zebra_crossing", "Faded / Missing Zebra Crossing", "Schedule thermoplastic crosswalk painting for pedestrian safety."),
            "Signboard": ("signboard", "Damaged Traffic Signboard", "Realign and replace damaged regulatory traffic sign."),
            "Divider": ("divider", "Broken Road Divider / Barrier", "Erect missing concrete median barrier to prevent illegal crossings."),
            "Waterlog": ("waterlogging", "Severe Road Waterlogging", "Deploy municipal pump truck and clear clogged stormwater drain.")
        }
        
        detected_category = None
        for key, val in defect_mapping.items():
            if key.lower() in event_type.lower():
                detected_category = val
                break
                
        if detected_category:
            cat_id, default_title, default_rec = detected_category
            location_name = event.get("locationName", "Pune Transit Corridor")
            matched = False
            for issue in self.road_issues:
                if (issue.get("category") == cat_id and 
                    (abs(issue.get("latitude", 0) - event.get("latitude", 0)) < 0.005 or 
                     any(loc_word in location_name.lower() for loc_word in issue["location"].lower().split() if len(loc_word) > 4))):
                    issue["reports"] += 1
                    issue["busesReporting"] = min(12, issue["busesReporting"] + 1)
                    issue["priorityScore"] = min(99, issue["priorityScore"] + 2)
                    issue["lastReported"] = "Just now"
                    matched = True
                    break
            if not matched:
                self.road_issues.insert(0, {
                    "id": f"RD-{len(self.road_issues) + 301}",
                    "category": cat_id,
                    "location": location_name,
                    "ward": "Pune Municipal Corporation - Central Ward",
                    "issueType": event_type or default_title,
                    "reports": 1,
                    "busesReporting": 1,
                    "severity": event.get("severity", "HIGH"),
                    "priorityScore": 76,
                    "status": "NEEDS_ATTENTION",
                    "recommendation": default_rec,
                    "lastReported": "Just now",
                    "latitude": event.get("latitude", 18.5204),
                    "longitude": event.get("longitude", 73.8567)
                })
        
        # If it's a rash driving/ANPR event or has a registration number, create an Incident entry
        if "Rash Driving" in event.get("type", "") or "Accident" in event.get("type", "") or "Collision" in event.get("type", "") or "ANPR" in event.get("type", "") or event.get("registrationNumber"):
            is_acc = "accident" in event.get("type", "").lower() or "collision" in event.get("type", "").lower()
            default_telemetry = {
                "t0_label": "T0 • Approach Velocity",
                "t0_val": "Speed: 68 km/h (-7.9 m/s²)" if is_acc else "Speed: 94 km/h (+34 km/h)",
                "t0_sensor": "Forward Radar" if is_acc else "Rear Radar Sensor",
                "t1_label": "T1 • Anomaly Event",
                "t1_val": "Jackknife Collision & Rollover (7.4G Impact)" if is_acc else "Erratic Multi-Lane Swerving & Cut-In",
                "t1_sensor": "360° Optical Telemetry" if is_acc else "Side Cam Dynamic Tracking",
                "t2_label": "T2 • ANPR Locked",
                "t2_val": event.get("registrationNumber", "TN 76 AB 7224"),
                "t2_sensor": f"Dual-Stage RF-DETR + OCR ({int(event.get('anprConfidence', 0.94)*100)}% Match)"
            }
            inc = {
                "id": f"INC-{len(self.incidents) + 704}",
                "type": event.get("type", "Accident Collision & ANPR Tracking"),
                "vehicle": event.get("vehicleType", "Involved Vehicle"),
                "registrationNumber": event.get("registrationNumber", "MH12 AB 1234"),
                "anprConfidence": event.get("anprConfidence", event.get("confidence", 0.95)),
                "busId": event.get("busId", "BUS-104"),
                "location": event.get("locationName", "Pune Transit Corridor"),
                "latitude": event.get("latitude", 18.5082),
                "longitude": event.get("longitude", 73.8361),
                "timestamp": event.get("timestamp", time.strftime("%Y-%m-%dT%H:%M:%SZ")),
                "severity": event.get("severity", "CRITICAL"),
                "status": "NEW",
                "evidenceImage": event.get("evidenceImage") or "/outputs/snapshots/test_forensic_snap.jpg",
                "plateImage": event.get("plateImage"),
                "telemetry": event.get("telemetry") or default_telemetry,
                "violationCode": event.get("violationCode") or ("MVA Sec 134 / Sec 184 (Major Collision Obstruction)" if is_acc else "MVA Sec 184 (Dangerous & Reckless Driving)"),
                "fineAmount": event.get("fineAmount") or ("Court Summon / Impound" if is_acc else "₹5,000 Fine & License Endorsement"),
                "details": event.get("details", "AI edge camera flagged incident / reckless driving & extracted registration plate.")
            }
            self.incidents.insert(0, inc)

        return event

    def update_incident_status(self, incident_id: str, new_status: str):
        for inc in self.incidents:
            if inc["id"] == incident_id:
                inc["status"] = new_status
                return inc
        return None
