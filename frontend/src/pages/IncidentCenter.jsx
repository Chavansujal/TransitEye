import React, { useState } from "react";
import { ShieldAlert, Camera, MapPin, CheckCircle2, Clock, Eye, AlertOctagon } from "lucide-react";
import { updateIncidentStatus } from "../services/api";

export default function IncidentCenter({ incidents = [], onIncidentUpdated }) {
  const [updatingId, setUpdatingId] = useState(null);

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
            High-priority road incidents automatically flagged by bus edge cameras. ANPR license plate extraction enables rapid traffic control dispatch.
          </p>
        </div>
      </div>

      {/* Incidents Triage List */}
      <div className="grid grid-cols-1 gap-6">
        {incidents.map((inc) => (
          <div 
            key={inc.id} 
            className="glass-panel p-6 border-slate-800 hover:border-slate-700 transition flex flex-col lg:flex-row gap-6 shadow-xl"
          >
            {/* Left: Camera Evidence Image Frame */}
            <div className="w-full lg:w-80 h-52 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative group shrink-0 shadow-inner">
              <img 
                src={inc.evidenceImage || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80"} 
                alt="Camera Evidence Frame"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/90 px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-400 border border-cyan-800 flex items-center gap-1.5 shadow-md">
                <Camera className="w-3 h-3" /> BUS CAMERA EVIDENCE SNAPSHOT
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/95 p-2.5 rounded-xl text-xs font-mono text-amber-300 border border-amber-500/40 text-center font-bold shadow-2xl">
                PLATE: {inc.registrationNumber || "MH12 AB 1234"} ({((inc.anprConfidence || 0.91) * 100).toFixed(0)}% Match)
              </div>
            </div>

            {/* Right: Incident Telemetry & Status Pipeline */}
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
                  <div>Time: <span className="text-slate-300">{inc.timestamp}</span></div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 font-sans leading-relaxed">
                  {inc.details}
                </p>
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
