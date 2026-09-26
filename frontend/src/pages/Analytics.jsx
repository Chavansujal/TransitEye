import React from "react";
import { BarChart3, Navigation } from "lucide-react";
import AnimatedNumber from "../components/AnimatedNumber";

export default function Analytics({ analytics = {} }) {
  const cityHealthScore = analytics.cityHealthScore || 84;
  const eventsToday = analytics.eventsToday || 142;
  const edgeDataSavedGb = analytics.edgeDataSavedGb || 48.6;
  const odAnalysis = analytics.odAnalysis || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-[var(--te-text)] animate-fade-in-up">
      {/* Title Header */}
      <div className="te-card p-5 border-l-4 border-l-[var(--te-lime)]">
        <div className="flex items-center gap-2 text-[var(--te-lime)] text-xs font-semibold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4 shrink-0" /> Municipal Mobility Analytics
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--te-text)] tracking-tight">
          City Traffic & Corridor Delay Analytics
        </h2>
        <p className="text-xs sm:text-sm text-[var(--te-text-muted)] mt-1">
          Data synthesis of transit corridor delays, bottleneck causes, and edge network bandwidth optimization across Pune Municipal Corporation.
        </p>
      </div>

      {/* Analytics Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="te-card p-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--te-text-muted)]">
            City Infrastructure Health Score
          </div>
          <div className="text-3xl font-extrabold text-[var(--te-lime)]">
            <AnimatedNumber value={cityHealthScore} /><span className="text-sm font-normal text-[var(--te-text-muted)]">/100</span>
          </div>
          <p className="text-xs text-[var(--te-text-muted)]">Calculated from road defects & congestion indices.</p>
        </div>

        <div className="te-card p-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--te-text-muted)]">
            Events Logged Today
          </div>
          <div className="text-3xl font-extrabold text-[var(--te-text)]">
            <AnimatedNumber value={eventsToday} />
          </div>
          <p className="text-xs text-[var(--te-text-muted)]">Potholes, bottlenecks, zebra defects & alerts.</p>
        </div>

        <div className="te-card p-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--te-text-muted)]">
            Daily 5G Cellular Data Saved
          </div>
          <div className="text-3xl font-extrabold text-[var(--te-lime)]">
            ~{edgeDataSavedGb} GB
          </div>
          <p className="text-xs text-[var(--te-text-muted)]">Achieved via 97.4% local edge inferencing.</p>
        </div>
      </div>

      {/* Origin-Destination (O-D) Route Delay Table */}
      <div className="te-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--te-border)] pb-3">
          <h3 className="text-sm font-bold text-[var(--te-text)] flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[var(--te-lime)]" /> Origin-Destination (O-D) Route Delay Analysis
          </h3>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-[var(--te-panel)] text-[var(--te-text-muted)] border-b border-[var(--te-border)] uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">ROUTE</th>
                <th className="p-3">ORIGIN STATION</th>
                <th className="p-3">DESTINATION</th>
                <th className="p-3">AVG DELAY</th>
                <th className="p-3">TRAFFIC IMPACT</th>
                <th className="p-3">IDENTIFIED ROOT CAUSE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--te-border)] text-[var(--te-text)]">
              {odAnalysis.map((od, idx) => (
                <tr key={idx} className="hover:bg-[var(--te-panel)] transition">
                  <td className="p-3 font-bold text-[var(--te-lime)]">{od.route}</td>
                  <td className="p-3 text-[var(--te-text)]">{od.origin}</td>
                  <td className="p-3 text-[var(--te-text)]">{od.destination}</td>
                  <td className="p-3 font-semibold text-[var(--te-amber)]">+{od.avgDelayMin} mins</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      od.trafficImpact === "SEVERE" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30" :
                      od.trafficImpact === "HIGH" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" :
                      "bg-[var(--te-panel)] text-[var(--te-text-muted)] border border-[var(--te-border)]"
                    }`}>
                      {od.trafficImpact}
                    </span>
                  </td>
                  <td className="p-3 text-[var(--te-text-muted)] text-[11px]">{od.cause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
