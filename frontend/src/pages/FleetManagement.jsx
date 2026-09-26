import React from "react";
import { Bus, Activity } from "lucide-react";

export default function FleetManagement({ buses = [] }) {
  const safeBuses = Array.isArray(buses) ? buses : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-[var(--te-text)] animate-fade-in-up">
      {/* Title Header */}
      <div className="te-card p-5 border-l-4 border-l-[var(--te-lime)]">
        <div className="flex items-center gap-2 text-[var(--te-lime)] text-xs font-semibold uppercase tracking-wider mb-1">
          <Bus className="w-4 h-4 shrink-0" /> Public Transit Sensing Fleet
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--te-text)] tracking-tight">
          Mobile Edge Sensing Fleet Management
        </h2>
        <p className="text-xs sm:text-sm text-[var(--te-text-muted)] mt-1">
          Real-time status of public transit buses equipped with onboard Jetson Edge AI hardware units & multi-angle camera feeds across Pune corridors.
        </p>
      </div>

      {/* Fleet Table */}
      <div className="te-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--te-border)] pb-3 text-xs">
          <h3 className="text-sm font-bold text-[var(--te-text)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--te-lime)]" /> Active Bus Unit Telemetry
          </h3>
          <span className="text-[var(--te-text-muted)]">
            Total Fleet Size: <strong className="text-[var(--te-text)]">{safeBuses.length} Units</strong>
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[var(--te-panel)] text-[var(--te-text-muted)] border-b border-[var(--te-border)] uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">BUS ID</th>
                <th className="p-3">ROUTE CORRIDOR</th>
                <th className="p-3">DRIVER</th>
                <th className="p-3">SPEED</th>
                <th className="p-3">EDGE RATIO</th>
                <th className="p-3">LAST LOGGED EVENT</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--te-border)] text-[var(--te-text)]">
              {safeBuses.map((bus) => (
                <tr key={bus.id} className="hover:bg-[var(--te-panel)] transition">
                  <td className="p-3 text-[var(--te-lime)] font-mono-code font-bold">{bus.id}</td>
                  <td className="p-3 font-semibold text-[var(--te-text)]">{bus.route}</td>
                  <td className="p-3 text-[var(--te-text-muted)]">{bus.driver || "Vikas Shinde"}</td>
                  <td className="p-3 font-semibold text-[var(--te-text)]">{bus.speed} km/h</td>
                  <td className="p-3 text-[var(--te-lime)] font-semibold">
                    {bus.edgeStats ? `${bus.edgeStats.processed}% Local` : "97.4% Local"}
                  </td>
                  <td className="p-3 text-[var(--te-text-muted)] text-[11px]">{bus.lastEvent || "Normal Traffic"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      bus.status === "ONLINE" ? "bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)]" :
                      bus.status === "INCIDENT" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse" :
                      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    }`}>
                      {bus.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
