import React, { useState } from "react";
import { 
  AlertTriangle, 
  Wrench, 
  Bus, 
  MapPin, 
  CheckCircle2, 
  Shield, 
  FileText, 
  Download, 
  Send, 
  X, 
  Building2, 
  Calendar, 
  Printer, 
  Clock,
  Filter
} from "lucide-react";

export default function RoadConditionIntelligence({ roadIssues = [] }) {
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedIssueForWorkOrder, setSelectedIssueForWorkOrder] = useState(null);
  const [dispatchedMap, setDispatchedMap] = useState({});

  const categories = [
    { id: "ALL", label: "All Defects" },
    { id: "pothole", label: "Potholes & Cracks" },
    { id: "zebra_crossing", label: "Zebra Crossings" },
    { id: "divider", label: "Road Dividers" },
    { id: "signboard", label: "Signboards" },
    { id: "waterlogging", label: "Waterlogging" }
  ];

  const filteredIssues = roadIssues.filter(issue => {
    if (categoryFilter === "ALL") return true;
    return issue.category === categoryFilter;
  });

  const handleDispatch = (issueId) => {
    setDispatchedMap(prev => ({ ...prev, [issueId]: true }));
    setSelectedIssueForWorkOrder(null);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 sm:p-6 border-amber-500/25">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-[10px] sm:text-xs mb-1">
            <Wrench className="w-3.5 h-3.5 shrink-0" /> ACTIONABLE MUNICIPAL ROAD DEFECT INTELLIGENCE
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Corridor Defect Priorities & Work Order Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated multi-bus edge detections weighted by corroboration frequency to generate Pune Municipal Corporation (PMC) repair tickets.
          </p>
        </div>

        {/* SIH Tag */}
        <div className="flex items-center gap-2 bg-slate-950 p-2.5 sm:p-3 rounded-2xl border border-slate-800 text-[11px] sm:text-xs font-mono self-start md:self-auto">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300">PMC Public Works Department (PWD)</span>
        </div>
      </div>

      {/* Priority Scoring Formula & Category Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-[11px] sm:text-xs font-mono overflow-x-auto no-scrollbar max-w-full">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0 hidden sm:inline" />
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-bold transition duration-200 shrink-0 ${
                categoryFilter === cat.id 
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Priority Formula Hint */}
        <div className="glass-panel px-3 sm:px-4 py-2 bg-slate-950/80 border-slate-800 text-[10px] sm:text-xs font-mono flex items-center gap-2 text-slate-400 shrink-0">
          <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Priority = Severity × Frequency × Corroborations</span>
        </div>
      </div>

      {/* Corridor Cards */}
      <div className="space-y-4 sm:space-y-5">
        {filteredIssues.map((issue) => {
          const isDispatched = dispatchedMap[issue.id] || issue.status === "DISPATCHED";

          return (
            <div 
              key={issue.id}
              className="glass-panel p-4 sm:p-6 border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-3.5 sm:pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" /> {issue.location}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-extrabold ${
                      issue.severity === "CRITICAL" ? "bg-rose-950/90 text-rose-300 border border-rose-800" :
                      issue.severity === "HIGH" ? "bg-amber-950/90 text-amber-300 border border-amber-800" :
                      "bg-blue-950/90 text-blue-300 border border-blue-800"
                    }`}>
                      {issue.severity}
                    </span>
                    {isDispatched && (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> WORK ORDER ISSUED
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Defect: <strong className="text-slate-200">{issue.issueType}</strong></span>
                    <span>Ward: <strong className="text-cyan-300">{issue.ward || "Pune Municipal Ward"}</strong></span>
                    <span>ID: <span className="font-mono text-cyan-400">{issue.id}</span></span>
                    <span>Last Corroborated: <span className="text-slate-300">{issue.lastReported}</span></span>
                  </div>
                </div>

                {/* Priority Score Gauge */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 sm:self-center">
                  <div className="text-left sm:text-right font-mono">
                    <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Priority Score</div>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      {issue.priorityScore}<span className="text-xs text-slate-500 font-normal">/100</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 sm:p-2 shadow-inner">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-slate-950/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">TOTAL BUS SIGHTINGS</div>
                  <div className="text-lg sm:text-xl font-bold text-white font-mono">{issue.reports} Passes Logged</div>
                </div>

                <div className="bg-slate-950/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">INDEPENDENT CORROBORATION</div>
                  <div className="text-lg sm:text-xl font-bold text-cyan-400 font-mono flex items-center gap-2">
                    <Bus className="w-4 h-4 shrink-0" /> {issue.busesReporting} Buses Confirmed
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">MUNICIPAL SLA / STATUS</div>
                  <div className={`text-xs sm:text-sm font-bold font-mono ${isDispatched ? "text-emerald-400" : "text-amber-400"}`}>
                    {isDispatched ? "DISPATCHED TO CREW" : issue.status}
                  </div>
                </div>
              </div>

              {/* Municipal Action Recommendation & Dispatch Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-2xl text-xs">
                <div className="flex items-start gap-3">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-400">Actionable Municipal Recommendation:</span>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{issue.recommendation}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIssueForWorkOrder(issue)}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 transition"
                >
                  <FileText className="w-4 h-4" /> Issue PMC Work Order
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Municipal Work Order Ticket Modal */}
      {selectedIssueForWorkOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="glass-panel p-4 sm:p-6 max-w-2xl w-full border-cyan-500/40 bg-slate-950 shadow-2xl rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Pune Municipal Corporation</h3>
                  <div className="text-[10px] sm:text-xs font-mono text-cyan-400">Public Works Department • Work Order Dispatch</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedIssueForWorkOrder(null)}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ticket Details Box */}
            <div className="bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-slate-400 text-[9px] sm:text-[10px] block">WORK ORDER NUMBER:</span>
                  <span className="text-white font-bold text-xs sm:text-sm">PMC-WO-2026-{selectedIssueForWorkOrder.id.replace("RD-", "")}89</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-400 text-[9px] sm:text-[10px] block">PRIORITY TIER:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] sm:text-[11px] inline-block ${
                    selectedIssueForWorkOrder.priorityScore >= 85 ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-amber-950 text-amber-300 border border-amber-800"
                  }`}>
                    {selectedIssueForWorkOrder.priorityScore >= 85 ? "P1 - URGENT (48h SLA)" : "P2 - SCHEDULED (5d SLA)"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 text-[9px] sm:text-[10px] block">LOCATION:</span>
                  <span className="text-white font-sans font-bold">{selectedIssueForWorkOrder.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] sm:text-[10px] block">MUNICIPAL WARD:</span>
                  <span className="text-cyan-300 font-bold">{selectedIssueForWorkOrder.ward || "Pune Central Ward"}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] sm:text-[10px] block">GEO-COORDINATES:</span>
                  <span className="text-slate-200">{selectedIssueForWorkOrder.latitude}° N, {selectedIssueForWorkOrder.longitude}° E</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] sm:text-[10px] block">EDGE AI CORROBORATION:</span>
                  <span className="text-emerald-400 font-bold">{selectedIssueForWorkOrder.busesReporting} Buses ({selectedIssueForWorkOrder.reports} passes)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 text-[9px] sm:text-[10px] block mb-1">RECOMMENDED REPAIR DIRECTIVE:</span>
                <p className="text-slate-200 font-sans text-xs bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {selectedIssueForWorkOrder.recommendation}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs transition"
              >
                <Printer className="w-4 h-4 text-slate-400" /> Print Formal Order
              </button>

              <button
                onClick={() => handleDispatch(selectedIssueForWorkOrder.id)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black font-mono text-xs shadow-lg shadow-emerald-500/20 transition"
              >
                <Send className="w-4 h-4" /> Dispatch to PWD Crew
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
