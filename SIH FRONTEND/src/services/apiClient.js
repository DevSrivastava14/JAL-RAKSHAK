// =====================================================================
// JALRAKSHAK - Centralized Backend API Client
// Connects to FastAPI backend at VITE_API_BASE_URL with graceful fallback
// =====================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Generic API Fetch Helper with timeout and fallback support
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const timeoutMs = options.timeout || 3500;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    // Rethrow to let caller decide on mock fallback
    throw err;
  }
}

export const apiClient = {
  baseUrl: API_BASE_URL,

  // 1. Cities & Zones
  async getCities() {
    return await apiFetch('/cities');
  },

  async getCity(cityId = 'mumbai') {
    return await apiFetch(`/cities/${cityId}`);
  },

  async getCityOverview(cityId = 'mumbai') {
    return await apiFetch(`/cities/${cityId}/overview`);
  },

  async getZones(cityId = 'mumbai', riskFilter = null) {
    const query = riskFilter && riskFilter !== 'ALL' ? `?risk=${encodeURIComponent(riskFilter)}` : '';
    return await apiFetch(`/cities/${cityId}/zones${query}`);
  },

  async getZoneById(cityId = 'mumbai', zoneId) {
    return await apiFetch(`/cities/${cityId}/zones/${zoneId}`);
  },

  async getSensors(cityId = 'mumbai') {
    return await apiFetch(`/cities/${cityId}/sensors`);
  },

  // 2. Predictions & XAI
  async getPredictions(cityId = 'mumbai') {
    return await apiFetch(`/predictions?city_id=${cityId}`);
  },

  async getZonePrediction(zoneId, rainfall = null) {
    const query = rainfall !== null ? `?rainfall=${rainfall}` : '';
    return await apiFetch(`/predictions/${zoneId}${query}`);
  },

  async getZoneExplanation(zoneId, rainfall = null) {
    const query = rainfall !== null ? `?rainfall=${rainfall}` : '';
    return await apiFetch(`/predictions/${zoneId}/explanation${query}`);
  },

  // 3. Alerts
  async getAlerts(cityId = 'mumbai', severity = null, status = null) {
    const params = new URLSearchParams({ city_id: cityId });
    if (severity && severity !== 'ALL') params.append('severity', severity);
    if (status && status !== 'ALL') params.append('status', status);
    return await apiFetch(`/alerts?${params.toString()}`);
  },

  async getActiveAlerts(cityId = 'mumbai') {
    return await apiFetch(`/alerts/active?city_id=${cityId}`);
  },

  async getAlertById(alertId) {
    return await apiFetch(`/alerts/${alertId}`);
  },

  async dispatchAlert(alertData) {
    return await apiFetch('/sms/broadcast', {
      method: 'POST',
      body: JSON.stringify(alertData)
    });
  },

  // 4. Flood Map GeoJSON
  async getFloodMap(cityId = 'mumbai') {
    return await apiFetch(`/flood-map/${cityId}`);
  },

  // 5. Drainage & Infrastructure
  async getDrainage(cityId = 'mumbai') {
    return await apiFetch(`/drainage/${cityId}`);
  },

  async getInfrastructure(cityId = 'mumbai') {
    return await apiFetch(`/infrastructure/${cityId}`);
  },

  async getAffectedInfrastructure(cityId = 'mumbai', minSeverity = 'HIGH') {
    return await apiFetch(`/infrastructure/affected?city_id=${cityId}&min_severity=${minSeverity}`);
  },

  async togglePumpStatus(infraId, deltaActive) {
    return await apiFetch(`/infrastructure/${infraId}/pump-toggle`, {
      method: 'POST',
      body: JSON.stringify({ deltaActive })
    });
  },

  // 6. Simulation
  async getSimulationScenarios() {
    return await apiFetch('/simulation/scenarios');
  },

  async runSimulation(params) {
    return await apiFetch('/simulation', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async getSimulationById(simulationId) {
    return await apiFetch(`/simulation/${simulationId}`);
  },

  // 7. Safe Routing
  async computeSafeRoutes(fromLocation, toLocation, isEmergencyMode = false, conditions = null) {
    return await apiFetch('/routes/safe', {
      method: 'POST',
      body: JSON.stringify({
        start_location: fromLocation,
        fromLocation,
        destination: toLocation,
        toLocation,
        is_emergency_mode: isEmergencyMode,
        isEmergencyMode,
        current_flood_conditions: conditions
      })
    });
  },

  async getRoutingLocations(cityId = 'mumbai') {
    return await apiFetch(`/routes/locations/${cityId}`);
  },

  async getHazards(cityId = 'mumbai') {
    return await apiFetch(`/routes/hazards/${cityId}`);
  }
};
