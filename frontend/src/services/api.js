const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function fetchBuses() {
  try {
    const res = await fetch(`${API_BASE}/api/buses`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline, using fallback state:", err);
    return null;
  }
}

export async function fetchEvents() {
  try {
    const res = await fetch(`${API_BASE}/api/events`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchRoadIssues() {
  try {
    const res = await fetch(`${API_BASE}/api/road-issues`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchIncidents() {
  try {
    const res = await fetch(`${API_BASE}/api/incidents`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateIncidentStatus(incidentId, status) {
  try {
    const res = await fetch(`${API_BASE}/api/incidents/${incidentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Update failed");
    return await res.json();
  } catch (err) {
    console.error("Failed to update incident:", err);
    return null;
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/api/analytics`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchEdgeStats() {
  try {
    const res = await fetch(`${API_BASE}/api/edge-stats`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function triggerDemoScenario(scenario, busId = "BUS-104", cameraAngle = "front") {
  try {
    const res = await fetch(`${API_BASE}/api/demo/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, busId, cameraAngle })
    });
    if (!res.ok) throw new Error("Trigger failed");
    return await res.json();
  } catch (err) {
    console.error("Demo scenario trigger error:", err);
    return null;
  }
}
