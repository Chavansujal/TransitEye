import React, { useState } from "react";
import { 
  Wrench,
  AlertTriangle
} from "lucide-react";

export default function RoadConditionIntelligence({ roadIssues = [] }) {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const safeRoadIssues = Array.isArray(roadIssues) ? roadIssues : [];

  const filteredIssues = safeRoadIssues.filter(issue => {
    if (categoryFilter === "all") return true;
    return issue.category === categoryFilter;
  });

  const categories = [
    { id: "all", label: "All Defects" },
    { id: "pothole", label: "Potholes & Cracks" },
    { id: "zebra_crossing", label: "Faded Zebra Crossing" },
    { id: "divider", label: "Broken Divider" },
    { id: "signboard", label: "Damaged Signboard" },
    { id: "waterlogging", label: "Severe Waterlogging" }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-[var(--te-text)] animate-fade-in-up">
      {/* Title Banner */}
      <div className="te-card p-5 border-l-4 border-l-[var(--te-amber)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--te-amber)] text-xs font-semibold uppercase tracking-wider mb-1">
              <Wrench className="w-4 h-4 shrink-0" /> Municipal Maintenance Intelligence
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--te-text)] tracking-tight">
              Road Defects & Repair Priorities
            </h2>
            <p className="text-xs sm:text-sm text-[var(--te-text-muted)] mt-1">
              Multi-bus corroborated road defect reports across PMC municipal divisions with automated priority scoring (0-100) and resurfacing recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition ${
              categoryFilter === cat.id
                ? "bg-[var(--te-amber)] text-white font-semibold"
                : "bg-[var(--te-panel)] text-[var(--te-text-muted)] hover:text-[var(--te-text)] border border-[var(--te-border)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Corridors Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIssues.map((issue) => (
          <div 
            key={issue.id}
            className="te-card p-5 space-y-4 hover:border-[var(--te-border-strong)] transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--te-border)] pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-base font-extrabold text-[var(--te-text)]">{issue.location}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    issue.severity === "CRITICAL" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30" :
                    issue.severity === "HIGH" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30" :
                    "bg-[var(--te-panel)] text-[var(--te-text-muted)] border border-[var(--te-border)]"
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <div className="text-xs text-[var(--te-text-muted)]">
                  Ward Division: <strong className="text-[var(--te-text)]">{issue.ward || "Ward 11 - Sinhagad Division"}</strong>
                </div>
              </div>

              {/* Priority Score Meter */}
              <div className="flex items-center gap-4 shrink-0 sm:self-center">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-[var(--te-text-muted)] uppercase">Priority Score</div>
                  <div className="text-2xl font-extrabold text-[var(--te-text)]">{issue.priorityScore}<span className="text-xs text-[var(--te-text-muted)] font-normal">/100</span></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[var(--te-text-muted)] bg-[var(--te-panel)] p-3 rounded-md border border-[var(--te-border)] font-sans">
              <div>Issue ID: <strong className="text-[var(--te-amber)] font-mono-code font-bold">{issue.id}</strong></div>
              <div>Defect Type: <strong className="text-[var(--te-text)]">{issue.issueType}</strong></div>
              <div>Corroborations: <strong className="text-[var(--te-text)]">{issue.reports} reports ({issue.busesReporting} buses)</strong></div>
              <div>Last Logged: <span className="text-[var(--te-text)]">{issue.lastReported || "Recently"}</span></div>
            </div>

            <div className="p-3 bg-[var(--te-amber-bg)] border border-amber-500/20 rounded-md text-xs text-[var(--te-text)] leading-relaxed">
              <strong className="text-[var(--te-amber)] font-semibold">💡 Municipal Recommendation:</strong> "{issue.recommendation}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
