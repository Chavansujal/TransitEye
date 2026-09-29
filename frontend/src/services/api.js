let API_BASE = "http://127.0.0.1:8000";

export function getApiBase() {
  return API_BASE;
}

export function setApiBase(url) {
  API_BASE = url;
}

// Auto-detect whether TransitEye backend is on 8000 or 8001
export async function initApiBase() {
  const ports = ["8000", "8001"];
  for (const p of ports) {
    try {
      const res = await fetch(`http://127.0.0.1:${p}/`, { signal: AbortSignal.timeout(600) });
      const data = await res.json();
      if (data.platform === "TransitEye") {
        API_BASE = `http://127.0.0.1:${p}`;
        return API_BASE;
      }
    } catch (e) {}
  }
  return API_BASE;
}
initApiBase();

export async function safeFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    return res;
  } catch (err) {
    // If connection refused, try alternate port
    const altPort = API_BASE.includes("8000") ? "8001" : "8000";
    const altBase = `http://127.0.0.1:${altPort}`;
    try {
      const resAlt = await fetch(`${altBase}${path}`, options);
      if (resAlt.ok || resAlt.status < 500) {
        API_BASE = altBase; // persist working base
        return resAlt;
      }
    } catch (e2) {}
    throw err;
  }
}

export async function fetchBuses() {
  try {
    const res = await safeFetch("/api/buses");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline, using fallback state:", err);
    return null;
  }
}

export async function fetchEvents() {
  try {
    const res = await safeFetch("/api/events");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchRoadIssues() {
  try {
    const res = await safeFetch("/api/road-issues");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchIncidents() {
  try {
    const res = await safeFetch("/api/incidents");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateIncidentStatus(incidentId, status) {
  try {
    const res = await safeFetch(`/api/incidents/${incidentId}`, {
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
    const res = await safeFetch("/api/analytics");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchEdgeStats() {
  try {
    const res = await safeFetch("/api/edge-stats");
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function createEvent(payload) {
  try {
    const res = await safeFetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Create event failed");
    return await res.json();
  } catch (err) {
    console.error("Create event error:", err);
    return null;
  }
}

export async function triggerDemoScenario(scenario, busId = "BUS-104", cameraAngle = "front") {
  try {
    const res = await safeFetch("/api/demo/trigger", {
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

// -------------------------------------------------------------
// Real RF-DETR Neural Vision & Live ML Feed APIs
// -------------------------------------------------------------
export async function fetchSystemStatus() {
  try {
    const res = await safeFetch("/api/status");
    if (!res.ok) throw new Error("Status API error");
    return await res.json();
  } catch (err) {
    console.warn("AI Backend status check failed:", err);
    return null;
  }
}

export async function fetchSamples() {
  try {
    const res = await safeFetch("/api/samples");
    if (!res.ok) throw new Error("Samples API error");
    return await res.json();
  } catch (err) {
    console.warn("AI Samples fetch failed:", err);
    return { images: [], videos: [] };
  }
}

export async function detectImage({ file, samplePath, modelName = "pothole", threshold = 0.45 }) {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  } else if (samplePath) {
    formData.append("sample_path", samplePath);
  }
  formData.append("model_name", modelName);
  formData.append("threshold", threshold);

  const res = await safeFetch("/api/detect/image", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Inference failed" }));
    throw new Error(errData.detail || "Image detection failed");
  }
  return await res.json();
}

export async function detectVideo({ file, samplePath, modelName = "pothole", threshold = 0.45, frameSkip = 2, maxSeconds = 12 }) {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  } else if (samplePath) {
    formData.append("sample_path", samplePath);
  }
  formData.append("model_name", modelName);
  formData.append("threshold", threshold);
  formData.append("frame_skip", frameSkip);
  formData.append("max_seconds", maxSeconds);

  const res = await safeFetch("/api/detect/video", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Video processing failed" }));
    throw new Error(errData.detail || "Video processing failed");
  }
  return await res.json();
}

export function getLiveStreamUrl(modelName = "pothole", threshold = 0.40) {
  return `${API_BASE}/api/stream/live/${modelName}?threshold=${threshold}`;
}
