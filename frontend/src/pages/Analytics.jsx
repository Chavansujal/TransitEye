import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  AreaChart, 
  Area 
} from "recharts";
import { BarChart3, TrendingUp, Navigation } from "lucide-react";

export default function Analytics({ analytics = {} }) {
  const eventsByTypeData = analytics.eventsByType || [
    { name: "Pothole Defect", count: 58, color: "#ef4444" },
    { name: "Traffic Congestion", count: 42, color: "#f59e0b" },
    { name: "Pedestrian Hazard", count: 24, color: "#3b82f6" },
    { name: "Rash Driving / ANPR", count: 18, color: "#a855f7" }
  ];

  const hourlyData = analytics.trafficDensityHourly || [
    { time: "06:00", density: 15 },
    { time: "08:00", density: 45 },
    { time: "10:00", density: 78 },
    { time: "12:00", density: 52 },
    { time: "14:00", density: 48 },
    { time: "16:00", density: 86 },
    { time: "18:00", density: 94 },
    { time: "20:00", density: 65 }
  ];

  const odAnalysis = analytics.odAnalysis || [
    { route: "Route 17", origin: "Pune Station", destination: "Swargate", avgDelayMin: 11, trafficImpact: "HIGH", cause: "Underpass bottleneck & double parking" },
    { route: "Route 38", origin: "Sinhagad Road", destination: "Deccan", avgDelayMin: 16, trafficImpact: "SEVERE", cause: "Flyover construction & road pothole clusters" },
    { route: "Route 24", origin: "Kothrud Depot", destination: "Viman Nagar", avgDelayMin: 6, trafficImpact: "MEDIUM", cause: "Peak hour signal delay at University Chowk" },
    { route: "Route 105", origin: "Hadapsar", destination: "Hinjewadi", avgDelayMin: 14, trafficImpact: "HIGH", cause: "Highway bypass merging congestion" }
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 sm:p-6 border-cyan-500/25">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] sm:text-xs mb-1">
            <BarChart3 className="w-3.5 h-3.5 shrink-0" /> SMART CITY URBAN INTELLIGENCE ANALYTICS
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Traffic Density, OD Route Delays & Defect Trends
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Longitudinal urban analytics aggregated from continuous bus camera coverage across Pune transit corridors.
          </p>
        </div>
      </div>

      {/* Origin-Destination (OD) Route Delay Section */}
      <div className="glass-panel p-4 sm:p-6 space-y-4 border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" /> Origin-Destination (OD) Route Delay Analysis
          </h3>
          <span className="text-[10px] sm:text-xs bg-slate-950 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-full font-mono shrink-0">
            Key Corridors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {odAnalysis.map((od, idx) => (
            <div key={idx} className="bg-slate-950/70 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono">{od.route}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold ${
                  od.trafficImpact === "SEVERE" ? "bg-rose-950/90 text-rose-300 border border-rose-800" :
                  od.trafficImpact === "HIGH" ? "bg-amber-950/90 text-amber-300 border border-amber-800" :
                  "bg-emerald-950/90 text-emerald-300 border border-emerald-800"
                }`}>
                  {od.trafficImpact} IMPACT
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm text-white font-bold font-sans">
                <span>{od.origin}</span>
                <span className="text-cyan-400 font-mono text-xs px-1">➔</span>
                <span>{od.destination}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-400">Average Delay:</span>
                <span className="text-rose-400 font-bold text-xs sm:text-sm">+{od.avgDelayMin} mins</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 italic">Primary Cause: {od.cause}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Hourly Traffic Density Chart */}
        <div className="glass-panel p-4 sm:p-6 space-y-4 border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" /> Hourly Traffic Congestion Trend
          </h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                <Area type="monotone" dataKey="density" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDensity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Events Breakdown Bar Chart */}
        <div className="glass-panel p-4 sm:p-6 space-y-4 border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" /> Edge Events Distribution by Category
          </h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventsByTypeData}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {eventsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
