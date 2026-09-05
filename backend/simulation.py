import math
import random
import time
import threading

class FleetSimulator:
    """
    Simulates real-time Pune public bus fleet telemetry & movement across real transit routes.
    """
    def __init__(self, data_store):
        self.ds = data_store
        self.running = False
        self.thread = None

    def start(self):
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._update_loop, daemon=True)
            self.thread.start()

    def stop(self):
        self.running = False

    def _update_loop(self):
        while self.running:
            time.sleep(3) # Update positions every 3 seconds
            try:
                for bus in self.ds.buses:
                    if bus["status"] == "OFFLINE":
                        continue
                    
                    # Small random movement along trajectory (~0.0003 lat/lng shift ~30m)
                    lat_delta = (random.random() - 0.48) * 0.0006
                    lng_delta = (random.random() - 0.48) * 0.0006
                    
                    bus["latitude"] = round(bus["latitude"] + lat_delta, 5)
                    bus["longitude"] = round(bus["longitude"] + lng_delta, 5)
                    
                    # Keep buses constrained within Pune metropolitan bounding box
                    # Lat: 18.44 - 18.62, Lng: 73.72 - 73.94
                    bus["latitude"] = max(18.44, min(18.62, bus["latitude"]))
                    bus["longitude"] = max(73.72, min(73.94, bus["longitude"]))
                    
                    # Update speed smoothly
                    speed_change = random.randint(-3, 3)
                    bus["speed"] = max(10, min(55, bus["speed"] + speed_change))
            except Exception as e:
                pass
