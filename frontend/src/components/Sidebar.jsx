import React from "react";
import { 
  LayoutDashboard, 
  Video, 
  MapPin, 
  Bus, 
  AlertTriangle, 
  ShieldAlert, 
  BarChart3,
  Cpu,
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
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center justify-between">
          <span>OPERATIONS CONSOLE</span>
          {isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white"
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
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                isActive
                  ? "bg-slate-900/90 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              {/* Left active highlight bar */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full"></div>
              )}

              <div className="flex items-center gap-3.5 pl-1">
                <Icon className={`w-4 h-4 transition duration-200 ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold uppercase transition ${
                  isActive 
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-slate-900 text-slate-500 group-hover:text-slate-400"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Telemetry Box at Sidebar Bottom */}
      <div className="glass-panel p-4 text-xs space-y-2.5 border-slate-800/80 bg-slate-950/60 relative overflow-hidden mt-auto">
        <div className="flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Edge Telemetry
          </span>
          <span className="text-[9px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 font-bold">
            ONLINE
          </span>
        </div>
        
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Buses perform local inferencing. Low bandwidth, privacy compliant.
        </p>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Edge Filtering:</span>
            <span className="text-emerald-400 font-bold">97.4%</span>
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full w-[97.4%] shadow-sm shadow-emerald-400"></div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#070a12]/95 border-r border-slate-800/80 flex-col justify-between h-[calc(100vh-4rem)] p-4 shrink-0 backdrop-blur-xl">
        {renderContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          {/* Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40"
            onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          />
          {/* Sliding Panel */}
          <aside className="fixed top-16 left-0 bottom-0 w-72 max-w-[85vw] bg-[#070a12] border-r border-slate-800/90 flex flex-col justify-between p-4 z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  );
}
