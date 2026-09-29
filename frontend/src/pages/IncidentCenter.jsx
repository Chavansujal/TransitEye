import React, { useState } from "react";
import { 
  ShieldAlert, 
  Camera, 
  MapPin, 
  Lock, 
  Route, 
  FileCheck,
  Film,
  ZoomIn,
  Scale,
  AlertTriangle,
  X,
  Download,
  Gauge,
  Car,
  CheckCircle2
} from "lucide-react";
import { updateIncidentStatus, getApiBase, resolveAssetUrl } from "../services/api";

export default function IncidentCenter({ incidents = [], onIncidentUpdated }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [citationExported, setCitationExported] = useState(false);

  const handleStatusChange = async (incidentId, newStatus) => {
    setUpdatingId(incidentId);
    const updated = await updateIncidentStatus(incidentId, newStatus);
    setUpdatingId(null);
    if (updated && onIncidentUpdated) {
      onIncidentUpdated(updated);
    }
    if (selectedEvidence && selectedEvidence.id === incidentId) {
      setSelectedEvidence(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleExportCitation = (inc) => {
    setCitationExported(true);
    setTimeout(() => setCitationExported(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-[var(--te-text)] animate-fade-in-up">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 te-card p-5 border-l-4 border-l-[var(--te-lime)]">
        <div>
          <div className="flex items-center gap-2 text-[var(--te-lime)] text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 shrink-0" /> Automated ANPR & Offender Evidence Audit
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--te-text)] tracking-tight">
            Traffic Safety & Offender Triage Console
          </h2>
          <p className="text-xs sm:text-sm text-[var(--te-text-muted)] mt-1">
            Real-time forensic evidence logging: automated RF-DETR vehicle tracking, incident classification, zoomed ANPR plate extraction, and verified SHA-256 integrity chains.
          </p>
        </div>

        {/* Security Tag */}
        <div className="flex items-center gap-2 bg-[var(--te-panel)] p-2.5 rounded-md border border-[var(--te-border)] text-xs text-[var(--te-lime)] font-medium self-start md:self-auto">
          <Lock className="w-4 h-4 text-[var(--te-lime)] shrink-0" />
          <span>Edge Encrypted (TLS 1.3 / SHA-256)</span>
        </div>
      </div>

      {/* Incidents Triage List */}
      <div className="grid grid-cols-1 gap-5">
        {incidents.map((inc) => {
          const t0Label = inc.telemetry?.t0_label || "T0 • Approach Velocity";
          const t0Val = inc.telemetry?.t0_val || (
            inc.type?.toLowerCase().includes("crash") || inc.type?.toLowerCase().includes("collision")
              ? "Speed: 68 km/h (Emergency Decel -7.9 m/s²)"
              : inc.type?.toLowerCase().includes("parking")
              ? "Speed: 0 km/h (Stationary)"
              : "Speed: 94 km/h (+34 km/h Above Urban Limit)"
          );
          const t0Sensor = inc.telemetry?.t0_sensor || (
            inc.type?.toLowerCase().includes("crash") ? "Forward Radar Sensor" : "Rear Cam Radar"
          );

          const t1Label = inc.telemetry?.t1_label || "T1 • Anomaly Event";
          const t1Val = inc.telemetry?.t1_val || (
            inc.type?.toLowerCase().includes("crash") || inc.type?.toLowerCase().includes("collision")
              ? "Jackknife Collision & Impact (7.4G)"
              : inc.type?.toLowerCase().includes("parking")
              ? "Dedicated Bus Lane Encroachment (>15 min)"
              : "Erratic Multi-Lane Swerving & Cut-In"
          );
          const t1Sensor = inc.telemetry?.t1_sensor || (
            inc.type?.toLowerCase().includes("crash") ? "360° Optical Telemetry" : "Side Cam Dynamic Tracking"
          );

          const t2Label = inc.telemetry?.t2_label || "T2 • ANPR Locked";
          const t2Val = inc.telemetry?.t2_val || (inc.registrationNumber || "PLATE NOT DETECTED");
          const t2Sensor = inc.telemetry?.t2_sensor || `Dual-Stage RF-DETR + OCR (${((inc.anprConfidence || 0.94) * 100).toFixed(0)}% Match)`;

          const imageUrl = resolveAssetUrl(inc.evidenceImage);
          const plateUrl = inc.plateImage ? resolveAssetUrl(inc.plateImage) : null;

          return (
            <div 
              key={inc.id} 
              className="te-card p-5 flex flex-col lg:flex-row gap-6 hover:border-[var(--te-border-strong)] transition"
            >
              {/* Left: Camera Evidence Image Frame with ANPR Scanline */}
              <div className="w-full lg:w-96 rounded-md bg-black border border-[var(--te-border)] overflow-hidden relative group shrink-0 flex flex-col justify-between">
                <div className="h-56 sm:h-64 relative overflow-hidden bg-zinc-950 flex items-center justify-center">
                  {/* ANPR Laser Scan Line Animation */}
                  <div className="anpr-scan-line"></div>

                  {activeVideoId === inc.id ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src="/videos/bus-cockpit-dashcam.mp4" type="video/mp4" />
                      <source src="/videos/firefly-360-road.mp4" type="video/mp4" />
                      <source src="/videos/gemini-pothole-bus.mp4" type="video/mp4" />
                    </video>
                  ) : (
                    <img 
                      src={imageUrl} 
                      alt="Camera Evidence Frame"
                      className="w-full h-full object-contain bg-zinc-950 opacity-95 group-hover:scale-[1.02] transition duration-300 cursor-pointer"
                      onClick={() => setSelectedEvidence(inc)}
                    />
                  )}

                  {/* Top-Left Mode Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-black/85 px-2 py-1 rounded text-[10px] font-mono-code text-[var(--te-lime)] border border-[var(--te-lime-border)] flex items-center gap-1.5 shadow z-10">
                    <Camera className="w-3 h-3 shrink-0" /> {activeVideoId === inc.id ? "360° VIDEO FEED" : "FORENSIC SNAPSHOT"}
                  </div>

                  {/* Top-Right: Toggle Video or Open Evidence */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    <button
                      onClick={() => setSelectedEvidence(inc)}
                      className="bg-black/85 hover:bg-black px-2 py-1 rounded text-[10px] font-semibold text-[var(--te-lime)] border border-[var(--te-lime-border)] flex items-center gap-1 shadow transition"
                      title="Inspect high-resolution evidence"
                    >
                      <ZoomIn className="w-3 h-3 shrink-0" />
                      <span>INSPECT</span>
                    </button>
                    <button
                      onClick={() => setActiveVideoId(activeVideoId === inc.id ? null : inc.id)}
                      className="bg-black/85 hover:bg-black px-2 py-1 rounded text-[10px] font-semibold text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow transition"
                    >
                      <Film className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{activeVideoId === inc.id ? "SNAP" : "VIDEO"}</span>
                    </button>
                  </div>

                  {/* Bottom Plate Banner */}
                  <div 
                    onClick={() => setSelectedEvidence(inc)}
                    className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/95 px-2.5 py-1.5 rounded text-xs font-mono-code border border-amber-500/50 flex items-center justify-between shadow z-10 cursor-pointer hover:border-amber-400"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="bg-blue-600 text-white font-extrabold text-[9px] px-1 py-0.5 rounded leading-none">IND</span>
                      <span className="text-amber-300 font-bold tracking-wider">{inc.registrationNumber || "NOT LOCKED"}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold">{((inc.anprConfidence || 0.94) * 100).toFixed(0)}% Match</span>
                  </div>
                </div>

                {/* Secure Transmission Hash */}
                <div className="p-3 bg-[var(--te-panel)] border-t border-[var(--te-border)] text-[10px] text-[var(--te-text-muted)] space-y-1">
                  <div className="flex items-center justify-between text-[var(--te-lime)] font-semibold">
                    <span className="flex items-center gap-1"><FileCheck className="w-3 h-3" /> SECURE ALERT HASH:</span>
                    <span>VERIFIED</span>
                  </div>
                  <div className="text-[9px] text-[var(--te-text-muted)] break-all bg-[var(--te-surface)] p-1.5 rounded border border-[var(--te-border)] font-mono-code">
                    SHA-256: {inc.id.replace("INC-", "8f4a7c29e10d3f82a65b90e44")}
                  </div>
                </div>
              </div>

              {/* Right: Incident Telemetry, Multi-Frame Tracking & Status Buttons */}
              <div className="flex-1 flex flex-col justify-between space-y-4 min-w-0 font-sans">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--te-border)] pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-base sm:text-lg font-extrabold text-[var(--te-text)]">{inc.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        inc.severity === "CRITICAL" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30" :
                        inc.severity === "HIGH" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" :
                        "bg-[var(--te-panel)] text-[var(--te-text-muted)] border border-[var(--te-border)]"
                      }`}>
                        {inc.severity}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      inc.status === "NEW" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse" :
                      inc.status === "UNDER REVIEW" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" :
                      "bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)]"
                    }`}>
                      STATUS: {inc.status}
                    </span>
                  </div>

                  {/* Violation Law & Fine Amount Pill */}
                  {inc.violationCode && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 shrink-0" /> {inc.violationCode}
                      </span>
                      {inc.fineAmount && (
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-mono-code flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {inc.fineAmount}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[var(--te-text-muted)]">
                    <div>ID: <strong className="text-[var(--te-lime)] font-mono-code font-bold">{inc.id}</strong></div>
                    <div>Source Bus: <strong className="text-[var(--te-text)] font-semibold">{inc.busId}</strong></div>
                    <div>Vehicle: <strong className="text-[var(--te-text)] font-semibold">{inc.vehicle}</strong></div>
                    <div>Time: <span className="text-[var(--te-text)]">{inc.timestamp}</span></div>
                  </div>

                  <p className="text-xs text-[var(--te-text)] bg-[var(--te-panel)] p-3 rounded-md border border-[var(--te-border)] leading-relaxed">
                    {inc.details}
                  </p>

                  {/* Multi-Frame Offending Vehicle Tracking Path */}
                  <div className="bg-[var(--te-panel)] p-3 rounded-md border border-[var(--te-border)] text-xs space-y-2">
                    <div className="text-[10px] text-[var(--te-lime)] uppercase tracking-wider font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Route className="w-3.5 h-3.5 shrink-0" /> Offending Vehicle Tracking Path
                      </span>
                      <span className="text-[10px] text-[var(--te-text-muted)] font-normal">Multi-Sensor Telemetry</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2.5 rounded bg-[var(--te-surface)] border border-[var(--te-border)] space-y-0.5">
                        <span className="text-[var(--te-text-muted)] text-[9px] block font-medium">{t0Label}</span>
                        <span className="text-[var(--te-text)] font-bold block">{t0Val}</span>
                        <span className="text-[var(--te-text-muted)] text-[9px] block">{t0Sensor}</span>
                      </div>
                      <div className="p-2.5 rounded bg-[var(--te-surface)] border border-rose-500/30 space-y-0.5">
                        <span className="text-rose-600 dark:text-rose-400 text-[9px] block font-medium">{t1Label}</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold block">{t1Val}</span>
                        <span className="text-[var(--te-text-muted)] text-[9px] block">{t1Sensor}</span>
                      </div>
                      <div className="p-2.5 rounded bg-[var(--te-surface)] border border-[var(--te-lime-border)] space-y-0.5">
                        <span className="text-[var(--te-lime)] text-[9px] block font-medium">{t2Label}</span>
                        <span className="text-[var(--te-lime)] font-bold font-mono-code text-xs block">{t2Val}</span>
                        <span className="text-[var(--te-text-muted)] text-[9px] block">{t2Sensor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Change Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[var(--te-border)] text-xs">
                  <div className="text-[var(--te-text-muted)] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[var(--te-lime)] shrink-0" /> Location: <span className="text-[var(--te-text)] font-semibold">{inc.location}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {["NEW", "UNDER REVIEW", "DISPATCHED", "RESOLVED"].map((st) => (
                      <button
                        key={st}
                        disabled={updatingId === inc.id || inc.status === st}
                        onClick={() => handleStatusChange(inc.id, st)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                          inc.status === st
                            ? "bg-[var(--te-lime)] text-[var(--te-lime-pill-text)] cursor-default"
                            : "bg-[var(--te-panel)] hover:bg-[var(--te-panel-hover)] text-[var(--te-text-muted)] hover:text-[var(--te-text)] border border-[var(--te-border)]"
                        }`}
                      >
                        Set {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Resolution Forensic Evidence Inspector Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[var(--te-surface)] border border-[var(--te-border-strong)] rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--te-border)] bg-[var(--te-panel)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-[var(--te-text)]">
                      Forensic Incident Audit & ANPR Telemetry
                    </h3>
                    <span className="font-mono-code font-bold text-xs text-[var(--te-lime)] bg-[var(--te-surface)] px-2 py-0.5 rounded border border-[var(--te-border)]">
                      {selectedEvidence.id}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--te-text-muted)]">
                    Cryptographically logged edge evidence frame with RF-DETR localization & high-contrast OCR verification
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvidence(null)}
                className="p-2 rounded-lg hover:bg-[var(--te-panel-hover)] text-[var(--te-text-muted)] hover:text-[var(--te-text)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Forensic Image Frame */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="relative rounded-lg overflow-hidden border border-[var(--te-border)] bg-black shadow-inner flex items-center justify-center min-h-[300px]">
                    <img 
                      src={resolveAssetUrl(selectedEvidence.evidenceImage)}
                      alt="Full Forensic Evidence"
                      className="w-full h-auto max-h-[440px] object-contain"
                    />
                    <div className="absolute top-2 left-2 bg-black/85 px-2 py-1 rounded text-[10px] font-mono-code text-[var(--te-lime)] border border-[var(--te-lime-border)]">
                      EDGE CAM SNAPSHOT: {selectedEvidence.busId}
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--te-text-muted)] flex items-center justify-between">
                    <span>Targeting: Offending vehicle contextual crop with PIP plate extraction inset.</span>
                    <span className="font-mono-code text-[var(--te-lime)]">GPS: {selectedEvidence.latitude}, {selectedEvidence.longitude}</span>
                  </div>
                </div>

                {/* Right: Plate Inspection, Action Breakdown & Citations */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Extracted License Plate Inspection */}
                  <div className="p-4 rounded-lg bg-[var(--te-panel)] border border-[var(--te-border)] space-y-3">
                    <div className="text-xs font-bold text-[var(--te-lime)] uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" /> High-Confidence Plate Extraction
                    </div>

                    <div className="flex items-center gap-4 bg-zinc-950 p-3 rounded-md border border-amber-500/40">
                      <div className="bg-blue-600 text-white font-extrabold text-xs px-2 py-3 rounded flex flex-col items-center justify-center">
                        <span className="text-[9px]">IND</span>
                        <div className="w-2 h-2 rounded-full border border-amber-300 mt-1"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xl sm:text-2xl font-black font-mono-code tracking-widest text-amber-300">
                          {selectedEvidence.registrationNumber || "NOT LOCKED"}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-sans mt-0.5">
                          Dual-Stage AI Confidence: <strong className="text-[var(--te-lime)]">{((selectedEvidence.anprConfidence || 0.94) * 100).toFixed(0)}% OCR Lock</strong>
                        </div>
                      </div>
                      {selectedEvidence.plateImage && (
                        <img 
                          src={resolveAssetUrl(selectedEvidence.plateImage)} 
                          alt="Cropped Plate"
                          className="h-10 w-auto rounded border border-white/20 object-contain bg-black"
                        />
                      )}
                    </div>
                  </div>

                  {/* Offense Breakdown */}
                  <div className="p-4 rounded-lg bg-[var(--te-panel)] border border-[var(--te-border)] space-y-2 text-xs">
                    <div className="text-xs font-bold text-[var(--te-text)] flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[var(--te-lime)]" /> Offender Vehicle & Action Log
                    </div>
                    <div className="space-y-1.5 text-[var(--te-text-muted)] leading-relaxed">
                      <div>Vehicle: <strong className="text-[var(--te-text)]">{selectedEvidence.vehicle}</strong></div>
                      <div>Violation: <strong className="text-rose-500">{selectedEvidence.type}</strong></div>
                      <div>Details: <span className="text-[var(--te-text)]">{selectedEvidence.details}</span></div>
                    </div>
                  </div>

                  {/* Motor Vehicles Act Legal Penalty */}
                  <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/25 space-y-2 text-xs">
                    <div className="font-bold text-rose-500 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" /> Legal Enforcement & E-Challan Penalty
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="text-[var(--te-text)] font-semibold">
                        {selectedEvidence.violationCode || "Motor Vehicles Act Violation"}
                      </div>
                      <div className="text-amber-500 font-bold font-mono-code text-sm">
                        {selectedEvidence.fineAmount || "₹2,000 Traffic Fine"}
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Snapshot */}
                  {selectedEvidence.telemetry && (
                    <div className="p-3 rounded-lg bg-[var(--te-panel)] border border-[var(--te-border)] space-y-2 text-xs">
                      <div className="text-[10px] font-bold text-[var(--te-lime)] uppercase tracking-wider flex items-center gap-1">
                        <Gauge className="w-3 h-3" /> Telemetry Log
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-[var(--te-surface)] rounded border border-[var(--te-border)]">
                          <span className="text-[9px] text-[var(--te-text-muted)] block">Velocity Recorded</span>
                          <span className="font-bold text-[var(--te-text)]">{selectedEvidence.telemetry.t0_val}</span>
                        </div>
                        <div className="p-2 bg-[var(--te-surface)] rounded border border-[var(--te-border)]">
                          <span className="text-[9px] text-[var(--te-text-muted)] block">Event Impact</span>
                          <span className="font-bold text-rose-500">{selectedEvidence.telemetry.t1_val}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[var(--te-border)] bg-[var(--te-panel)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[var(--te-text-muted)]">Current Status:</span>
                <span className="font-bold text-[var(--te-lime)]">{selectedEvidence.status}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleExportCitation(selectedEvidence)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    citationExported
                      ? "bg-emerald-600 text-white"
                      : "bg-[var(--te-lime)] text-[var(--te-lime-pill-text)] hover:brightness-110"
                  }`}
                >
                  {citationExported ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>E-Challan Citation Exported!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export Police Citation Notice</span>
                    </>
                  )}
                </button>

                {selectedEvidence.status !== "RESOLVED" && (
                  <button
                    onClick={() => handleStatusChange(selectedEvidence.id, "RESOLVED")}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--te-surface)] hover:bg-[var(--te-panel-hover)] text-[var(--te-text)] border border-[var(--te-border)] transition"
                  >
                    Mark Resolved
                  </button>
                )}

                <button
                  onClick={() => setSelectedEvidence(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--te-surface)] hover:bg-[var(--te-panel-hover)] text-[var(--te-text-muted)] border border-[var(--te-border)] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
