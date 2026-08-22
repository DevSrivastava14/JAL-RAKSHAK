// JALRAKSHAK - Data Access Service Layer
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

// In-memory state containers to support live mutations during demo
let alertsState = [...ALERTS_DATA];
let infraState = [...INFRASTRUCTURE_DATA];
let wardsState = [...WARDS_DATA];

export const floodService = {
  // Get high-level disaster command metrics
  async getCityOverview() {
    await delay(120);
    return {
      ...CITY_OVERVIEW,
      lastUpdated: new Date().toISOString()
    };
  },

  // Get all ward catchments
  async getWards() {
    await delay(100);
    return [...wardsState];
  },

  // Get ward by ID
  async getWardById(id) {
    await delay(60);
    return wardsState.find(w => w.id === id) || null;
  },

  // Get live IoT sensors network
  async getSensors() {
    await delay(100);
    return SENSORS_DATA.map(sensor => ({
      ...sensor,
      // Add slight micro-fluctuations to simulate live telemetry
      jitterNumeric: +(sensor.rawNumeric + (Math.random() * 0.04 - 0.02)).toFixed(2)
    }));
  },

  // Get AI Nowcasting 0-6 Hour Forecast timeline
  async getNowcastTimeline() {
    await delay(150);
    return [...NOWCAST_TIMELINE];
  },

  // Get active and historical emergency alerts
  async getAlerts() {
    await delay(100);
    return [...alertsState];
  },

  // Dispatch / create a new emergency alert
  async dispatchAlert(alertData) {
    await delay(250);
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
  },

  // Get storm pumps and drainage infrastructure
  async getInfrastructure() {
    await delay(100);
    return [...infraState];
  },

  // Toggle pump or asset operational status
  async togglePumpStatus(infraId, deltaActive) {
    await delay(200);
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
  },

  // Get simulation presets
  async getSimulationScenarios() {
    await delay(100);
    return [...SIMULATION_SCENARIOS];
  },

  // Run custom simulation calculation
  async runCustomSimulation({ rainfallMmHr, highTideM, drainageBlockagePct, pumpsOnlinePct }) {
    await delay(350); // Simulate ML/Hydraulic solver calculation
    
    // Physical hydrodynamic approximation formula for urban runoff
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
        recommendedActions: generateRecommendations(totalSeverityIndex, highTideM, pumpsOnlinePct)
      }
    };
  },

  // Get evacuation shelters
  async getEvacuationShelters() {
    await delay(80);
    return [...EVACUATION_SHELTERS];
  }
};

function generateRecommendations(severity, tide, pumps) {
  const recs = [];
  if (severity > 2.5) {
    recs.push("Issue Red Alert broadcast for low-lying river catchments.");
    recs.push("Deploy National Disaster Response Force (NDRF) to Mithi River basin.");
  }
  if (tide > 3.8) {
    recs.push("Close coastal gravity outfalls to prevent tidal seawater reverse ingress.");
  }
  if (pumps < 90) {
    recs.push("Mobilize auxiliary diesel high-flow de-watering pumps to underpasses.");
  }
  recs.push("Activate ward-level school shelters and provide hot meals & drinking water.");
  return recs;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
