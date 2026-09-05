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

    def process_demo_scenario(self, scenario_type: str, bus_id: str = "BUS-104", gps: dict = None):
        """
        Generates structured detection bounding boxes, confidence, vehicle count, and telemetry
        based on the user's selected demo scenario trigger.
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
            
            detections = [
                {"class": "car", "confidence": 0.94, "box": [120, 180, 240, 140], "label": "Car - 94%"},
                {"class": "car", "confidence": 0.89, "box": [400, 200, 210, 130], "label": "Car - 89%"},
                {"class": "bike", "confidence": 0.91, "box": [320, 220, 90, 110], "label": "Bike - 91%"},
                {"class": "bus", "confidence": 0.96, "box": [50, 140, 280, 200], "label": "Bus - 96%"}
            ]
            
            return {
                "scenario": "normal",
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
                "latitude": gps["lat"],
                "longitude": gps["lng"],
                "locationName": gps.get("location", "Sinhagad Road near Mitra Mandal Chowk"),
                "timestamp": now_iso,
                "severity": "HIGH",
                "details": "Severe surface pothole (approx 45cm diameter) detected in active lane."
            }
            
            return {
                "scenario": "pothole",
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
                "latitude": gps["lat"],
                "longitude": gps["lng"],
                "locationName": gps.get("location", "FC Road near Garware Bridge"),
                "timestamp": now_iso,
                "severity": "HIGH",
                "details": "Unprotected pedestrians/school children crossing outside designated crosswalk."
            }
            
            return {
                "scenario": "pedestrian",
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
                {"class": "car", "confidence": 0.97, "box": [220, 160, 260, 170], "label": "RASH DRIVER [ID: #842] - 97%"},
                {"class": "anpr", "confidence": 0.91, "box": [300, 270, 110, 35], "label": "ANPR: MH12 AB 1234 - 91%"},
                {"class": "car", "confidence": 0.89, "box": [520, 210, 150, 110], "label": "Car - 89%"}
            ]
            
            event = {
                "id": f"EVT-{random.randint(10000, 99999)}",
                "type": "Rash Driving",
                "confidence": 0.97,
                "busId": bus_id,
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
                "traffic_density": "MEDIUM",
                "vehicle_count": 7,
                "people_count": 1,
                "detections": detections,
                "event": event,
                "edge_stats": self.get_edge_stats()
            }
            
        return self.process_demo_scenario("normal", bus_id, gps)
