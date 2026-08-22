// =====================================================================
// JALRAKSHAK - Data Access Service Layer
// Connects to FastAPI Backend with Seamless Offline Mock Fallback
// =====================================================================

import {
  CITY_OVERVIEW,
  WARDS_DATA,
  SENSORS_DATA,
  NOWCAST_TIMELINE,
  ALERTS_DATA,
  INFRASTRUCTURE_DATA,
  SIMULATION_SCENARIOS,
  EVACUATION_SHELTERS
} from '../mock/floodData';
import { apiClient } from './apiClient';

// In-memory state containers to support live mutations during offline demo
let alertsState = [...ALERTS_DATA];
let infraState = [...INFRASTRUCTURE_DATA];
let wardsState = [...WARDS_DATA];

export const floodService = {
  // Get high-level disaster command metrics
  async getCityOverview(cityId = 'mumbai') {
    try {
      const data = await apiClient.getCityOverview(cityId);
      return data;
    } catch (err) {
      console.warn('Backend API unavailable, using high-fidelity local dataset for CityOverview:', err.message);
      await delay(80);
      return {
        ...CITY_OVERVIEW,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  // Get all ward catchments
  async getWards(cityId = 'mumbai', riskFilter = null) {
    try {
      const data = await apiClient.getZones(cityId, riskFilter);
      return data;
    } catch (err) {
      console.warn('Backend API unavailable, using local Wards dataset:', err.message);
      await delay(60);
      return [...wardsState];
    }
  },

  // Get ward by ID
  async getWardById(id, cityId = 'mumbai') {
    try {
      const data = await apiClient.getZoneById(cityId, id);
      return data;
    } catch (err) {
      console.warn(`Backend API unavailable, looking up local ward ${id}:`, err.message);
      await delay(40);
      return wardsState.find(w => w.id === id) || null;
    }
  },

  // Get live IoT sensors network
  async getSensors(cityId = 'mumbai') {
    try {
      const data = await apiClient.getSensors(cityId);
      return data.map(sensor => ({
        ...sensor,
        // Micro-fluctuations to simulate live telemetry
        jitterNumeric: +(sensor.rawNumeric + (Math.random() * 0.04 - 0.02)).toFixed(2)
      }));
    } catch (err) {
      console.warn('Backend API unavailable, using local sensor dataset:', err.message);
      await delay(60);
      return SENSORS_DATA.map(sensor => ({
        ...sensor,
        jitterNumeric: +(sensor.rawNumeric + (Math.random() * 0.04 - 0.02)).toFixed(2)
      }));
    }
  },

  // Get AI Nowcasting 0-6 Hour Forecast timeline
  async getNowcastTimeline(zoneId = 'ZONE-KUR-01') {
    try {
      const pred = await apiClient.getZonePrediction(zoneId);
      if (pred && pred.hourlyNowcast) {
        return pred.hourlyNowcast;
      }
      return [...NOWCAST_TIMELINE];
    } catch (err) {
      console.warn('Backend API unavailable, using local NowcastTimeline:', err.message);
      await delay(80);
      return [...NOWCAST_TIMELINE];
    }
  },

  // Get active and historical emergency alerts
  async getAlerts(cityId = 'mumbai', severity = null, status = null) {
    try {
      const data = await apiClient.getAlerts(cityId, severity, status);
      return data;
    } catch (err) {
      console.warn('Backend API unavailable, using local Alerts dataset:', err.message);
      await delay(60);
      return [...alertsState];
    }
  },

  // Dispatch / create a new emergency alert
  async dispatchAlert(alertData) {
    try {
      const newAlert = await apiClient.dispatchAlert(alertData);
      alertsState = [newAlert, ...alertsState];
      return newAlert;
    } catch (err) {
      console.warn('Backend API unavailable, dispatching locally in memory:', err.message);
      await delay(150);
      const newAlert = {
        id: `ALT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: "Just now",
        status: "DISPATCHED",
        broadcastSent: true,
        channels: alertData.channels || ["SMS Broadcast", "Civil Defense", "Traffic Feed"],
        capCode: `CAP-IN-MH-MUM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        ...alertData
      };
      alertsState = [newAlert, ...alertsState];
      return newAlert;
    }
  },

  // Get storm pumps and drainage infrastructure
  async getInfrastructure(cityId = 'mumbai') {
    try {
      const data = await apiClient.getInfrastructure(cityId);
      return data;
    } catch (err) {
      console.warn('Backend API unavailable, using local Infrastructure dataset:', err.message);
      await delay(60);
      return [...infraState];
    }
  },

  // Toggle pump or asset operational status
  async togglePumpStatus(infraId, deltaActive) {
    try {
      const updated = await apiClient.togglePumpStatus(infraId, deltaActive);
      return updated;
    } catch (err) {
      console.warn(`Backend API unavailable, toggling pump ${infraId} locally:`, err.message);
      await delay(100);
      infraState = infraState.map(item => {
        if (item.id === infraId) {
          const nextActive = Math.max(0, Math.min(item.installedPumps, item.activePumps + deltaActive));
          const activeRatio = item.installedPumps > 0 ? nextActive / item.installedPumps : 1;
          return {
            ...item,
            activePumps: nextActive,
            currentDischargeLPS: Math.round(item.totalCapacityLPS * activeRatio),
            status: nextActive === item.installedPumps ? "OPERATIONAL_MAX" : (nextActive > 0 ? "OPERATIONAL" : "OFFLINE")
          };
        }
        return item;
      });
      return infraState.find(i => i.id === infraId);
    }
  },

  // Get simulation presets
  async getSimulationScenarios() {
    try {
      const list = await apiClient.getSimulationScenarios();
      return list;
    } catch (err) {
      console.warn('Backend API unavailable, using local SimulationScenarios:', err.message);
      await delay(60);
      return [...SIMULATION_SCENARIOS];
    }
  },

  // Run custom simulation calculation
  async runCustomSimulation(params) {
    try {
      const result = await apiClient.runSimulation(params);
      return result;
    } catch (err) {
      console.warn('Backend API unavailable, running local simulation solver:', err.message);
      await delay(200);
      const rainfallMmHr = params.rainfallIntensity || params.rainfallMmHr || 70;
      const highTideM = params.highTideM || 3.6;
      const drainageBlockagePct = params.drainageBlockage || params.drainageBlockagePct || 30;
      const pumpsOnlinePct = params.pumpsOnlinePct || 90;

      const rainfallFactor = (rainfallMmHr / 50);
      const tideBackpressureFactor = Math.max(1, (highTideM / 3.2));
      const blockageFactor = 1 + (drainageBlockagePct / 100) * 1.4;
      const pumpReliefFactor = Math.max(0.4, (pumpsOnlinePct / 100));

      const totalSeverityIndex = (rainfallFactor * tideBackpressureFactor * blockageFactor) / pumpReliefFactor;
      const estimatedInundationSqKm = +(Math.min(52.0, 7.5 * totalSeverityIndex)).toFixed(1);
      const impactedPopulation = Math.round(Math.min(380000, 22000 * Math.pow(totalSeverityIndex, 1.35)));
      const criticalWardsCount = Math.min(8, Math.max(1, Math.round(totalSeverityIndex * 2.2)));
      const maxWaterDepthM = +(Math.min(2.8, 0.4 + (totalSeverityIndex * 0.45))).toFixed(2);

      return {
        simulationId: `SIM-RUN-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        params: { rainfallMmHr, highTideM, drainageBlockagePct, pumpsOnlinePct },
        results: {
          totalSeverityIndex: +totalSeverityIndex.toFixed(2),
          estimatedInundationSqKm,
          impactedPopulation,
          criticalWardsCount,
          maxWaterDepthM,
          drainageCapacityUtilizationPct: Math.min(100, Math.round(totalSeverityIndex * 42)),
          breachedCatchments: wardsState.slice(0, criticalWardsCount).map(w => w.name),
          recommendedActions: [
            "Issue Red Alert broadcast for low-lying river catchments.",
            "Deploy auxiliary diesel high-flow de-watering pumps to underpasses.",
            "Activate emergency school shelters."
          ]
        }
      };
    }
  },

  // Get evacuation shelters
  async getEvacuationShelters() {
    await delay(50);
    return [...EVACUATION_SHELTERS];
  }
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
