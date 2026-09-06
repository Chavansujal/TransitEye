"""
Inference engine for Custom Urban Vision AI.
Executes custom model-agnostic inferencing on incoming video frames / image buffers.
"""

import os
import json
from PIL import Image
from ai.model import CustomUrbanVisionNet, HAS_TORCH
from ai.demo_detector import DemoDetector

try:
    import torch
    import torchvision.transforms as T
    import numpy as np
except ImportError:
    pass

CLASS_NAMES = ["car", "bike", "auto_rickshaw", "bus", "truck", "person", "pothole", "road_defect"]


class CustomUrbanVisionInference:
    """
    Model-agnostic inference engine for Custom Urban Vision AI.
    Loads custom PyTorch weights if present and executes real inference.
    """
    def __init__(self, config_path: str = "ai/config.json", weights_path: str = "ai/weights/custom_urban_vision.pt"):
        self.config_path = config_path
        self.weights_path = weights_path
        self.model = None
        self.device = "cpu"
        self.is_weights_loaded = False
        self.demo_fallback = DemoDetector()

        self._load_config_and_model()

    def _load_config_and_model(self):
        """Loads configuration and attempts to load trained custom model weights."""
        if not HAS_TORCH:
            return

        if os.path.exists(self.weights_path):
            try:
                self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
                self.model = CustomUrbanVisionNet(num_classes=len(CLASS_NAMES))
                checkpoint = torch.load(self.weights_path, map_location=self.device)
                if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                    self.model.load_state_dict(checkpoint["model_state_dict"])
                else:
                    self.model.load_state_dict(checkpoint)
                self.model.to(self.device)
                self.model.eval()
                self.is_weights_loaded = True
                print(f"[CUSTOM AI] Successfully loaded model weights from '{self.weights_path}'")
            except Exception as e:
                print(f"[CUSTOM AI WARNING] Failed to load custom weights ({e}). Operating in Demo Simulation Mode.")
                self.is_weights_loaded = False

    def predict_frame(self, frame, bus_id="BUS-104", gps=None, camera_angle="front"):
        """
        Executes Custom Urban Vision AI prediction on image array/PIL image.
        If weights are not loaded, seamlessly uses DemoDetector.
        """
        if not self.is_weights_loaded or not HAS_TORCH:
            return self.demo_fallback.process_demo_scenario("normal", bus_id, gps, camera_angle)

        try:
            # Preprocess image
            if not isinstance(frame, Image.Image):
                if hasattr(frame, "shape"): # numpy array
                    image = Image.fromarray(frame)
                else:
                    return self.demo_fallback.process_demo_scenario("normal", bus_id, gps, camera_angle)
            else:
                image = frame

            orig_w, orig_h = image.size
            image_resized = image.resize((640, 640))

            transform = T.Compose([
                T.ToTensor(),
                T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])
            input_tensor = transform(image_resized).unsqueeze(0).to(self.device)

            with torch.no_grad():
                logits, bboxes = self.model(input_tensor)
                probs = torch.softmax(logits, dim=-1)
                top_prob, top_cls = torch.max(probs, dim=-1)

            confidence = float(top_prob[0].item())
            cls_idx = int(top_cls[0].item())
            cls_name = CLASS_NAMES[cls_idx] if cls_idx < len(CLASS_NAMES) else "vehicle"

            box = bboxes[0].cpu().numpy()
            scaled_box = [
                int(box[0] * orig_w),
                int(box[1] * orig_h),
                int((box[2] - box[0]) * orig_w),
                int((box[3] - box[1]) * orig_h)
            ]

            detections = [{
                "class": cls_name,
                "confidence": round(confidence, 2),
                "box": scaled_box,
                "label": f"Custom AI: {cls_name.capitalize()} - {int(confidence * 100)}%"
            }]

            return {
                "scenario": "live_custom_vision",
                "camera_angle": camera_angle,
                "traffic_density": "MEDIUM",
                "vehicle_count": 1,
                "people_count": 1 if cls_name == "person" else 0,
                "detections": detections,
                "event": None,
                "edge_stats": self.demo_fallback.get_edge_stats()
            }
        except Exception as e:
            print(f"[CUSTOM AI INFERENCE ERROR] {e}. Falling back to demo mode.")
            return self.demo_fallback.process_demo_scenario("normal", bus_id, gps, camera_angle)
