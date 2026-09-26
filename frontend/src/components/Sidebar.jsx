import React from "react";
import {
  LayoutDashboard,
  Video,
  MapPin,
  Bus,
  AlertTriangle,
  ShieldAlert,
  BarChart3,
  Radio,
  X,
  Zap,
  Activity
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen
}) {
  const menuItems = [
    { id: "overview", label: "Command Console", icon: LayoutDashboard, badge: "Live" },
    { id: "live", label: "Live AI Vision", icon: Video, badge: "Edge AI" },
    { id: "gis", label: "Pune GIS Map", icon: MapPin, badge: "PMC" },
    { id: "fleet", label: "Fleet Telemetry", icon: Bus },
    { id: "road_issues", label: "Road Intelligence", icon: AlertTriangle, badge: "P1 Defect" },
    { id: "incidents", label: "ANPR & Triage", icon: ShieldAlert, badge: "ANPR" },
    { id: "analytics", label: "City Analytics", icon: BarChart3 }
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderContent = () => (
    <div className="flex flex-col h-full justify-between gap-4 font-sans">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-[var(--te-sidebar-muted)] uppercase tracking-widest font-mono flex items-center justify-between">
          <span>OPERATIONS NAVIGATION</span>
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-white/10 text-white"
              aria-label="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition duration-200 group relative ${
                isActive
                  ? "bg-teal-500/15 text-teal-400 border border-teal-500/30 font-bold"
                  : "text-[var(--te-sidebar-muted)] hover:text-[var(--te-sidebar-text)] hover:bg-white/5 border border-transparent"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-teal-500 rounded-r-full"></div>
              )}

              <div className="flex items-center gap-3 pl-1">
                <Icon className={`w-4 h-4 transition ${isActive ? "text-teal-400" : "text-[var(--te-sidebar-muted)] group-hover:text-white"}`} />
                <span className="tracking-tight">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase transition ${
                  isActive
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                    : "bg-white/5 text-[var(--te-sidebar-muted)] border border-white/10 group-hover:text-white"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Edge System Telemetry Card at Sidebar Bottom */}
      <div className="p-3.5 rounded-xl border border-[var(--te-sidebar-border)] bg-white/5 space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-bold text-[var(--te-sidebar-text)]">
            <Radio className="w-3.5 h-3.5 text-emerald-400" /> Edge AI Pipeline
          </span>
          <span className="text-[9px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
            ACTIVE
          </span>
        </div>

        <p className="text-[11px] text-[var(--te-sidebar-muted)] leading-relaxed font-sans font-normal">
          On-bus Jetson AI filters normal video locally. Only critical alerts uploaded.
        </p>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-[var(--te-sidebar-muted)]">
            <span>Bandwidth Saved:</span>
            <span className="text-emerald-400 font-bold">97.4% (~48GB/day)</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/10">
            <div className="bg-emerald-500 h-full w-[97.4%]"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navigation Drawer */}
      <aside className="te-sidebar hidden lg:flex w-64 flex-col justify-between h-[calc(100vh-4rem)] p-4 shrink-0 transition-colors duration-200">
        {renderContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          />
          <aside className="fixed top-16 left-0 bottom-0 w-72 max-w-[85vw] te-sidebar flex flex-col justify-between p-4 z-50 overflow-y-auto shadow-2xl transition-colors duration-200">
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  );
}
