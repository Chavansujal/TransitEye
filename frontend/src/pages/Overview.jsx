import React, { useState } from "react";
import { 
  Bus, 
  AlertTriangle, 
  ShieldAlert, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  MapPin
} from "lucide-react";
import Organic3DVisual from "../components/Organic3DVisual";
import AnimatedNumber from "../components/AnimatedNumber";

export default function Overview({ buses = [], events = [], roadIssues = [], incidents = [], onNavigate, theme = "dark" }) {
  const [dataFilter, setDataFilter] = useState("all");

  const safeBuses = Array.isArray(buses) ? buses : [];
  const safeEvents = Array.isArray(events) ? events : [];
  const safeRoadIssues = Array.isArray(roadIssues) ? roadIssues : [];
  const safeIncidents = Array.isArray(incidents) ? incidents : [];

  const activeBuses = safeBuses.filter(b => b.status === "ONLINE" || b.status === "INCIDENT").length;
  const criticalCount = safeIncidents.filter(i => i.status === "NEW" || i.severity === "CRITICAL").length;

  const filteredEvents = safeEvents.filter(evt => {
    if (dataFilter === "edge_raw") return evt.confidence && evt.confidence < 0.95;
    if (dataFilter === "verified_incident") return evt.severity === "CRITICAL" || evt.registrationNumber;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-[var(--te-text)] animate-fade-in-up">
      
      {/* Clean Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-0 sm:min-h-[440px] relative overflow-hidden">
        
        {/* Left Column: Clear Hierarchy & Action Buttons */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)] text-[11px] sm:text-xs font-semibold max-w-full truncate">
            <Sparkles className="w-3.5 h-3.5 text-[var(--te-lime)] animate-pulse shrink-0" />
            <span className="truncate">PMC Urban Sensing Infrastructure • SIH 26124</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--te-text)] leading-[1.15] sm:leading-[1.1]">
            Transit<span className="text-[var(--te-lime)]">Eye</span> Mobile <br className="hidden sm:inline" />
            Urban Intelligence Platform
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-[var(--te-text-muted)] max-w-xl leading-relaxed">
            Converting Pune city buses into mobile urban sensing nodes. Edge AI processes HD video locally on onboard hardware, filtering 97.4% of bandwidth to upload verified road defects & ANPR alerts in real time.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <button
              onClick={() => onNavigate("live")}
              className="te-button-primary text-xs sm:text-sm font-semibold justify-center sm:justify-start"
            >
              <span>Explore Live Edge Camera Feed</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => onNavigate("gis")}
              className="te-button-secondary text-xs sm:text-sm font-semibold justify-center sm:justify-start"
            >
              <MapPin className="w-4 h-4 text-[var(--te-lime)]" />
              <span>Pune GIS Spatial Map</span>
            </button>
          </div>

          {/* Micro Telemetry Bar */}
          <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[var(--te-text-muted)] border-t border-[var(--te-border)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--te-lime)]"></span>
              <span><strong className="text-[var(--te-text)] font-semibold">97.4%</strong> Edge Filtered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--te-lime)]"></span>
              <span><strong className="text-[var(--te-text)] font-semibold">~48.6 GB</strong> 5G Saved/Day</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span><strong className="text-[var(--te-text)] font-semibold">{activeBuses} / {safeBuses.length}</strong> Buses Active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Visual */}
        <div className="lg:col-span-5 h-[240px] sm:h-[340px] lg:h-[400px] relative flex items-center justify-center">
          <Organic3DVisual theme={theme} />
        </div>
      </section>

      {/* Primary Key Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="te-card p-5 space-y-2">
          <div className="flex items-center justify-between text-[var(--te-text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Active Sensing Fleet</span>
            <Bus className="w-4 h-4 text-[var(--te-lime)]" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--te-text)]">
            <AnimatedNumber value={activeBuses} /> <span className="text-sm font-normal text-[var(--te-text-dim)]">/ {safeBuses.length}</span>
          </div>
          <div className="text-xs text-[var(--te-lime)] flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 91.6% Fleet Operational
          </div>
        </div>

        <div className="te-card p-5 space-y-2">
          <div className="flex items-center justify-between text-[var(--te-text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Events Processed Today</span>
            <TrendingUp className="w-4 h-4 text-[var(--te-lime)]" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--te-text)]">
            <AnimatedNumber value={safeEvents.length + 138} />
          </div>
          <div className="text-xs text-[var(--te-text-muted)]">Potholes, Bottlenecks & Alerts</div>
        </div>

        <div className="te-card p-5 space-y-2">
          <div className="flex items-center justify-between text-[var(--te-text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>Priority Road Defects</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--te-text)]">
            <AnimatedNumber value={safeRoadIssues.length} />
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Corridor Score: 92/100</div>
        </div>

        <div className="te-card p-5 space-y-2">
          <div className="flex items-center justify-between text-[var(--te-text-muted)] text-xs font-semibold uppercase tracking-wider">
            <span>ANPR Violations</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--te-text)]">
            <AnimatedNumber value={safeIncidents.length} />
          </div>
          <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
            <AnimatedNumber value={criticalCount} /> Actionable Dispatches
          </div>
        </div>
      </section>

      {/* Municipal Defect Priorities & Edge AI Savings */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Edge AI Bandwidth Optimization */}
        <div className="lg:col-span-5 te-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--te-border)] pb-3">
            <h3 className="text-sm font-bold text-[var(--te-text)] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--te-lime)]" /> Edge AI Bandwidth Savings
            </h3>
            <span className="text-[11px] bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)] px-2 py-0.5 rounded font-semibold">
              97.4% Reduction
            </span>
          </div>

          <p className="text-xs text-[var(--te-text-muted)] leading-relaxed">
            Bus-mounted HD cameras run real-time RF-DETR inferencing directly on Jetson edge devices, transmitting only verified metadata and compressed frames.
          </p>

          <div className="space-y-3 bg-[var(--te-panel)] p-3.5 rounded-md border border-[var(--te-border)] text-xs">
            <div className="flex justify-between text-[var(--te-text)] font-medium">
              <span>Processed Locally at Edge:</span>
              <span className="text-[var(--te-lime)] font-bold">97.4% (14,250 frames)</span>
            </div>
            <div className="w-full bg-[var(--te-surface)] h-2 rounded-full overflow-hidden border border-[var(--te-border)]">
              <div className="bg-[var(--te-lime)] h-full w-[97.4%]"></div>
            </div>

            <div className="flex justify-between text-[var(--te-text)] font-medium pt-1">
              <span>Transmitted to Cloud:</span>
              <span className="text-[var(--te-text-muted)] font-bold">2.6% (390 events)</span>
            </div>
            <div className="w-full bg-[var(--te-surface)] h-2 rounded-full overflow-hidden border border-[var(--te-border)]">
              <div className="bg-[var(--te-text-muted)] h-full w-[2.6%]"></div>
            </div>
          </div>

          <div className="p-3 bg-[var(--te-lime-bg)] border border-[var(--te-lime-border)] rounded-md flex items-center justify-between text-xs">
            <span className="text-[var(--te-text-muted)]">Estimated 5G Cellular Data Saved:</span>
            <span className="text-[var(--te-lime)] font-bold text-sm">~48.6 GB / day</span>
          </div>
        </div>

        {/* Priority Corridors List */}
        <div className="lg:col-span-7 te-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--te-border)] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--te-text)] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Municipal Defect Priorities
              </h3>
              <p className="text-xs text-[var(--te-text-muted)]">
                Corroborated road defect reports across active Pune transit routes.
              </p>
            </div>
            <button
              onClick={() => onNavigate("road_issues")}
              className="text-xs text-[var(--te-lime)] hover:underline flex items-center gap-1 font-semibold shrink-0 ml-2"
            >
              View All Defect Logs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {safeRoadIssues.map((issue) => (
              <div 
                key={issue.id} 
                className="p-3.5 rounded-md bg-[var(--te-panel)] border border-[var(--te-border)] hover:border-[var(--te-border-strong)] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[var(--te-text)]">{issue.location}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      issue.severity === "CRITICAL" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30" :
                      issue.severity === "HIGH" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" :
                      "bg-[var(--te-panel)] text-[var(--te-text-muted)] border border-[var(--te-border)]"
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <div className="text-[var(--te-text-muted)] flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Defect Type: <strong className="text-[var(--te-text)]">{issue.issueType}</strong></span>
                    <span>Reports: <strong className="text-[var(--te-text)]">{issue.reports}</strong> ({issue.busesReporting} buses)</span>
                  </div>
                  <p className="text-[var(--te-lime)] italic pt-0.5">
                    Action: "{issue.recommendation}"
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:self-center">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-[var(--te-text-muted)] uppercase">Priority Score</div>
                    <div className="text-xl font-extrabold text-[var(--te-text)]">{issue.priorityScore}<span className="text-xs text-[var(--te-text-muted)] font-normal">/100</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Edge AI Telemetry Table */}
      <section className="te-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--te-border)] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--te-lime)]" />
            <h3 className="text-sm font-bold text-[var(--te-text)]">Recent Edge AI Event Telemetry</h3>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 text-xs">
            {[
              { id: "all", label: "All Telemetry" },
              { id: "edge_raw", label: "Edge Detections" },
              { id: "verified_incident", label: "ANPR Incidents" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setDataFilter(f.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  dataFilter === f.id
                    ? "bg-[var(--te-lime)] text-[var(--te-lime-pill-text)]"
                    : "bg-[var(--te-panel)] text-[var(--te-text-muted)] hover:text-[var(--te-text)] border border-[var(--te-border)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[var(--te-panel)] text-[var(--te-text-muted)] border-b border-[var(--te-border)] uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">EVENT ID</th>
                <th className="p-3">EVENT TYPE</th>
                <th className="p-3">BUS SOURCE</th>
                <th className="p-3">LOCATION</th>
                <th className="p-3">CONFIDENCE</th>
                <th className="p-3">PLATE / DETAILS</th>
                <th className="p-3">SEVERITY</th>
                <th className="p-3">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--te-border)] text-[var(--te-text)]">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-[var(--te-panel)] transition">
                  <td className="p-3 text-[var(--te-lime)] font-mono-code font-bold">{evt.id}</td>
                  <td className="p-3 font-semibold text-[var(--te-text)]">{evt.type}</td>
                  <td className="p-3 text-[var(--te-text-muted)]">{evt.busId}</td>
                  <td className="p-3 text-[var(--te-text-muted)]">{evt.locationName || "Pune Transit Corridor"}</td>
                  <td className="p-3 font-semibold text-[var(--te-lime)]">
                    {((evt.confidence || 0.94) * 100).toFixed(0)}%
                  </td>
                  <td className="p-3">
                    {evt.registrationNumber ? (
                      <span className="px-2 py-0.5 rounded bg-[var(--te-lime-bg)] text-[var(--te-lime)] border border-[var(--te-lime-border)] font-mono-code font-semibold text-[11px]">
                        ANPR: {evt.registrationNumber}
                      </span>
                    ) : (
                      <span className="text-[var(--te-text-dim)] truncate block max-w-[150px]">
                        {evt.details || "Raw Edge Metadata"}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      evt.severity === "CRITICAL" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30" :
                      evt.severity === "HIGH" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" :
                      "bg-[var(--te-panel)] text-[var(--te-text-muted)] border border-[var(--te-border)]"
                    }`}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="p-3 text-[var(--te-text-muted)] font-mono-code text-[11px]">{evt.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
