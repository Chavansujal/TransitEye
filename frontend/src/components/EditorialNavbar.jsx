import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  ArrowUpRight, 
  Menu, 
  X,
  Eye,
  MapPin,
  Bus,
  AlertTriangle,
  ShieldAlert,
  BarChart3,
  Activity,
  Cpu
} from "lucide-react";

export default function EditorialNavbar({
  activeTab,
  setActiveTab,
  activeBusesCount = 11,
  totalBusesCount = 12,
  theme = "dark",
  onThemeChange
}) {
  const [timeStr, setTimeStr] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-IN", { hour12: false }) + " IST");
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "ai_model", label: "AI Model Hub", icon: Cpu },
    { id: "live", label: "Live Vision", icon: Eye },
    { id: "gis", label: "GIS Map", icon: MapPin },
    { id: "incidents", label: "ANPR Triage", icon: ShieldAlert },
    { id: "road_issues", label: "Road Defects", icon: AlertTriangle },
    { id: "fleet", label: "Fleet Status", icon: Bus },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--te-nav-bg)] backdrop-blur-md border-b border-[var(--te-border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between font-sans">
        
        {/* Brand Logo & Professional Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
          <div className="w-8 h-8 rounded-lg bg-[var(--te-panel)] border border-[var(--te-border)] flex items-center justify-center text-[var(--te-lime)] font-bold text-sm">
            TE
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-[var(--te-text)]">
                Transit<span className="text-[var(--te-lime)]">Eye</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--te-lime-bg)] text-[var(--te-lime)] font-semibold border border-[var(--te-lime-border)]">
                PMC Transit
              </span>
            </div>
          </div>
        </div>

        {/* Clean Top Navigation Items (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-[var(--te-lime)] bg-[var(--te-lime-bg)] font-semibold border border-[var(--te-lime-border)]"
                    : "text-[var(--te-text-muted)] hover:text-[var(--te-text)] hover:bg-[var(--te-panel)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Clock Meter & Theme Switcher */}
        <div className="flex items-center gap-3 text-xs">
          {/* Active Buses Status & Live Clock */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[var(--te-panel)] border border-[var(--te-border)] text-[var(--te-text-muted)] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--te-lime)] animate-pulse"></span>
              <span className="font-semibold text-[var(--te-text)]">{activeBusesCount}/{totalBusesCount} Active</span>
            </div>
            <span className="text-[var(--te-border-strong)]">|</span>
            <span className="font-mono-code text-[11px]">{timeStr || "18:02:00 IST"}</span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => setActiveTab("live")}
            className="te-button-primary text-xs"
          >
            <span>Live Camera Feed</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => onThemeChange && onThemeChange(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md bg-[var(--te-panel)] hover:bg-[var(--te-panel-hover)] text-[var(--te-text)] border border-[var(--te-border)] transition"
            title="Toggle Theme Mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-[var(--te-lime)]" /> : <Moon className="w-4 h-4 text-[var(--te-text)]" />}
          </button>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md bg-[var(--te-panel)] text-[var(--te-text)] border border-[var(--te-border)]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--te-surface)] border-b border-[var(--te-border)] px-4 py-3 space-y-1 text-xs shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-md font-medium ${
                  isActive 
                    ? "bg-[var(--te-lime-bg)] text-[var(--te-lime)] font-semibold border border-[var(--te-lime-border)]" 
                    : "text-[var(--te-text-muted)] hover:bg-[var(--te-panel)] hover:text-[var(--te-text)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
