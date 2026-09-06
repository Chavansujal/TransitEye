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
  X
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobileMenuOpen = false,
  setIsMobileMenuOpen
}) {
  const menuItems = [
    { id: "overview", label: "Command Center", icon: LayoutDashboard, badge: "Live" },
    { id: "live", label: "Live AI Feed", icon: Video, badge: "Edge AI" },
    { id: "gis", label: "GIS City Map", icon: MapPin, badge: "Pune" },
    { id: "fleet", label: "Fleet Telemetry", icon: Bus },
    { id: "road_issues", label: "Road Intelligence", icon: AlertTriangle, badge: "P1 Priority" },
    { id: "incidents", label: "Incident Center", icon: ShieldAlert, badge: "ANPR" },
    { id: "analytics", label: "Analytics & OD", icon: BarChart3 }
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderContent = () => (
    <>
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-bold text-blue-100/80 uppercase tracking-widest font-mono flex items-center justify-between">
          <span>OPERATIONS CONSOLE</span>
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-white/10 text-blue-100 hover:text-white"
              aria-label="Close Navigation Menu"
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
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-semibold transition-all duration-200 group relative border ${
                isActive
                  ? "bg-[#1E5AA8] text-white border-blue-300/40 shadow-sm"
                  : "text-blue-50/85 border-transparent hover:text-white hover:bg-white/10"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#F28C28] rounded-r-full"></div>
              )}

              <div className="flex items-center gap-3.5 pl-1">
                <Icon className={`w-4 h-4 transition duration-200 ${
                  isActive ? "text-white" : "text-blue-100/80 group-hover:text-white"
                }`} />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase transition ${
                  isActive
                    ? "bg-white/15 text-white border border-white/20"
                    : "bg-[#0D2D48] text-blue-100/75 border border-white/10 group-hover:text-white"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Telemetry Box at Sidebar Bottom */}
      <div className="p-4 text-xs space-y-2.5 border border-white/15 bg-white/8 relative overflow-hidden mt-auto rounded-lg">
        <div className="flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Radio className="w-3.5 h-3.5 text-[#7CE3B1]" /> Edge Telemetry
          </span>
          <span className="text-[9px] text-[#7CE3B1] bg-[#073B2B] px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
            ONLINE
          </span>
        </div>

        <p className="text-[11px] text-blue-50/80 leading-relaxed font-sans">
          Buses perform local inferencing. Low bandwidth, privacy compliant.
        </p>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-blue-50/75">
            <span>Edge Filtering:</span>
            <span className="text-[#7CE3B1] font-bold">97.4%</span>
          </div>
          <div className="w-full bg-[#0D2D48] h-1.5 rounded-full overflow-hidden border border-white/10">
            <div className="bg-[#198754] h-full w-[97.4%]"></div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#123B5D] border-r border-[#0D2D48] flex-col justify-between h-[calc(100vh-5rem)] p-4 shrink-0 shadow-md">
        {renderContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          />
          {/* Sliding Panel */}
          <aside className="fixed top-[4.5rem] sm:top-20 left-0 bottom-0 w-72 max-w-[85vw] bg-[#123B5D] border-r border-[#0D2D48] flex flex-col justify-between p-4 z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  );
}
