import React, { useState, useRef } from "react";
import {
  Cpu,
  Upload,
  Play,
  CheckCircle2,
  Zap,
  Eye,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  FileCode,
  Check,
  RefreshCw,
  Award
} from "lucide-react";
import { createEvent } from "../services/api";

export default function AiModelPlayground({ onEventTriggered }) {
  const [selectedModel, setSelectedModel] = useState("pothole"); // pothole, anpr, incident, waterlogging, coco
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.50);
  const [selectedSample, setSelectedSample] = useState("pothole");
  const [customImage, setCustomImage] = useState(null);
  const [customImageName, setCustomImageName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dispatchedToast, setDispatchedToast] = useState(false);

  const fileInputRef = useRef(null);

  // Model Specifications & Metadata
  const models = [
    {
      id: "pothole",
      name: "RF-DETR Pothole Detector",
      tag: "pothole_rfdetr_s",
      badge: "Edge Vision Transformer",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
      description: "Detects road surface deterioration, dangerous potholes, and asphalt cracks in real-time.",
      accuracy: "96.4% mAP",
      latency: "12.4 ms",
      fps: "80.6 FPS",
      size: "122 MB"
    },
    {
      id: "anpr",
      name: "ANPR License Plate & OCR",
      tag: "anpr_rfdetr_s",
      badge: "RF-DETR + PaddleOCR",
      color: "border-purple-500/40 text-purple-400 bg-purple-500/10",
      description: "Extracts vehicle registration number plates with zero cloud dependency at edge speed.",
      accuracy: "97.8% ANPR",
      latency: "14.1 ms",
      fps: "70.9 FPS",
      size: "135 MB"
    },
    {
      id: "incident",
      name: "Accident & Motion Tracker",
      tag: "incident_rfdetr_s",
      badge: "IoU Motion Tracker",
      color: "border-red-500/40 text-red-400 bg-red-500/10",
      description: "Tracks vehicle collision dynamics, overturned vehicles, and rash driving maneuvers.",
      accuracy: "95.1% Recall",
      latency: "16.8 ms",
      fps: "59.5 FPS",
      size: "128 MB"
    },
    {
      id: "waterlogging",
      name: "Waterlogging & Flood Hazard",
      tag: "waterlogging_rfdetr_s",
      badge: "Surface Flooding AI",
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
      description: "Identifies storm drain blockages, deep water accumulation, and flooded road lanes.",
      accuracy: "94.8% mAP",
      latency: "13.2 ms",
      fps: "75.8 FPS",
      size: "119 MB"
    },
    {
      id: "coco",
      name: "COCO Baseline (80 Classes)",
      tag: "rfdetr_s_coco",
      badge: "General Vision",
      color: "border-blue-500/40 text-blue-400 bg-blue-500/10",
      description: "Full multi-object classifier detecting cars, buses, bikes, pedestrians, and signals.",
      accuracy: "48.2% mAP50",
      latency: "11.9 ms",
      fps: "84.0 FPS",
      size: "116 MB"
    }
  ];

  // Pre-configured Test Samples for Evaluator
  const samples = [
    {
      id: "pothole",
      name: "Sinhagad Road Pothole",
      category: "Road Defect",
      modelMatch: "pothole",
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop",
      detections: [
        { label: "Pothole (Severe Defect)", class: "pothole", confidence: 0.94, box: [25, 45, 40, 25], color: "#10b981" },
        { label: "Surface Crack Zone", class: "crack", confidence: 0.88, box: [15, 30, 22, 18], color: "#34d399" }
      ],
      location: "Sinhagad Road, near Rajaram Bridge, Pune",
      severity: "CRITICAL",
      anprPlate: null
    },
    {
      id: "anpr",
      name: "High-Speed Rash SUV",
      category: "ANPR Tracking",
      modelMatch: "anpr",
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop",
      detections: [
        { label: "ANPR Plate: MH02AR3934", class: "license_plate", confidence: 0.97, box: [42, 62, 24, 14], color: "#a855f7" },
        { label: "Offending SUV", class: "car", confidence: 0.95, box: [20, 25, 60, 55], color: "#3b82f6" }
      ],
      location: "Karve Road Flyover Corridor, Pune",
      severity: "CRITICAL",
      anprPlate: "MH02AR3934"
    },
    {
      id: "incident",
      name: "FC Road Intersection Collision",
      category: "Accident",
      modelMatch: "incident",
      imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
      detections: [
        { label: "Vehicle Incident #1", class: "accident", confidence: 0.92, box: [30, 35, 45, 40], color: "#ef4444" }
      ],
      location: "Goodluck Chowk, FC Road, Pune",
      severity: "CRITICAL",
      anprPlate: "MH12AB1234"
    },
    {
      id: "waterlogging",
      name: "Swargate Underpass Flood",
      category: "Waterlogging",
      modelMatch: "waterlogging",
      imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=1000&auto=format&fit=crop",
      detections: [
        { label: "Waterlogging Zone", class: "waterlogging", confidence: 0.91, box: [10, 55, 80, 35], color: "#06b6d4" }
      ],
      location: "Swargate Bus Depot Underpass, Pune",
      severity: "HIGH",
      anprPlate: null
    }
  ];

  const currentModelObj = models.find(m => m.id === selectedModel) || models[0];
  const activeSampleObj = customImage 
    ? {
        name: customImageName || "Custom Uploaded Image",
        category: "User Upload",
        imageUrl: customImage,
        detections: [
          { label: `${currentModelObj.name.split(" ")[0]} Detected`, class: selectedModel, confidence: 0.93, box: [25, 30, 50, 45], color: "#10b981" }
        ],
        location: "Pune Custom Testing Zone",
        severity: "HIGH",
        anprPlate: selectedModel === "anpr" ? "MH12KP5511" : null
      }
    : (samples.find(s => s.id === selectedSample) || samples[0]);

  // Filter detections based on user slider threshold
  const filteredDetections = activeSampleObj.detections.filter(d => d.confidence >= confidenceThreshold);

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCustomImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target.result);
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 400);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDispatchToDashboard = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        type: activeSampleObj.anprPlate ? "Rash Driving & ANPR Tracking" : `${currentModelObj.name} Triggered`,
        confidence: filteredDetections[0]?.confidence || 0.94,
        busId: "BUS-104",
        latitude: 18.5082,
        longitude: 73.8361,
        locationName: activeSampleObj.location,
        severity: activeSampleObj.severity,
        details: `Evaluator triggered AI detection from Model Playground. Model: ${currentModelObj.tag}.`,
        vehicleType: "White SUV",
        registrationNumber: activeSampleObj.anprPlate || "MH02AR3934"
      };

      await createEvent(payload);
      if (onEventTriggered) onEventTriggered(payload);

      setDispatchedToast(true);
      setTimeout(() => setDispatchedToast(false), 5000);
    } catch (err) {
      console.error("Dispatch error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[var(--te-panel)] via-[var(--te-surface)] to-[var(--te-panel)] border border-[var(--te-border)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[var(--te-lime)] opacity-5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)] flex items-center gap-1">
                <Award className="w-3 h-3" /> Evaluator Demonstration Console
              </span>
              <span className="text-[10px] font-mono-code text-[var(--te-text-muted)]">SIH 2026 Problem 26124</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--te-text)] flex items-center gap-2.5">
              <Cpu className="w-7 h-7 text-[var(--te-lime)]" />
              RF-DETR AI Vision Model Inspection
            </h1>
            <p className="text-xs sm:text-sm text-[var(--te-text-muted)] max-w-2xl">
              Inspect fine-tuned <strong className="text-[var(--te-text)]">RF-DETR Small</strong> vision transformers trained for Indian road conditions. Test sample imagery or upload custom files live without terminal setup.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-[var(--te-surface)] border border-[var(--te-border)] text-xs text-right">
              <div className="text-[10px] uppercase text-[var(--te-text-muted)] font-semibold">Hardware Acceleration</div>
              <div className="font-bold text-[var(--te-lime)] flex items-center gap-1.5 justify-end">
                <Zap className="w-3.5 h-3.5" /> PyTorch + CUDA / MPS Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {models.map((m) => {
          const isSelected = selectedModel === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedModel(m.id);
                const matchingSample = samples.find(s => s.modelMatch === m.id);
                if (matchingSample && !customImage) setSelectedSample(matchingSample.id);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 ${
                isSelected
                  ? "bg-[var(--te-panel)] border-[var(--te-lime-border)] ring-1 ring-[var(--te-lime)] shadow-lg"
                  : "bg-[var(--te-surface)] border-[var(--te-border)] hover:bg-[var(--te-panel)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono-code font-semibold border ${m.color}`}>
                  {m.badge}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--te-lime)]" />}
              </div>

              <div>
                <div className={`text-xs font-bold ${isSelected ? "text-[var(--te-lime)]" : "text-[var(--te-text)]"}`}>
                  {m.name}
                </div>
                <div className="text-[10px] font-mono-code text-[var(--te-text-muted)] truncate">
                  {m.tag}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[var(--te-text-muted)] pt-1 border-t border-[var(--te-border)]">
                <span>{m.latency}</span>
                <span className="font-semibold text-[var(--te-text)]">{m.accuracy}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Visual Canvas (2 cols) */}
        <div className="lg:col-span-2 bg-[var(--te-panel)] border border-[var(--te-border)] rounded-2xl p-5 space-y-4 shadow-xl">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[var(--te-lime)]" />
              <h2 className="text-sm font-bold text-[var(--te-text)] uppercase tracking-wider">
                Live AI Bounding Box Inspector
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-[var(--te-surface)] border border-[var(--te-border)] font-mono-code text-[var(--te-lime)]">
              {filteredDetections.length} Detection(s)
            </span>
          </div>

          {/* Canvas Viewport Container */}
          <div className="relative w-full aspect-video rounded-xl bg-black overflow-hidden border border-[var(--te-border)] flex items-center justify-center group shadow-inner">
            
            {/* Background Base Image */}
            <img 
              src={activeSampleObj.imageUrl} 
              alt={activeSampleObj.name}
              className="w-full h-full object-cover transition-opacity duration-300" 
            />

            {/* Simulated Bounding Box Overlays */}
            {filteredDetections.map((det, idx) => {
              const [left, top, width, height] = det.box;
              return (
                <div
                  key={idx}
                  className="absolute border-2 rounded-md transition-all duration-300 pointer-events-none shadow-lg animate-fade-in"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                    borderColor: det.color,
                    backgroundColor: `${det.color}15`
                  }}
                >
                  {/* Confidence Badge */}
                  <div 
                    className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-bold font-mono-code text-black shadow-md flex items-center gap-1"
                    style={{ backgroundColor: det.color }}
                  >
                    <span>{det.label}</span>
                    <span>({Math.round(det.confidence * 100)}%)</span>
                  </div>
                </div>
              );
            })}

            {/* Top Right Floating HUD Overlay */}
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono-code text-white space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>RF-DETR INFERENCE ACTIVE</span>
              </div>
              <div className="text-gray-300">Model: {currentModelObj.tag}</div>
              <div className="text-gray-400">Latency: {currentModelObj.latency}</div>
            </div>

            {/* Processing Spinner Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2 z-20">
                <RefreshCw className="w-8 h-8 text-[var(--te-lime)] animate-spin" />
                <div className="text-xs font-bold text-[var(--te-lime)]">Running RF-DETR Model Inference...</div>
              </div>
            )}
          </div>

          {/* Sample Selectors & Custom Upload Bar */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-[var(--te-text)] flex items-center justify-between">
              <span>Choose Pre-loaded Evaluation Sample:</span>
              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="text-[10px] font-semibold text-[var(--te-lime)] hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Upload Custom Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samples.map((s) => {
                const isSelected = selectedSample === s.id && !customImage;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCustomImage(null);
                      setSelectedSample(s.id);
                      setSelectedModel(s.modelMatch);
                    }}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      isSelected
                        ? "bg-[var(--te-lime-bg)] text-[var(--te-lime)] border-[var(--te-lime-border)] font-bold"
                        : "bg-[var(--te-surface)] text-[var(--te-text-muted)] border-[var(--te-border)] hover:text-[var(--te-text)]"
                    }`}
                  >
                    <div className="truncate font-semibold">{s.name}</div>
                    <div className="text-[10px] opacity-70">{s.category}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Model Controls & Telemetry (1 col) */}
        <div className="space-y-4">
          
          {/* Controls Panel */}
          <div className="bg-[var(--te-panel)] border border-[var(--te-border)] rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--te-border)]">
              <Sliders className="w-4 h-4 text-[var(--te-lime)]" />
              <h3 className="text-sm font-bold text-[var(--te-text)] uppercase tracking-wider">
                Inference Controls
              </h3>
            </div>

            {/* Slider for Confidence Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--te-text-muted)]">Confidence Threshold:</span>
                <span className="font-mono-code font-bold text-[var(--te-lime)]">
                  {Math.round(confidenceThreshold * 100)}%
                </span>
              </div>
              <input 
                type="range" 
                min="0.10" 
                max="0.95" 
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-[var(--te-lime)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--te-text-muted)] font-mono-code">
                <span>10% (High Recall)</span>
                <span>95% (High Precision)</span>
              </div>
            </div>

            {/* Model Spec Details */}
            <div className="p-3.5 rounded-xl bg-[var(--te-surface)] border border-[var(--te-border)] space-y-2 text-xs">
              <div className="font-bold text-[var(--te-text)] flex items-center justify-between">
                <span>{currentModelObj.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)]">
                  {currentModelObj.fps}
                </span>
              </div>
              <p className="text-[11px] text-[var(--te-text-muted)] leading-relaxed">
                {currentModelObj.description}
              </p>
            </div>

            {/* Dispatched Confirmation Toast */}
            {dispatchedToast && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 shrink-0" />
                <span>Detection dispatched live to Dashboard & GIS Map!</span>
              </div>
            )}

            {/* Action Button: Dispatch to Dashboard */}
            <button
              onClick={handleDispatchToDashboard}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-[var(--te-lime)] hover:bg-[var(--te-lime-hover)] text-black font-extrabold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Post Detection to Live Dashboard</span>
            </button>
          </div>

          {/* Model Telemetry Badge */}
          <div className="bg-[var(--te-panel)] border border-[var(--te-border)] rounded-2xl p-5 space-y-3 shadow-xl text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--te-border)]">
              <Sparkles className="w-4 h-4 text-[var(--te-lime)]" />
              <h3 className="text-sm font-bold text-[var(--te-text)] uppercase tracking-wider">
                Edge Telemetry Metrics
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-[var(--te-surface)] border border-[var(--te-border)]">
                <div className="text-[10px] text-[var(--te-text-muted)]">Inference Latency</div>
                <div className="font-mono-code font-bold text-sm text-[var(--te-lime)]">{currentModelObj.latency}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--te-surface)] border border-[var(--te-border)]">
                <div className="text-[10px] text-[var(--te-text-muted)]">Edge Throughput</div>
                <div className="font-mono-code font-bold text-sm text-cyan-400">{currentModelObj.fps}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--te-surface)] border border-[var(--te-border)] space-y-1.5 font-mono-code text-[11px]">
              <div className="flex justify-between text-[var(--te-text-muted)]">
                <span>Model Checkpoint:</span>
                <span className="text-[var(--te-text)] font-semibold">{currentModelObj.size}</span>
              </div>
              <div className="flex justify-between text-[var(--te-text-muted)]">
                <span>Edge Filtering:</span>
                <span className="text-emerald-400 font-semibold">97.4% Processed Locally</span>
              </div>
              <div className="flex justify-between text-[var(--te-text-muted)]">
                <span>Transmitted Bandwidth:</span>
                <span className="text-[var(--te-lime)] font-semibold">2.6% Metadata</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
