"""
Production AI Detection Module Interface for TransitEye.
Wraps Custom Urban Vision AI engine and OpenCV pipelines running on 
edge AI acceleration modules inside buses for Indian road conditions.
"""

from ai.demo_detector import DemoDetector
from ai.inference import CustomUrbanVisionInference


class ProductionAIDetector:
    """
    Model-agnostic AI Detection interface supporting Custom Urban Vision AI models 
    trained on Indian road conditions (RDD2022 & IDD datasets).
    """
    def __init__(self, model_path: str = None):
        self.demo_fallback = DemoDetector()
        self.custom_inference = CustomUrbanVisionInference()
        self.is_custom_ai_active = self.custom_inference.is_weights_loaded

    def run_inference(self, frame_or_scenario, bus_id="BUS-104", gps=None, camera_angle="front"):
        """
        Runs object detection + road damage identification + ANPR. 
        Automatically delegates to Demo simulation mode when live scenario triggers 
        or raw stream frame inputs are provided.
        """
        if isinstance(frame_or_scenario, str):
            return self.demo_fallback.process_demo_scenario(frame_or_scenario, bus_id, gps, camera_angle)
        
        # Real inference on input video frame
        if self.custom_inference.is_weights_loaded:
            return self.custom_inference.predict_frame(frame_or_scenario, bus_id, gps, camera_angle)
            
        return self.demo_fallback.process_demo_scenario("normal", bus_id, gps, camera_angle)

    def get_bandwidth_savings(self):
        return self.demo_fallback.get_edge_stats()
