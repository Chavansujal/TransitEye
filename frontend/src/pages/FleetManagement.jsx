import React, { useState } from "react";
import { Bus, Camera, Search, Cpu, CheckCircle2, AlertOctagon } from "lucide-react";

export default function FleetManagement({ buses = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredBuses = buses.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 border-cyan-500/25">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Bus className="w-6 h-6 text-cyan-400" /> Public Transport Bus Sensing Fleet
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time operational status, GPS positions & Edge AI health metrics for 12 Pune mobile sensing buses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative font-mono text-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bus, route, driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 w-64 shadow-inner"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONLINE">ONLINE</option>
            <option value="INCIDENT">INCIDENT</option>
            <option value="LOW NETWORK">LOW NETWORK</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>
        </div>
      </div>

      {/* Table Panel */}
      <div className="glass-panel p-6 overflow-x-auto border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono">
            <tr>
              <th className="p-3.5">Bus ID</th>
              <th className="p-3.5">Assigned Transit Route</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Speed</th>
              <th className="p-3.5">Camera Unit</th>
              <th className="p-3.5">Last Edge Event</th>
              <th className="p-3.5">Traffic Density</th>
              <th className="p-3.5">Assigned Driver</th>
              <th className="p-3.5">GPS Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 font-mono text-slate-300">
            {filteredBuses.map((bus) => (
              <tr key={bus.id} className="hover:bg-slate-900/50 transition">
                <td className="p-3.5">
                  <div className="font-bold text-cyan-400 flex items-center gap-2">
                    <Bus className="w-4 h-4 text-cyan-400" /> {bus.id}
                  </div>
                </td>
                <td className="p-3.5 text-white font-semibold font-sans">{bus.route}</td>
                <td className="p-3.5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    bus.status === "ONLINE" ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800" :
                    bus.status === "INCIDENT" ? "bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse" :
                    bus.status === "LOW NETWORK" ? "bg-amber-950/80 text-amber-300 border border-amber-800" :
                    "bg-slate-900 text-slate-500 border border-slate-800"
                  }`}>
                    {bus.status}
                  </span>
                </td>
                <td className="p-3.5 text-emerald-400 font-bold">{bus.speed} km/h</td>
                <td className="p-3.5">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Camera className="w-3.5 h-3.5" /> {bus.cameraStatus}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300 font-sans">{bus.lastEvent || "Normal Traffic"}</td>
                <td className="p-3.5 font-bold text-amber-400">{bus.trafficDensity || "MEDIUM"}</td>
                <td className="p-3.5 text-slate-400 font-sans">{bus.driver}</td>
                <td className="p-3.5 text-slate-400 text-[11px]">
                  {bus.latitude.toFixed(4)}°N, {bus.longitude.toFixed(4)}°E
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
