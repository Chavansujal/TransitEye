import React, { useState, useEffect } from "react";
import { Shield, Cpu, Clock, Activity, Signal, Zap } from "lucide-react";

export default function Header({ activeBusesCount = 11, totalBusesCount = 12 }) {
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
    <header className="h-16 bg-[#070a12]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Platform Identity */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group cursor-pointer">
          <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition duration-300">
            <Shield className="w-5 h-5 text-cyan-400 group-hover:text-white transition duration-300" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-extrabold tracking-wider text-white font-['Plus_Jakarta_Sans']">
              TRANSIT<span className="text-cyan-400 font-black">EYE</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-inner">
              SIH-26124 DEMO MVP
            </span>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Mobile Transport Fleet Sensing Infrastructure</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400/90 font-medium">Pune City Command</span>
          </p>
        </div>
      </div>

      {/* Real-time Status Telemetry */}
      <div className="flex items-center gap-4">
        {/* Edge Processing Badge */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-left font-mono">
            <div className="text-[9px] uppercase tracking-widest text-slate-400">Edge Processing Ratio</div>
            <div className="text-xs font-bold text-emerald-400">97.4% Local <span className="text-slate-500">/</span> 2.6% Cloud</div>
          </div>
        </div>

        {/* Active Fleet Indicator */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-center">
            <span className="live-dot"></span>
          </div>
          <div className="text-left font-mono">
            <div className="text-[9px] uppercase tracking-widest text-slate-400">Fleet Coverage</div>
            <div className="text-xs font-bold text-white">
              {activeBusesCount} <span className="text-slate-500">/</span> {totalBusesCount} Buses Active
            </div>
          </div>
        </div>

        {/* Live Clock Header */}
        <div className="flex items-center gap-2 text-slate-300 font-mono text-xs bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800/80 shadow-inner">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">{timeStr || "18:02:00 IST"}</span>
        </div>
      </div>
    </header>
  );
}
