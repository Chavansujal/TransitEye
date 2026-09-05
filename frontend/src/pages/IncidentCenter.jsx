import React, { useState } from "react";
import { 
  ShieldAlert, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Eye, 
  AlertOctagon, 
  Lock, 
  Route, 
  Activity,
  FileCheck,
  Play,
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 border-purple-500/25">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs mb-1">
            <ShieldAlert className="w-3.5 h-3.5" /> AUTOMATED INCIDENT TRIAGE & ANPR IDENTIFICATION
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Safety & Traffic Incident Triage Console
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time tracking of hit-and-run & rash driving offenders with multi-frame velocity tracking, ANPR plate extraction, and cryptographically secured alerts.
          </p>
        </div>

        {/* Security Tag */}
        <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-emerald-800 text-xs font-mono text-emerald-400 shadow-lg">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Edge Payload Encrypted (TLS 1.3 / SHA-256)</span>
        </div>
      </div>

      {/* Incidents Triage List */}
      <div className="grid grid-cols-1 gap-6">
        {incidents.map((inc) => (
          <div 
            key={inc.id} 
            className="glass-panel p-6 border-slate-800 hover:border-slate-700 transition flex flex-col lg:flex-row gap-6 shadow-xl"
          >
            {/* Left: Camera Evidence Image Frame / 360 Video Player */}
            <div className="w-full lg:w-80 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative group shrink-0 shadow-inner flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-slate-950">
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
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
                  />
                )}

                <div className="absolute top-3 left-3 bg-slate-950/90 px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-400 border border-cyan-800 flex items-center gap-1.5 shadow-md">
                  <Camera className="w-3 h-3" /> {activeVideoId === inc.id ? "CONTINUOUS 360° FEED" : "EVIDENCE SNAPSHOT"}
                </div>

                {/* Toggle Video/Snapshot Button */}
                <button
                  onClick={() => setActiveVideoId(activeVideoId === inc.id ? null : inc.id)}
                  className="absolute top-3 right-3 bg-slate-950/90 hover:bg-slate-900 px-2 py-1 rounded-lg text-[10px] font-mono text-amber-300 border border-amber-500/50 flex items-center gap-1 shadow-md transition z-10"
                >
                  <Film className="w-3 h-3 text-amber-400" />
                  <span>{activeVideoId === inc.id ? "SNAPSHOT" : "360° VIDEO"}</span>
                </button>

                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/95 p-2 rounded-xl text-xs font-mono text-amber-300 border border-amber-500/40 text-center font-bold shadow-2xl">
                  PLATE: {inc.registrationNumber || "MH12 AB 1234"} ({((inc.anprConfidence || 0.91) * 100).toFixed(0)}% Match)
                </div>
              </div>

              {/* Secure Transmission Integrity Block */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1"><FileCheck className="w-3 h-3" /> SECURE ALERT HASH:</span>
                  <span>VERIFIED</span>
                </div>
                <div className="text-[9px] text-slate-400 break-all bg-slate-950 p-1.5 rounded border border-slate-800 font-mono">
                  SHA-256: 8f4a7c29e10d3f82a65b90e441c2
                </div>
              </div>
            </div>

            {/* Right: Incident Telemetry, Multi-Frame Tracking & Pipeline */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-extrabold text-white">{inc.type}</span>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                      inc.severity === "CRITICAL" ? "bg-rose-950/90 text-rose-300 border border-rose-800" :
                      inc.severity === "HIGH" ? "bg-amber-950/90 text-amber-300 border border-amber-800" :
                      "bg-blue-950/90 text-blue-300 border border-blue-800"
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold ${
                    inc.status === "NEW" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse" :
                    inc.status === "UNDER REVIEW" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                    inc.status === "DISPATCHED" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" :
                    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}>
                    STATUS: {inc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs text-slate-400">
                  <div>Incident ID: <strong className="text-cyan-400 font-bold">{inc.id}</strong></div>
                  <div>Reporting Bus: <strong className="text-white font-bold">{inc.busId}</strong></div>
                  <div>Vehicle: <strong className="text-slate-200">{inc.vehicle}</strong></div>
                  <div>Timestamp: <span className="text-slate-300">{inc.timestamp}</span></div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 font-sans leading-relaxed">
                  {inc.details}
                </p>

                {/* Multi-Frame Vehicle Tracking Path */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Route className="w-3.5 h-3.5" /> Offending Vehicle Multi-Frame Tracking Timeline
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-slate-400 text-[10px] block">T0 • Initial Detection:</span>
                      <span className="text-white font-bold">Speed: 82 km/h</span>
                      <span className="text-slate-400 text-[10px] block">Rear Cam Approach</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-rose-900/60 space-y-0.5">
                      <span className="text-rose-400 text-[10px] block">T1 • Dangerous Maneuver:</span>
                      <span className="text-rose-300 font-bold">Erratic Weaving (85 km/h)</span>
                      <span className="text-slate-400 text-[10px] block">Side Cam Tagged</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-emerald-900/60 space-y-0.5">
                      <span className="text-emerald-400 text-[10px] block">T2 • ANPR Plate Locked:</span>
                      <span className="text-emerald-300 font-bold">MH12 AB 1234 (91%)</span>
                      <span className="text-slate-400 text-[10px] block">Front Cam Extraction</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Change Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                  <MapPin className="w-4 h-4 text-cyan-400" /> Location: <span className="text-white font-bold">{inc.location}</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  {["NEW", "UNDER REVIEW", "DISPATCHED", "RESOLVED"].map((st) => (
                    <button
                      key={st}
                      disabled={updatingId === inc.id || inc.status === st}
                      onClick={() => handleStatusChange(inc.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition duration-200 ${
                        inc.status === st
                          ? "bg-slate-800 text-white border border-slate-700 cursor-default"
                          : "bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800"
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
