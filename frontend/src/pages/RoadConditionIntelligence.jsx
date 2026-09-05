import React from "react";
import { AlertTriangle, Wrench, Bus, MapPin, CheckCircle2, Shield } from "lucide-react";

export default function RoadConditionIntelligence({ roadIssues = [] }) {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 border-amber-500/25">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs mb-1">
            <Wrench className="w-3.5 h-3.5" /> ACTIONABLE MUNICIPAL ROAD DEFECT INTELLIGENCE
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Corridor Defect Priorities & Repair Schedule
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Weighted priority scores (0–100) computed from multi-bus edge detections to optimize municipal public works dispatch.
          </p>
        </div>
      </div>

      {/* Priority Scoring Formula Explainer */}
      <div className="glass-panel p-4 bg-slate-950/80 border-slate-800 text-xs font-mono flex items-center justify-between gap-4">
        <div className="text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span><strong className="text-cyan-400">Priority Score Formula:</strong> Defect Frequency + Traffic Volume + Severity Weight + Unique Bus Corroborations</span>
        </div>
        <div className="text-slate-400 text-[11px] font-bold">
          Score &gt; 85 = Urgent Municipal Intervention (P1)
        </div>
      </div>

      {/* Corridor Cards */}
      <div className="space-y-5">
        {roadIssues.map((issue) => (
          <div 
            key={issue.id}
            className="glass-panel p-6 border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-400" /> {issue.location}
                  </span>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                    issue.severity === "CRITICAL" ? "bg-rose-950/90 text-rose-300 border border-rose-800" :
                    issue.severity === "HIGH" ? "bg-amber-950/90 text-amber-300 border border-amber-800" :
                    "bg-blue-950/90 text-blue-300 border border-blue-800"
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-4">
                  <span>Defect: <strong className="text-slate-200">{issue.issueType}</strong></span>
                  <span>ID: <span className="font-mono text-cyan-400">{issue.id}</span></span>
                  <span>Last Reported: <span className="text-slate-300">{issue.lastReported}</span></span>
                </div>
              </div>

              {/* Priority Score Gauge */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Priority Score</div>
                  <div className="text-3xl font-black text-white">
                    {issue.priorityScore}<span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 shadow-inner">
                  <div className={`w-full h-full rounded-xl flex items-center justify-center font-bold text-xs font-mono shadow-md ${
                    issue.priorityScore >= 85 ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" :
                    issue.priorityScore >= 70 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" :
                    "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  }`}>
                    {issue.priorityScore >= 85 ? "P1" : issue.priorityScore >= 70 ? "P2" : "P3"}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">TOTAL LOGGED INCIDENTS</div>
                <div className="text-xl font-bold text-white font-mono">{issue.reports} Reports Logged</div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">CORROBORATING BUS UNITS</div>
                <div className="text-xl font-bold text-cyan-400 font-mono flex items-center gap-2">
                  <Bus className="w-4 h-4" /> {issue.busesReporting} Buses Confirmed
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">MUNICIPAL DISPATCH STATUS</div>
                <div className="text-sm font-bold text-amber-400 font-mono">{issue.status}</div>
              </div>
            </div>

            {/* Municipal Action Recommendation */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-2xl text-xs flex items-start gap-3.5">
              <Wrench className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-400">Actionable Municipal Recommendation:</span>
                <p className="text-slate-200 mt-1 leading-relaxed">{issue.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
