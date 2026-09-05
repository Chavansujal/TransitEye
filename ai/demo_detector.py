import time
import random

class DemoDetector:
    """
    Simulates Edge AI object detection, ANPR, road hazard identification, 
    and bandwidth reduction logic running directly on public transport cameras.
    """
    def __init__(self):
        self.classes = ["car", "bike", "bus", "truck", "person", "pothole"]
        self.frame_count = 14250
        self.events_transmitted = 390
        
    def get_edge_stats(self):
        total = max(1, self.frame_count)
        transmitted = self.events_transmitted
        processed_locally_pct = round(((total - transmitted) / total) * 100, 1)
        transmitted_pct = round(100 - processed_locally_pct, 1)
        
        # Calculate raw bandwidth saved vs streaming full HD 1080p
        # Full HD = 5 Mbps x 12 buses = 60 Mbps = 27 GB/hour
        # Edge AI Transmitted = ~1.2 GB/hour (95%+ reduction)
        raw_gb_saved = round((total * 1.5) / 1024, 2) # approx GB saved
        
        return {
            "total_frames_processed": self.frame_count,
            "events_transmitted": self.events_transmitted,
            "processed_locally_pct": processed_locally_pct,
            "transmitted_pct": transmitted_pct,
            "bandwidth_saved_gb": raw_gb_saved,
            "status": "ACTIVE_EDGE_FILTERING"
        }

    def process_demo_scenario(self, scenario_type: str, bus_id: str = "BUS-104", gps: dict = None, camera_angle: str = "front"):
        """
        Generates structured detection bounding boxes, confidence, vehicle count, and telemetry
        based on the user's selected demo scenario trigger and camera angle.
        Camera angles: 'front', 'side_left', 'side_right', 'rear', 'cabin'
        """
        self.frame_count += random.randint(15, 45)
        now_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        if gps is None:
            gps = {"lat": 18.4862, "lng": 73.8324, "location": "Sinhagad Road, Pune"}
            
        detections = []
        event = None
        
        if scenario_type == "normal":
            vehicle_count = random.randint(4, 9)
            density = "LOW" if vehicle_count <= 5 else "MEDIUM"
            
            if camera_angle == "cabin":
                detections = [
                    {"class": "passenger", "confidence": 0.94, "box": [80, 150, 140, 220], "label": "Passenger (Seated) - 94%"},
                    {"class": "passenger", "confidence": 0.91, "box": [260, 140, 130, 230], "label": "Passenger (Seated) - 91%"},
                    {"class": "passenger", "confidence": 0.88, "box": [430, 160, 120, 200], "label": "Passenger (Aisle) - 88%"}
                ]
            elif camera_angle in ["side_left", "side_right"]:
                detections = [
                    {"class": "curb", "confidence": 0.93, "box": [50, 300, 380, 80], "label": "Clear Curb / Sidewalk - 93%"},
                    {"class": "bike", "confidence": 0.89, "box": [460, 210, 100, 120], "label": "Overtaking Two-Wheeler - 89%"}
                ]
            elif camera_angle == "rear":
                detections = [
                    {"class": "car", "confidence": 0.95, "box": [220, 200, 200, 140], "label": "Safe Distance (18m) - 95%"},
                    {"class": "bike", "confidence": 0.91, "box": [450, 220, 90, 110], "label": "Two-Wheeler Following - 91%"}
                ]
            else: # front
                detections = [
                    {"class": "car", "confidence": 0.94, "box": [120, 180, 240, 140], "label": "Car - 94%"},
                    {"class": "car", "confidence": 0.89, "box": [400, 200, 210, 130], "label": "Car - 89%"},
                    {"class": "bike", "confidence": 0.91, "box": [320, 220, 90, 110], "label": "Bike - 91%"},
                    {"class": "bus", "confidence": 0.96, "box": [50, 140, 280, 200], "label": "Bus - 96%"}
                ]
            
            return {
                "scenario": "normal",
                "camera_angle": camera_angle,
                "traffic_density": density,
                "vehicle_count": vehicle_count,
                "people_count": random.randint(1, 3),
                "detections": detections,
                "event": None,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "congestion":
            self.events_transmitted += 1
            vehicle_count = random.randint(28, 45)
            
            detections = [
                {"class": "car", "confidence": 0.95, "box": [100, 210, 180, 120], "label": "Car - 95%"},
                {"class": "car", "confidence": 0.92, "box": [290, 220, 170, 110], "label": "Car - 92%"},
                {"class": "truck", "confidence": 0.88, "box": [470, 180, 220, 160], "label": "Truck - 88%"},
                {"class": "bike", "confidence": 0.93, "box": [220, 260, 80, 90], "label": "Bike - 93%"},
                {"class": "car", "confidence": 0.87, "box": [50, 240, 160, 110], "label": "Car - 87%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Traffic Congestion",
                "confidence": 0.94,
                "busId": bus_id,
                "cameraAngle": camera_angle,
                "latitude": gps["lat"],
                "longitude": gps["lng"],
                "locationName": gps.get("location", "Sinhagad Road Corridor"),
                "timestamp": now_iso,
                "severity": "HIGH",
                "vehicleCount": vehicle_count,
                "details": f"Heavy bottleneck detected. {vehicle_count} vehicles stationary on route."
            }
            
            return {
                "scenario": "congestion",
                "camera_angle": camera_angle,
                "traffic_density": "SEVERE",
                "vehicle_count": vehicle_count,
                "people_count": 4,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "pothole":
            self.events_transmitted += 1
            
            detections = [
                {"class": "car", "confidence": 0.92, "box": [150, 190, 200, 130], "label": "Car - 92%"},
                {"class": "pothole", "confidence": 0.93, "box": [280, 310, 180, 90], "label": "POTHOLE DETECTED - 93%"},
                {"class": "bike", "confidence": 0.88, "box": [490, 210, 90, 100], "label": "Bike - 88%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Pothole Defect",
                "confidence": 0.93,
                "busId": bus_id,
                "cameraAngle": camera_angle,
                "latitude": gps["lat"],
                "longitude": gps["lng"],
                "locationName": gps.get("location", "Sinhagad Road near Mitra Mandal Chowk"),
                "timestamp": now_iso,
                "severity": "HIGH",
                "details": "Severe surface pothole (approx 45cm diameter) detected in active lane."
            }
            
            return {
                "scenario": "pothole",
                "camera_angle": camera_angle,
                "traffic_density": "MEDIUM",
                "vehicle_count": 8,
                "people_count": 2,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "pedestrian":
            self.events_transmitted += 1
            
            detections = [
                {"class": "person", "confidence": 0.96, "box": [340, 200, 110, 190], "label": "Pedestrian Warning - 96%"},
                {"class": "person", "confidence": 0.91, "box": [430, 210, 95, 175], "label": "School Child - 91%"},
                {"class": "car", "confidence": 0.94, "box": [110, 210, 190, 120], "label": "Car - 94%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Pedestrian Hazard",
                "confidence": 0.95,
                "busId": bus_id,
                "cameraAngle": camera_angle,
                "latitude": gps["lat"],
                "longitude": gps["lng"],
                "locationName": gps.get("location", "FC Road near Garware Bridge"),
                "timestamp": now_iso,
                "severity": "HIGH",
                "details": "Unprotected pedestrians/school children crossing outside designated crosswalk."
            }
            
            return {
                "scenario": "pedestrian",
                "camera_angle": camera_angle,
                "traffic_density": "MEDIUM",
                "vehicle_count": 6,
                "people_count": 8,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "rash_driving":
            self.events_transmitted += 1
            
            detections = [
                {"class": "car", "confidence": 0.97, "box": [220, 160, 260, 170], "label": "RASH DRIVER [TRACK-842] - 97%"},
                {"class": "anpr", "confidence": 0.91, "box": [300, 270, 110, 35], "label": "ANPR: MH12 AB 1234 - 91%"},
                {"class": "car", "confidence": 0.89, "box": [520, 210, 150, 110], "label": "Car - 89%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Rash Driving",
                "confidence": 0.97,
                "busId": bus_id,
                "cameraAngle": camera_angle,
                "latitude": gps["lat"],
                "longitude": gps["lng"],
                "locationName": gps.get("location", "Karve Road Flyover Corridor"),
                "timestamp": now_iso,
                "severity": "CRITICAL",
                "registrationNumber": "MH12 AB 1234",
                "anprConfidence": 0.91,
                "vehicleType": "White Sedan",
                "trackId": "TRACK-842",
                "details": "Erratic lane shifting & overspeeding (85 km/h in 40 km/h zone) recorded by bus camera."
            }
            
            return {
                "scenario": "rash_driving",
                "camera_angle": camera_angle,
                "traffic_density": "MEDIUM",
                "vehicle_count": 7,
                "people_count": 1,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "zebra_crossing":
            self.events_transmitted += 1
            
            detections = [
                {"class": "zebra", "confidence": 0.92, "box": [160, 290, 320, 90], "label": "FADED / MISSING ZEBRA CROSSING - 92%"},
                {"class": "person", "confidence": 0.94, "box": [480, 210, 90, 170], "label": "Waiting Pedestrian - 94%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Missing Zebra Crossing",
                "confidence": 0.92,
                "busId": bus_id,
                "cameraAngle": camera_angle or "side_left",
                "latitude": 18.5221,
                "longitude": 73.8415,
                "locationName": "FC Road near Fergusson College Main Gate",
                "timestamp": now_iso,
                "severity": "HIGH",
                "details": "Severely faded zebra crossing paint in high-pedestrian student zone. Pavement markings worn out."
            }
            
            return {
                "scenario": "zebra_crossing",
                "camera_angle": camera_angle or "side_left",
                "traffic_density": "MEDIUM",
                "vehicle_count": 5,
                "people_count": 6,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "signboard_defect":
            self.events_transmitted += 1
            
            detections = [
                {"class": "signboard", "confidence": 0.94, "box": [460, 100, 130, 140], "label": "DAMAGED SIGNBOARD (TWISTED 45°) - 94%"},
                {"class": "car", "confidence": 0.90, "box": [180, 200, 200, 120], "label": "Car - 90%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Damaged Traffic Signboard",
                "confidence": 0.94,
                "busId": bus_id,
                "cameraAngle": camera_angle or "front",
                "latitude": 18.5082,
                "longitude": 73.8361,
                "locationName": "Karve Road near Nal Stop Junction",
                "timestamp": now_iso,
                "severity": "MEDIUM",
                "details": "Mandatory Speed Limit 40 km/h sign knocked askew and partially obscured by tree branches."
            }
            
            return {
                "scenario": "signboard_defect",
                "camera_angle": camera_angle or "front",
                "traffic_density": "LOW",
                "vehicle_count": 4,
                "people_count": 2,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "missing_divider":
            self.events_transmitted += 1
            
            detections = [
                {"class": "divider", "confidence": 0.95, "box": [220, 240, 190, 80], "label": "BROKEN ROAD DIVIDER / MEDIAN GAP - 95%"},
                {"class": "bike", "confidence": 0.91, "box": [440, 210, 85, 100], "label": "Illegal U-Turn Crossing - 91%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Missing Road Divider",
                "confidence": 0.95,
                "busId": bus_id,
                "cameraAngle": camera_angle or "side_right",
                "latitude": 18.4981,
                "longitude": 73.8365,
                "locationName": "Sinhagad Road near Hingne Khurd",
                "timestamp": now_iso,
                "severity": "CRITICAL",
                "details": "Concrete median barrier gap (approx 4 meters broken). Vehicles attempting dangerous illegal crossings."
            }
            
            return {
                "scenario": "missing_divider",
                "camera_angle": camera_angle or "side_right",
                "traffic_density": "HIGH",
                "vehicle_count": 9,
                "people_count": 3,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "waterlogging":
            self.events_transmitted += 1
            
            detections = [
                {"class": "waterlogging", "confidence": 0.91, "box": [140, 270, 360, 110], "label": "WATERLOGGING DETECTED (25cm DEPTH) - 91%"},
                {"class": "car", "confidence": 0.88, "box": [420, 220, 180, 110], "label": "Car (Slowed to 12 km/h) - 88%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Waterlogged Road Corridor",
                "confidence": 0.91,
                "busId": bus_id,
                "cameraAngle": camera_angle or "front",
                "latitude": 18.5112,
                "longitude": 73.8194,
                "locationName": "Paud Road Flyover Underpass",
                "timestamp": now_iso,
                "severity": "HIGH",
                "details": "Substantial rainwater accumulation blocking left lane; transit flow speed reduced by 65%."
            }
            
            return {
                "scenario": "waterlogging",
                "camera_angle": camera_angle or "front",
                "traffic_density": "SEVERE",
                "vehicle_count": 12,
                "people_count": 1,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        elif scenario_type == "cabin_crowd":
            self.events_transmitted += 1
            
            detections = [
                {"class": "passenger", "confidence": 0.96, "box": [60, 120, 120, 200], "label": "Passenger (Crowded) - 96%"},
                {"class": "passenger", "confidence": 0.94, "box": [180, 130, 110, 190], "label": "Passenger (Crowded) - 94%"},
                {"class": "passenger", "confidence": 0.91, "box": [290, 120, 120, 210], "label": "Passenger (Standing) - 91%"},
                {"class": "passenger", "confidence": 0.89, "box": [410, 140, 110, 190], "label": "Passenger (Door Area) - 89%"},
                {"class": "hazard", "confidence": 0.93, "box": [480, 260, 130, 100], "label": "DOOR SENSOR BLOCKED - 93%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Cabin Safety Alert",
                "confidence": 0.94,
                "busId": bus_id,
                "cameraAngle": "cabin",
                "latitude": gps["lat"],
                "longitude": gps["lng"],
                "locationName": f"Route: {bus_id} Transit Route",
                "timestamp": now_iso,
                "severity": "MEDIUM",
                "details": "Bus passenger capacity exceeded (115% loading). Footboard standing & rear exit obstruction detected."
            }
            
            return {
                "scenario": "cabin_crowd",
                "camera_angle": "cabin",
                "traffic_density": "HIGH",
                "vehicle_count": 0,
                "people_count": 28,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        return self.process_demo_scenario("normal", bus_id, gps, camera_angle)
