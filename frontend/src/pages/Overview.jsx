import React from "react";
import { 
  Bus, 
  AlertTriangle, 
  ShieldAlert, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Zap,
  ArrowRight,
  Activity,
  Layers,
  Sparkles
} from "lucide-react";

export default function Overview({ buses = [], events = [], roadIssues = [], incidents = [], onNavigate }) {
  const activeBuses = buses.filter(b => b.status === "ONLINE" || b.status === "INCIDENT").length;
  const criticalCount = incidents.filter(i => i.status === "NEW" || i.severity === "CRITICAL").length;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Hero Banner with Modern Gradient Glow */}
      <div className="relative glass-panel p-4 sm:p-6 lg:p-8 overflow-hidden bg-gradient-to-r from-slate-950 via-[#0d1424] to-cyan-950/40 border-cyan-500/25 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -bottom-16 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-mono text-[10px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>MOBILE SENSING INFRASTRUCTURE • SIH 26124</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
              Urban Intelligence Operations Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
              Public transport buses transformed into mobile Edge AI sensing nodes. Detects potholes, traffic bottlenecks, pedestrian hazards & rash driving in real-time across Pune.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate("live")}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition duration-300 shadow-xl shadow-cyan-500/25"
            >
              Launch Live AI Feed <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Active Buses */}
        <div className="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-blue-500/40">
          <div className="flex items-center justify-between text-slate-400 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">Active Sensing Fleet</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Bus className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{activeBuses} <span className="text-slate-500 text-sm sm:text-base font-normal">/ {buses.length}</span></div>
          <div className="text-[11px] sm:text-xs text-emerald-400 flex items-center gap-1.5 mt-2 sm:mt-3 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" /> 91.6% Fleet Operational
          </div>
        </div>

        {/* Events Today */}
        <div className="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40">
          <div className="flex items-center justify-between text-slate-400 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">Events Logged Today</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{events.length + 138}</div>
          <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 mt-2 sm:mt-3 font-mono">
            <span>Potholes, Bottlenecks & Alerts</span>
          </div>
        </div>

        {/* Road Defect Priorities */}
        <div className="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-rose-500/40">
          <div className="flex items-center justify-between text-slate-400 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">Defect Priority Corridors</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{roadIssues.length} <span className="text-slate-500 text-sm sm:text-base font-normal">Corridors</span></div>
          <div className="text-[11px] sm:text-xs text-rose-400 flex items-center gap-1.5 mt-2 sm:mt-3 font-mono font-semibold">
            <span>Max Priority Score: 92/100</span>
          </div>
        </div>

        {/* Critical ANPR Incidents */}
        <div className="glass-panel p-4 sm:p-5 relative overflow-hidden group hover:border-purple-500/40">
          <div className="flex items-center justify-between text-slate-400 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider font-mono">ANPR Incidents</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{incidents.length}</div>
          <div className="text-[11px] sm:text-xs text-purple-400 flex items-center gap-1.5 mt-2 sm:mt-3 font-mono font-semibold">
            <span>{criticalCount} Actionable Dispatches</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Edge AI Optimization + Actionable Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Edge AI Bandwidth Savings Widget */}
        <div className="glass-panel p-4 sm:p-6 lg:col-span-1 space-y-4 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" /> Edge AI Bandwidth Savings
            </h3>
            <span className="text-[9px] sm:text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono font-bold shrink-0">
              97.4% REDUCTION
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Public bus cameras process HD video locally on NVIDIA Jetson edge acceleration units. Only compact metadata & compressed incident snapshots are uploaded to the cloud command server.
          </p>

          <div className="space-y-3 bg-slate-950/80 p-3.5 sm:p-4 rounded-xl border border-slate-800/80 font-mono text-xs">
            <div className="flex justify-between text-slate-300 text-[11px] sm:text-xs">
              <span>Edge Processed:</span>
              <span className="text-emerald-400 font-bold">97.4% (14,250)</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[97.4%] shadow-sm shadow-emerald-500"></div>
            </div>

            <div className="flex justify-between text-slate-300 pt-1 text-[11px] sm:text-xs">
              <span>Events Transmitted:</span>
              <span className="text-cyan-400 font-bold">2.6% (390)</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[2.6%] shadow-sm shadow-cyan-500"></div>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 bg-cyan-950/40 border border-cyan-800/60 rounded-xl flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Estimated 5G Saved:</span>
            <span className="text-cyan-400 font-bold text-xs sm:text-sm">~48.6 GB / day</span>
          </div>
        </div>

        {/* Priority Corridors List */}
        <div className="glass-panel p-4 sm:p-6 lg:col-span-2 space-y-4 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" /> Actionable Municipal Road Priorities
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Synthesis of multi-bus defect corroborations across Pune routes.
              </p>
            </div>
            <button
              onClick={() => onNavigate("road_issues")}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold font-mono shrink-0 ml-2"
            >
              VIEW ALL <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {roadIssues.map((issue) => (
              <div 
                key={issue.id} 
                className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white">{issue.location}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-extrabold tracking-wider ${
                      issue.severity === "CRITICAL" ? "bg-rose-950/90 text-rose-300 border border-rose-800" :
                      issue.severity === "HIGH" ? "bg-amber-950/90 text-amber-300 border border-amber-800" :
                      "bg-blue-950/90 text-blue-300 border border-blue-800"
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Defect: <strong className="text-slate-200">{issue.issueType}</strong></span>
                    <span>Reports: <strong className="text-slate-200">{issue.reports}</strong> ({issue.busesReporting} buses)</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-cyan-300/90 italic">
                    💡 Recommendation: "{issue.recommendation}"
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:self-center">
                  <div className="text-left sm:text-right font-mono">
                    <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest">Priority Score</div>
                    <div className="text-xl sm:text-2xl font-black text-white">{issue.priorityScore}<span className="text-xs text-slate-500 font-normal">/100</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Event Stream Table */}
      <div className="glass-panel p-4 sm:p-6 space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" /> Recent Edge-Filtered Event Stream
          </h3>
          <span className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 font-mono shrink-0">
            <span className="live-dot"></span> <span className="hidden sm:inline">Telemetry Broadcast Stream</span><span className="sm:hidden">Live</span>
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono">
              <tr>
                <th className="p-3">Event ID</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Bus Source</th>
                <th className="p-3">Location Name</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono text-slate-300">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 text-cyan-400 font-bold">{evt.id}</td>
                  <td className="p-3 text-white font-semibold">{evt.type}</td>
                  <td className="p-3 text-slate-400">{evt.busId}</td>
                  <td className="p-3 text-slate-300">{evt.locationName || "Pune Transit"}</td>
                  <td className="p-3 text-emerald-400 font-bold">{(evt.confidence * 100).toFixed(0)}%</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      evt.severity === "CRITICAL" ? "bg-rose-950/80 text-rose-300 border border-rose-800" :
                      evt.severity === "HIGH" ? "bg-amber-950/80 text-amber-300 border border-amber-800" :
                      "bg-blue-950/80 text-blue-300 border border-blue-800"
                    }`}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">{evt.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
