"""
Dataset loader & parser module for Custom Urban Vision AI.
Supports Indian Driving Dataset (IDD) & Road Damage Dataset (RDD2022).
"""

import os
import json
import xml.etree.ElementTree as ET
from PIL import Image

try:
    import torch
    from torch.utils.data import Dataset
    import torchvision.transforms as T
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False
    class Dataset:
        pass

# Target class mapping for Indian urban roads
CLASS_MAP = {
    "car": 0,
    "bike": 1,
    "motorcycle": 1,
    "two_wheeler": 1,
    "autorickshaw": 2,
    "auto_rickshaw": 2,
    "auto": 2,
    "bus": 3,
    "truck": 4,
    "person": 5,
    "pedestrian": 5,
    "pothole": 6,
    "D00": 6,  # Longitudinal Crack / Pothole in RDD2022
    "D10": 6,  # Transverse Crack in RDD2022
    "D20": 7,  # Alligator Crack in RDD2022
    "D40": 7,  # Rutting/Bump in RDD2022
    "road_defect": 7
}

CLASS_NAMES = ["car", "bike", "auto_rickshaw", "bus", "truck", "person", "pothole", "road_defect"]


class UrbanRoadDataset(Dataset):
    """
    Dataset parser supporting RDD2022 (Pascal VOC XML format) 
    and IDD (JSON / VOC format) annotations.
    """
    def __init__(self, dataset_type: str = "RDD2022", root_dir: str = "datasets/RDD2022", image_size=(640, 640), transform=None):
        self.dataset_type = dataset_type.upper()
        self.root_dir = root_dir
        self.image_size = image_size
        self.transform = transform
        self.samples = []

        if HAS_TORCH and os.path.exists(root_dir):
            self._load_dataset_samples()

    def _load_dataset_samples(self):
        """Discovers images and matching annotation XML/JSON files."""
        img_dir = os.path.join(self.root_dir, "images")
        ann_dir = os.path.join(self.root_dir, "annotations")

        if not os.path.exists(img_dir):
            return

        for fname in os.listdir(img_dir):
            if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
                base_name = os.path.splitext(fname)[0]
                img_path = os.path.join(img_dir, fname)

                # Look for XML or JSON annotation
                xml_path = os.path.join(ann_dir, f"{base_name}.xml")
                json_path = os.path.join(ann_dir, f"{base_name}.json")

                if os.path.exists(xml_path):
                    self.samples.append({"image": img_path, "annotation": xml_path, "type": "xml"})
                elif os.path.exists(json_path):
                    self.samples.append({"image": img_path, "annotation": json_path, "type": "json"})

    def _parse_xml_annotation(self, xml_path):
        """Parses Pascal VOC XML format used by RDD2022."""
        boxes = []
        labels = []
        try:
            tree = ET.parse(xml_path)
            root = tree.getroot()
            for obj in root.findall("object"):
                name = obj.find("name").text.lower()
                cls_id = CLASS_MAP.get(name, 0)
                bndbox = obj.find("bndbox")
                xmin = float(bndbox.find("xmin").text)
                ymin = float(bndbox.find("ymin").text)
                xmax = float(bndbox.find("xmax").text)
                ymax = float(bndbox.find("ymax").text)
                boxes.append([xmin, ymin, xmax, ymax])
                labels.append(cls_id)
        except Exception:
            pass
        return boxes, labels

    def _parse_json_annotation(self, json_path):
        """Parses JSON format annotations used by IDD."""
        boxes = []
        labels = []
        try:
            with open(json_path, "r") as f:
                data = json.load(f)
            for obj in data.get("objects", []):
                name = obj.get("label", "").lower()
                cls_id = CLASS_MAP.get(name, 0)
                bbox = obj.get("bbox", [])  # [xmin, ymin, xmax, ymax]
                if len(bbox) == 4:
                    boxes.append(bbox)
                    labels.append(cls_id)
        except Exception:
            pass
        return boxes, labels

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        if not HAS_TORCH or idx >= len(self.samples):
            raise IndexError("Sample index out of bounds or PyTorch uninstalled")

        sample = self.samples[idx]
        image = Image.open(sample["image"]).convert("RGB")
        orig_w, orig_h = image.size

        if sample["type"] == "xml":
            boxes, labels = self._parse_xml_annotation(sample["annotation"])
        else:
            boxes, labels = self._parse_json_annotation(sample["annotation"])

        # Resize image
        image = image.resize(self.image_size)

        # Scale bounding boxes
        scaled_boxes = []
        scale_x = self.image_size[0] / orig_w if orig_w > 0 else 1.0
        scale_y = self.image_size[1] / orig_h if orig_h > 0 else 1.0

        for box in boxes:
            scaled_boxes.append([
                box[0] * scale_x,
                box[1] * scale_y,
                box[2] * scale_x,
                box[3] * scale_y
            ])

        boxes_tensor = torch.tensor(scaled_boxes, dtype=torch.float32) if scaled_boxes else torch.zeros((0, 4), dtype=torch.float32)
        labels_tensor = torch.tensor(labels, dtype=torch.int64) if labels else torch.zeros((0,), dtype=torch.int64)

        # Image transform to Tensor
        transform = T.Compose([
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        image_tensor = transform(image)

        target = {
            "boxes": boxes_tensor,
            "labels": labels_tensor,
            "image_id": torch.tensor([idx])
        }

        return image_tensor, target
