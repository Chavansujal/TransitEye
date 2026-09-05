import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import LiveMonitoring from "./pages/LiveMonitoring";
import GisMap from "./pages/GisMap";
import FleetManagement from "./pages/FleetManagement";
import RoadConditionIntelligence from "./pages/RoadConditionIntelligence";
import IncidentCenter from "./pages/IncidentCenter";
import Analytics from "./pages/Analytics";

import { 
  fetchBuses, 
  fetchEvents, 
  fetchRoadIssues, 
  fetchIncidents, 
  fetchAnalytics 
} from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  // App Level State
  const [buses, setBuses] = useState([
    { id: "BUS-101", route: "Route 17: Pune Station -> Swargate", latitude: 18.5185, longitude: 73.8682, speed: 32, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Normal Traffic", trafficDensity: "MEDIUM", driver: "Rajesh Kumar" },
    { id: "BUS-102", route: "Route 24: Kothrud -> Viman Nagar", latitude: 18.5241, longitude: 73.8425, speed: 28, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Normal Traffic", trafficDensity: "LOW", driver: "Sanjay Patil" },
    { id: "BUS-103", route: "Route 42: Katraj -> Shivajinagar", latitude: 18.4952, longitude: 73.8521, speed: 35, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Pothole Logged", trafficDensity: "MEDIUM", driver: "Amit Deshmukh" },
    { id: "BUS-104", route: "Route 38: Sinhagad Road -> Deccan", latitude: 18.4862, longitude: 73.8324, speed: 14, status: "INCIDENT", cameraStatus: "ACTIVE", lastEvent: "Rash Driving / ANPR Trigger", trafficDensity: "SEVERE", driver: "Vikas Shinde" },
    { id: "BUS-105", route: "Route 105: Hadapsar -> Hinjewadi Phase 1", latitude: 18.5623, longitude: 73.7854, speed: 42, status: "LOW NETWORK", cameraStatus: "ACTIVE", lastEvent: "Road Debris", trafficDensity: "HIGH", driver: "Prakash Pawar" },
    { id: "BUS-106", route: "Route 17: Swargate -> Pune Station", latitude: 18.5054, longitude: 73.8641, speed: 22, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Congestion Flagged", trafficDensity: "HIGH", driver: "Ganesh Kadam" },
    { id: "BUS-107", route: "Route 24: Viman Nagar -> Kothrud", latitude: 18.5512, longitude: 73.8923, speed: 31, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Normal Traffic", trafficDensity: "LOW", driver: "Rahul More" },
    { id: "BUS-108", route: "Route 38: Deccan -> Sinhagad Road", latitude: 18.4981, longitude: 73.8365, speed: 18, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Pothole Defect", trafficDensity: "HIGH", driver: "Sunil Jadhav" },
    { id: "BUS-109", route: "Route 42: Shivajinagar -> Katraj", latitude: 18.5298, longitude: 73.8471, speed: 0, status: "OFFLINE", cameraStatus: "DISCONNECTED", lastEvent: "Maintenance Check", trafficDensity: "LOW", driver: "Nitin Gaikwad" },
    { id: "BUS-110", route: "Route 105: Hinjewadi -> Hadapsar", latitude: 18.5821, longitude: 73.7495, speed: 40, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Normal Traffic", trafficDensity: "MEDIUM", driver: "Deepak Thorat" },
    { id: "BUS-111", route: "Route 17: Pune Station Express", latitude: 18.5255, longitude: 73.8712, speed: 36, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Pedestrian Safety Alert", trafficDensity: "MEDIUM", driver: "Mahesh Bhosale" },
    { id: "BUS-112", route: "Route 24: FC Road Shuttle", latitude: 18.5215, longitude: 73.8402, speed: 20, status: "ONLINE", cameraStatus: "ACTIVE", lastEvent: "Normal Traffic", trafficDensity: "HIGH", driver: "Sachin Chavan" }
  ]);

  const [events, setEvents] = useState([
    { id: "EVT-90412", type: "Pothole Defect", confidence: 0.94, busId: "BUS-104", latitude: 18.4862, longitude: 73.8324, locationName: "Sinhagad Road, near Rajaram Bridge", timestamp: "2026-09-04T16:10:00Z", severity: "HIGH" },
    { id: "EVT-90413", type: "Rash Driving", confidence: 0.97, busId: "BUS-104", latitude: 18.5082, longitude: 73.8361, locationName: "Karve Road Flyover Corridor", timestamp: "2026-09-04T16:25:00Z", severity: "CRITICAL", registrationNumber: "MH12 AB 1234" }
  ]);

  const [roadIssues, setRoadIssues] = useState([
    { id: "RD-301", location: "Sinhagad Road Corridor", issueType: "Severe Surface Potholes", reports: 17, busesReporting: 6, severity: "CRITICAL", priorityScore: 92, status: "NEEDS_ATTENTION", recommendation: "Prioritize urgent asphalt resurfacing & warning signs.", lastReported: "12 mins ago", latitude: 18.4862, longitude: 73.8324 },
    { id: "RD-302", location: "Fergusson College (FC) Road", issueType: "Damaged Storm Drain", reports: 9, busesReporting: 4, severity: "HIGH", priorityScore: 78, status: "IN_REVIEW", recommendation: "Repair broken drain cover near Goodluck Chowk.", lastReported: "35 mins ago", latitude: 18.5221, longitude: 73.8415 }
  ]);

  const [incidents, setIncidents] = useState([
    { id: "INC-701", type: "Rash Driving & Speed Violation", vehicle: "White Sedan", registrationNumber: "MH12 AB 1234", anprConfidence: 0.91, busId: "BUS-104", location: "Karve Road Flyover", latitude: 18.5082, longitude: 73.8361, timestamp: "2026-09-04T16:25:00Z", severity: "CRITICAL", status: "NEW", details: "High speed weaving detected. Vehicle ANPR extracted at 91% match." }
  ]);

  const [analytics, setAnalytics] = useState({});

  // Polling backend API every 3s
  useEffect(() => {
    const loadBackendData = async () => {
      const busData = await fetchBuses();
      if (busData) setBuses(busData);

      const eventData = await fetchEvents();
      if (eventData) setEvents(eventData);

      const issueData = await fetchRoadIssues();
      if (issueData) setRoadIssues(issueData);

      const incData = await fetchIncidents();
      if (incData) setIncidents(incData);

      const analyticData = await fetchAnalytics();
      if (analyticData) setAnalytics(analyticData);
    };

    loadBackendData();
    const interval = setInterval(loadBackendData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEventTriggered = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    if (newEvent.type.includes("Pothole")) {
      setRoadIssues(prev => {
        const copy = [...prev];
        if (copy[0]) {
          copy[0].reports += 1;
          copy[0].priorityScore = Math.min(99, copy[0].priorityScore + 1);
        }
        return copy;
      });
    }
  };

  const handleIncidentUpdated = (updatedInc) => {
    setIncidents(prev => prev.map(i => i.id === updatedInc.id ? updatedInc : i));
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col font-sans">
      {/* Fixed Top Header */}
      <Header 
        activeBusesCount={buses.filter(b => b.status === "ONLINE" || b.status === "INCIDENT").length}
        totalBusesCount={buses.length}
      />

      {/* Main Body Layout with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto bg-[#0b0f19]">
          {activeTab === "overview" && (
            <Overview 
              buses={buses} 
              events={events} 
              roadIssues={roadIssues} 
              incidents={incidents}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "live" && (
            <LiveMonitoring 
              buses={buses}
              onEventTriggered={handleEventTriggered}
            />
          )}

          {activeTab === "gis" && (
            <GisMap 
              buses={buses}
              events={events}
              roadIssues={roadIssues}
              incidents={incidents}
            />
          )}

          {activeTab === "fleet" && (
            <FleetManagement buses={buses} />
          )}

          {activeTab === "road_issues" && (
            <RoadConditionIntelligence roadIssues={roadIssues} />
          )}

          {activeTab === "incidents" && (
            <IncidentCenter 
              incidents={incidents} 
              onIncidentUpdated={handleIncidentUpdated}
            />
          )}

          {activeTab === "analytics" && (
            <Analytics analytics={analytics} />
          )}
        </main>
      </div>
    </div>
  );
}
