import React, { useState, useEffect } from "react";
import { Shield, Cpu, Clock, Menu, X, Sun, Moon } from "lucide-react";

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
    <header className="gov-header relative h-18 sm:h-20 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="gov-tricolor-line absolute bottom-0 left-0 right-0 h-1 flex">
        <span className="flex-1"></span>
        <span className="flex-1"></span>
        <span className="flex-1"></span>
      </div>

      {/* Brand & Platform Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        {/* Mobile Menu Hamburger Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="gov-icon-button lg:hidden p-2 rounded-lg focus:outline-none transition"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="gov-logo-mark w-10 h-10 sm:w-12 sm:h-12 rounded-lg p-[1px] shadow-sm group cursor-pointer shrink-0">
          <div className="w-full h-full rounded-[7px] flex items-center justify-center transition duration-300">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 transition duration-300" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <h1 className="gov-brand-title text-base sm:text-xl font-extrabold tracking-wide">
              TRANSIT<span className="font-black">EYE</span>
            </h1>
            <span className="gov-demo-badge text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono shadow-sm shrink-0">
              SIH-26124 DEMO
            </span>
          </div>
          <p className="gov-brand-subtitle text-[10px] sm:text-[11px] hidden sm:flex items-center gap-1.5">
            <span>Mobile Transport Fleet Sensing</span>
            <span>•</span>
            <span className="font-semibold">Pune City Command</span>
          </p>
        </div>
      </div>

      {/* Real-time Status Telemetry */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Edge Processing Badge */}
        <div className="gov-header-stat hidden xl:flex items-center gap-3 px-3.5 py-2 rounded-lg shadow-sm">
          <div className="gov-stat-icon p-1.5 rounded-md">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-left font-mono">
            <div className="gov-stat-label text-[9px] uppercase tracking-widest">Edge Ratio</div>
            <div className="gov-stat-value text-xs font-bold">97.4% Local <span>/</span> 2.6% Cloud</div>
          </div>
        </div>

        <div className="gov-theme-toggle hidden md:flex items-center p-1 rounded-lg border shadow-sm" aria-label="Theme selector">
          <button
            type="button"
            onClick={() => onThemeChange && onThemeChange("light")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] sm:text-xs font-mono font-bold transition ${theme === "light" ? "is-active" : ""}`}
            aria-pressed={theme === "light"}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => onThemeChange && onThemeChange("dark")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] sm:text-xs font-mono font-bold transition ${theme === "dark" ? "is-active" : ""}`}
            aria-pressed={theme === "dark"}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>

        {/* Active Fleet Indicator */}
        <div className="gov-header-stat flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3.5 py-2 rounded-lg shadow-sm">
          <div className="flex items-center justify-center shrink-0">
            <span className="live-dot"></span>
          </div>
          <div className="text-left font-mono">
            <div className="gov-stat-label text-[8px] sm:text-[9px] uppercase tracking-widest">Fleet Coverage</div>
            <div className="gov-stat-main text-[11px] sm:text-xs font-bold whitespace-nowrap">
              {activeBusesCount} <span>/</span> {totalBusesCount} Active
            </div>
          </div>
        </div>

        {/* Live Clock Header */}
        <div className="gov-clock hidden sm:flex items-center gap-2 font-mono text-xs px-3.5 py-2 rounded-lg shadow-sm">
          <Clock className="w-4 h-4" />
          <span className="font-semibold">{timeStr || "18:02:00 IST"}</span>
        </div>
      </div>
    </header>
  );
}
