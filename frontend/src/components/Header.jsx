import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Cpu, 
  Clock, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Radio, 
  Activity,
  Layers,
  Sparkles
} from "lucide-react";

export default function Header({
  activeBusesCount = 11,
  totalBusesCount = 12,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
  theme = "light",
  onThemeChange
}) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-IN", { hour12: false }) + " IST");
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="te-header h-16 sm:h-18 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 transition-colors duration-200">
      {/* Left: Brand Identity & Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-[var(--te-panel)] text-[var(--te-text)] border border-[var(--te-border)] hover:bg-[var(--te-panel-hover)] transition"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Tactical Badge Logo */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 p-[1px] shadow-sm shrink-0">
          <div className="w-full h-full rounded-[11px] bg-[var(--te-surface)] flex items-center justify-center">
            <Shield className="w-5 h-5 text-teal-500" />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-[var(--te-text)] font-sans">
              TRANSIT<span className="text-teal-500">EYE</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
              SIH 26124
            </span>
          </div>
          <p className="text-[11px] text-[var(--te-text-muted)] hidden sm:flex items-center gap-1.5 font-medium">
            <span>Mobile Sensing Infrastructure</span>
            <span>•</span>
            <span className="text-[var(--te-text)] font-semibold">PMC Pune Transit</span>
          </p>
        </div>
      </div>

      {/* Right: Operational Telemetry Gauges & Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Edge Processing Efficiency Meter */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[var(--te-panel)] border border-[var(--te-border)]">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-left font-mono text-[11px]">
            <div className="text-[9px] uppercase tracking-wider text-[var(--te-text-muted)] font-bold">Edge Telemetry</div>
            <div className="font-bold text-[var(--te-text)]">
              <span className="text-teal-500">97.4% Local</span> <span className="text-[var(--te-text-dim)]">/</span> 2.6% Cloud
            </div>
          </div>
        </div>

        {/* Fleet Coverage Live Indicator */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--te-panel)] border border-[var(--te-border)]">
          <div className="live-pulse-dot shrink-0"></div>
          <div className="text-left font-mono text-[11px]">
            <div className="text-[9px] uppercase tracking-wider text-[var(--te-text-muted)] font-bold">Fleet Sensing</div>
            <div className="font-bold text-[var(--te-text)] whitespace-nowrap">
              {activeBusesCount} <span className="text-[var(--te-text-dim)]">/</span> {totalBusesCount} Buses
            </div>
          </div>
        </div>

        {/* Live IST Clock */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-xl bg-[var(--te-panel)] border border-[var(--te-border)] text-[var(--te-text)]">
          <Clock className="w-3.5 h-3.5 text-teal-500" />
          <span className="font-bold">{timeStr || "18:02:00 IST"}</span>
        </div>

        {/* Light / Dark Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--te-panel)] border border-[var(--te-border)]">
          <button
            onClick={() => onThemeChange && onThemeChange("light")}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              theme === "light" 
                ? "bg-[var(--te-surface)] text-teal-600 shadow-sm border border-[var(--te-border)]" 
                : "text-[var(--te-text-muted)] hover:text-[var(--te-text)]"
            }`}
            title="Light Theme"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Light</span>
          </button>
          <button
            onClick={() => onThemeChange && onThemeChange("dark")}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              theme === "dark" 
                ? "bg-[var(--te-surface)] text-teal-400 shadow-sm border border-[var(--te-border)]" 
                : "text-[var(--te-text-muted)] hover:text-[var(--te-text)]"
            }`}
            title="Dark Theme"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dark</span>
          </button>
        </div>
      </div>
    </header>
  );
}
