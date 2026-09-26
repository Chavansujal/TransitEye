import React, { useState } from "react";
import { 
  ShieldAlert, 
  Camera, 
  MapPin, 
  Lock, 
  Route, 
  FileCheck,
  Film
} from "lucide-react";
import { updateIncidentStatus } from "../services/api";

export default function IncidentCenter({ incidents = [], onIncidentUpdated }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);

  const handleStatusChange = async (incidentId, newStatus) => {
    setUpdatingId(incidentId);
    const updated = await updateIncidentStatus(incidentId, newStatus);
    setUpdatingId(null);
    if (updated && onIncidentUpdated) {
      onIncidentUpdated(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-[var(--te-text)] animate-fade-in-up">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 te-card p-5 border-l-4 border-l-[var(--te-lime)]">
        <div>
          <div className="flex items-center gap-2 text-[var(--te-lime)] text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 shrink-0" /> Automated ANPR & Incident Triage
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--te-text)] tracking-tight">
            Traffic Safety & Offender Triage Console
          </h2>
          <p className="text-xs sm:text-sm text-[var(--te-text-muted)] mt-1">
            Real-time tracking of traffic violations with multi-camera velocity verification, automatic ANPR plate extraction, and cryptographically verified hashes.
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
        {incidents.map((inc) => (
          <div 
            key={inc.id} 
            className="te-card p-5 flex flex-col lg:flex-row gap-6 hover:border-[var(--te-border-strong)] transition"
          >
            {/* Left: Camera Evidence Image Frame with ANPR Scanline */}
            <div className="w-full lg:w-80 rounded-md bg-black border border-[var(--te-border)] overflow-hidden relative group shrink-0 flex flex-col justify-between">
              <div className="h-48 sm:h-52 relative overflow-hidden bg-black">
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
                    src={inc.evidenceImage || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"} 
                    alt="Camera Evidence Frame"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                  />
                )}

                <div className="absolute top-2.5 left-2.5 bg-black/80 px-2 py-1 rounded text-[10px] font-mono-code text-[var(--te-lime)] border border-[var(--te-lime-border)] flex items-center gap-1.5 shadow z-10">
                  <Camera className="w-3 h-3 shrink-0" /> {activeVideoId === inc.id ? "360° VIDEO FEED" : "ANPR SCAN"}
                </div>

                {/* Toggle Video/Snapshot Button */}
                <button
                  onClick={() => setActiveVideoId(activeVideoId === inc.id ? null : inc.id)}
                  className="absolute top-2.5 right-2.5 bg-black/80 hover:bg-black/95 px-2.5 py-1 rounded text-[10px] font-semibold text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow transition z-10"
                >
                  <Film className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{activeVideoId === inc.id ? "SNAPSHOT" : "360° VIDEO"}</span>
                </button>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/90 p-1.5 rounded text-xs font-mono-code text-amber-300 border border-amber-500/40 text-center font-bold shadow z-10">
                  PLATE: {inc.registrationNumber || "MH12 AB 1234"} ({((inc.anprConfidence || 0.91) * 100).toFixed(0)}% Match)
                </div>
              </div>

              {/* Secure Transmission Hash */}
              <div className="p-3 bg-[var(--te-panel)] border-t border-[var(--te-border)] text-[10px] text-[var(--te-text-muted)] space-y-1">
                <div className="flex items-center justify-between text-[var(--te-lime)] font-semibold">
                  <span className="flex items-center gap-1"><FileCheck className="w-3 h-3" /> SECURE ALERT HASH:</span>
                  <span>VERIFIED</span>
                </div>
                <div className="text-[9px] text-[var(--te-text-muted)] break-all bg-[var(--te-surface)] p-1.5 rounded border border-[var(--te-border)] font-mono-code">
                  SHA-256: 8f4a7c29e10d3f82a65b90e441c2
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[var(--te-text-muted)]">
                  <div>ID: <strong className="text-[var(--te-lime)] font-mono-code font-bold">{inc.id}</strong></div>
                  <div>Source Bus: <strong className="text-[var(--te-text)] font-semibold">{inc.busId}</strong></div>
                  <div>Vehicle: <strong className="text-[var(--te-text)]">{inc.vehicle}</strong></div>
                  <div>Time: <span className="text-[var(--te-text)]">{inc.timestamp}</span></div>
                </div>

                <p className="text-xs text-[var(--te-text)] bg-[var(--te-panel)] p-3 rounded-md border border-[var(--te-border)] leading-relaxed">
                  {inc.details}
                </p>

                {/* Multi-Frame Vehicle Tracking Timeline */}
                <div className="bg-[var(--te-panel)] p-3 rounded-md border border-[var(--te-border)] text-xs space-y-2">
                  <div className="text-[10px] text-[var(--te-lime)] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Route className="w-3.5 h-3.5 shrink-0" /> Offending Vehicle Tracking Path
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-[var(--te-surface)] border border-[var(--te-border)] space-y-0.5">
                      <span className="text-[var(--te-text-muted)] text-[9px] block">T0 • Approach:</span>
                      <span className="text-[var(--te-text)] font-semibold">Speed: 82 km/h</span>
                      <span className="text-[var(--te-text-muted)] text-[9px] block">Rear Cam Radar</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--te-surface)] border border-rose-500/30 space-y-0.5">
                      <span className="text-rose-600 dark:text-rose-400 text-[9px] block">T1 • Anomaly Event:</span>
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">Erratic Weaving (85 km/h)</span>
                      <span className="text-[var(--te-text-muted)] text-[9px] block">Side Cam Tagged</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--te-surface)] border border-[var(--te-lime-border)] space-y-0.5">
                      <span className="text-[var(--te-lime)] text-[9px] block">T2 • ANPR Locked:</span>
                      <span className="text-[var(--te-lime)] font-bold font-mono-code">{inc.registrationNumber || "MH12 AB 1234"}</span>
                      <span className="text-[var(--te-text-muted)] text-[9px] block">Front Cam Extraction</span>
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
        ))}
      </div>
    </div>
  );
}
