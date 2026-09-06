"""
Model-agnostic PyTorch Neural Network Architecture for Custom Urban Vision AI.
Tailored for Indian road vehicle detection and road damage/pothole identification.
"""

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False
    class nn:
        Module = object


class ConvBlock(nn.Module if HAS_TORCH else object):
    def __init__(self, in_channels, out_channels, kernel_size=3, stride=1, padding=1):
        super().__init__()
        if HAS_TORCH:
            self.conv = nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding, bias=False)
            self.bn = nn.BatchNorm2d(out_channels)
            self.act = nn.SiLU()

    def forward(self, x):
        return self.act(self.bn(self.conv(x)))


class CustomUrbanVisionNet(nn.Module if HAS_TORCH else object):
    """
    Custom Deep Convolutional Detection Network for Indian Traffic & Road Defects.
    Outputs class logits and bounding box offsets across multi-scale feature maps.
    """
    def __init__(self, num_classes=8):
        super().__init__()
        self.num_classes = num_classes

        if HAS_TORCH:
            # Feature Extractor Backbone
            self.stem = ConvBlock(3, 32, kernel_size=3, stride=2, padding=1)
            self.layer1 = nn.Sequential(
                ConvBlock(32, 64, kernel_size=3, stride=2, padding=1),
                ConvBlock(64, 64, kernel_size=3, stride=1, padding=1)
            )
            self.layer2 = nn.Sequential(
                ConvBlock(64, 128, kernel_size=3, stride=2, padding=1),
                ConvBlock(128, 128, kernel_size=3, stride=1, padding=1)
            )
            self.layer3 = nn.Sequential(
                ConvBlock(128, 256, kernel_size=3, stride=2, padding=1),
                ConvBlock(256, 256, kernel_size=3, stride=1, padding=1)
            )

            # Global Pooling & Head
            self.global_pool = nn.AdaptiveAvgPool2d((1, 1))

            # Detection Heads
            self.cls_head = nn.Linear(256, num_classes)
            self.bbox_head = nn.Linear(256, 4)

    def forward(self, x):
        if not HAS_TORCH:
            raise RuntimeError("PyTorch is required to run CustomUrbanVisionNet forward pass.")

        x = self.stem(x)      # 1/2
        x = self.layer1(x)    # 1/4
        x = self.layer2(x)    # 1/8
        feat = self.layer3(x) # 1/16

        pooled = self.global_pool(feat)
        flat = torch.flatten(pooled, 1)

        logits = self.cls_head(flat)
        bboxes = torch.sigmoid(self.bbox_head(flat))  # Normalized [0, 1] [x1, y1, x2, y2]

        return logits, bboxes
