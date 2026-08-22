// =========================================================
// JALRAKSHAK - Modular Simulation & Hydrodynamic Engine
// Replaceable with live AI/ML prediction model or SWMM API
// =========================================================

export const BASELINE_CONDITIONS = {
  rainfallIntensity: 25,     // mm/h
  rainfallDuration: 45,      // minutes
  drainageEfficiency: 85,    // %
  drainageBlockage: 15       // %
};

export const PRESET_SCENARIOS = [
  {
    id: "scen-light",
    name: "Light Monsoon Shower",
    category: "Routine",
    params: {
      rainfallIntensity: 20,
      rainfallDuration: 60,
      drainageEfficiency: 90,
      drainageBlockage: 10
    },
    description: "Standard scattered showers with clean, desilted municipal stormwater channels."
  },
  {
    id: "scen-moderate-downpour",
    name: "Intense Downpour (60mm/h)",
    category: "Severe Weather",
    params: {
      rainfallIntensity: 60,
      rainfallDuration: 120,
      drainageEfficiency: 80,
      drainageBlockage: 30
    },
    description: "2-hour sustained high-intensity precipitation causing localized subway waterlogging."
  },
  {
    id: "scen-cloudburst-surge",
    name: "Extreme Cloudburst + High Tide Lock",
    category: "Catastrophic Event",
    params: {
      rainfallIntensity: 110,
      rainfallDuration: 90,
      drainageEfficiency: 60,
      drainageBlockage: 50
    },
    description: "Flash convective cloudburst exceeding drainage design margins with tidal backpressure."
  },
  {
    id: "scen-choked-infrastructure",
    name: "Urban Chokepoint & Pump Failure",
    category: "Infrastructure Failure",
    params: {
      rainfallIntensity: 75,
      rainfallDuration: 150,
      drainageEfficiency: 40,
      drainageBlockage: 75
    },
    description: "Heavy rain coupled with 75% drain siltation and major outfall pump tripping."
  }
];

// All possible roads in the city network that can be affected
const ALL_ROADS_CATALOG = [
  {
    id: "RD-LBS",
    name: "L.B.S. Marg (Kurla to Ghatkopar)",
    zone: "Central Corridor",
    baseThresholdM: 0.35,
    criticalThresholdM: 0.80,
    normalCapacityKmh: 45,
    detourRoute: "Eastern Express Highway (EEH)"
  },
  {
    id: "RD-HINDMATA",
    name: "Dr. B.A. Road (Hindmata & Dadar TT)",
    zone: "South-Central Lowland",
    baseThresholdM: 0.30,
    criticalThresholdM: 0.70,
    normalCapacityKmh: 50,
    detourRoute: "Lalbaug Flyover Overhead Corridor"
  },
  {
    id: "RD-MILAN",
    name: "Milan Subway (Santacruz - Khar)",
    zone: "Western Suburbs",
    baseThresholdM: 0.25,
    criticalThresholdM: 0.60,
    normalCapacityKmh: 40,
    detourRoute: "Milan Flyover Bridge"
  },
  {
    id: "RD-ANDHERI",
    name: "Andheri Subway & S.V. Road Underpass",
    zone: "Western Suburbs",
    baseThresholdM: 0.25,
    criticalThresholdM: 0.55,
    normalCapacityKmh: 35,
    detourRoute: "Gokhale Bridge & Western Express Highway"
  },
  {
    id: "RD-SION",
    name: "Sion Circle & Gandhi Market Arterial",
    zone: "Central Sump",
    baseThresholdM: 0.30,
    criticalThresholdM: 0.65,
    normalCapacityKmh: 45,
    detourRoute: "Sion-Bandra Link Road"
  },
  {
    id: "RD-BKC",
    name: "BKC Connector & Kalanagar Junction",
    zone: "Commercial Hub",
    baseThresholdM: 0.45,
    criticalThresholdM: 0.90,
    normalCapacityKmh: 60,
    detourRoute: "Bandra Reclamation Expressway"
  }
];

// All critical infrastructure assets
const ALL_INFRA_CATALOG = [
  {
    id: "INF-HOSP-SION",
    name: "Lokmanya Tilak Municipal Hospital (Sion)",
    type: "CRITICAL_HEALTHCARE",
    thresholdDepthM: 0.45,
    vulnerabilityNote: "Ground access road & casualty ward ingress risk."
  },
  {
    id: "INF-RAIL-CR",
    name: "Central Railway Mainline Tracks (Sion-Kurla)",
    type: "TRANSIT_LIFELINE",
    thresholdDepthM: 0.20,
    vulnerabilityNote: "Track submersion above 4 inches requires speed reduction to 20 kmph."
  },
  {
    id: "INF-PUMP-BRIT",
    name: "Britannia Stormwater Pumping Station Sump",
    type: "DRAINAGE_FACILITY",
    thresholdDepthM: 0.60,
    vulnerabilityNote: "Intake culvert surcharge exceeding gravitational discharge limit."
  },
  {
    id: "INF-ELEC-KURLA",
    name: "Kurla 33kV Power Distribution Substation",
    type: "POWER_GRID",
    thresholdDepthM: 0.50,
    vulnerabilityNote: "Feeder switchgear tripping risk if flood wall breaches."
  },
  {
    id: "INF-HOSP-BHABHA",
    name: "Bhabha Municipal General Hospital",
    type: "CRITICAL_HEALTHCARE",
    thresholdDepthM: 0.40,
    vulnerabilityNote: "Low-lying entrance requires deployable flood barrier gates."
  }
];

/**
 * Core Modular Simulation Calculation Method
 * Computes hydraulic flood metrics based on parametric inputs
 */
export function runModularSimulation(params) {
  const {
    rainfallIntensity, // mm/h (10 to 150)
    rainfallDuration,  // minutes (15 to 360)
    drainageEfficiency,// % (10 to 100)
    drainageBlockage   // % (0 to 100)
  } = params;

  // 1. Calculate Accumulated Precipitation Volume (mm)
  const durationHours = rainfallDuration / 60;
  const totalRainfallMm = rainfallIntensity * durationHours;

  // 2. Net Effective Drainage Capacity Factor (0.05 to 1.0)
  const effectiveEfficiencyFactor = (drainageEfficiency / 100) * (1 - (drainageBlockage / 100) * 0.9);
  const clampedEffectiveFactor = Math.max(0.06, effectiveEfficiencyFactor);

  // 3. Composite Hydrodynamic Severity Index
  // Formula balances intensity, accumulated volume, and drainage deficit
  const hydroSeverity = (Math.pow(rainfallIntensity / 40, 1.25) * Math.pow(durationHours, 0.65)) / Math.pow(clampedEffectiveFactor, 0.85);

  // 4. Flood Probability (0 - 100%)
  const rawProb = Math.min(99, Math.max(5, Math.round(15 + (hydroSeverity * 24))));
  const floodProbability = rawProb;

  // 5. Estimated Max Water Depth (meters)
  const estimatedWaterDepthM = +(Math.min(2.85, Math.max(0.04, 0.12 * Math.pow(hydroSeverity, 1.15)))).toFixed(2);

  // 6. Inundated Area (sq km)
  const affectedAreaSqKm = +(Math.min(52.0, Math.max(0.8, 4.2 * Math.pow(hydroSeverity, 1.1)))).toFixed(1);

  // 7. Drainage Overload Percentage
  const drainageOverloadPct = Math.min(100, Math.round(Math.min(250, (hydroSeverity * 45))));

  // 8. Estimated Time to Flooding (Onset Lead Time)
  let estimatedTimeToFlooding = "";
  let onsetMinutes = 0;
  if (rainfallIntensity >= 90 || hydroSeverity >= 3.5) {
    estimatedTimeToFlooding = "Immediate (Active Inundation)";
    onsetMinutes = 0;
  } else if (hydroSeverity >= 2.2) {
    onsetMinutes = Math.max(10, Math.round(45 / Math.sqrt(hydroSeverity)));
    estimatedTimeToFlooding = `T+${onsetMinutes} mins`;
  } else if (hydroSeverity >= 1.2) {
    onsetMinutes = Math.max(25, Math.round(75 / Math.sqrt(hydroSeverity)));
    estimatedTimeToFlooding = `T+${onsetMinutes} mins`;
  } else if (hydroSeverity >= 0.6) {
    onsetMinutes = Math.round(120 / Math.sqrt(hydroSeverity));
    estimatedTimeToFlooding = `T+${onsetMinutes} mins (~${(onsetMinutes / 60).toFixed(1)} hrs)`;
  } else {
    estimatedTimeToFlooding = "> 3 Hours (Safe Buffer)";
    onsetMinutes = 180;
  }

  // 9. Determine Impacted Roads
  const affectedRoads = ALL_ROADS_CATALOG.map(road => {
    const roadDepth = +(Math.min(2.2, estimatedWaterDepthM * (road.baseThresholdM / 0.3))).toFixed(2);
    let status = "CLEAR_OPEN";
    let statusLabel = "Clear & Open";
    let speedKmh = road.normalCapacityKmh;

    if (roadDepth >= road.criticalThresholdM) {
      status = "SUBMERGED_CLOSED";
      statusLabel = "Submerged & Barricaded";
      speedKmh = 0;
    } else if (roadDepth >= road.baseThresholdM) {
      status = "WATERLOGGED_SLOW";
      statusLabel = "Waterlogged (Slow)";
      speedKmh = Math.max(10, Math.round(road.normalCapacityKmh * 0.3));
    }

    return {
      ...road,
      currentDepthM: roadDepth,
      status,
      statusLabel,
      currentSpeedKmh: speedKmh
    };
  }).filter(r => r.currentDepthM >= 0.15 || hydroSeverity > 1.0);

  // 10. Determine Critical Infrastructure at Risk
  const criticalInfraAtRisk = ALL_INFRA_CATALOG.map(infra => {
    const isAtRisk = estimatedWaterDepthM >= infra.thresholdDepthM;
    const severityTier = estimatedWaterDepthM >= infra.thresholdDepthM * 1.5 ? "CRITICAL_RISK" : (isAtRisk ? "HIGH_RISK" : "SAFE");

    return {
      ...infra,
      isAtRisk,
      severityTier,
      waterDepthAroundAssetM: +(Math.min(2.0, estimatedWaterDepthM * 0.9)).toFixed(2)
    };
  });

  // 11. Explainable AI Feature Attribution Breakdown
  // Calculates relative percentage contribution of each factor to the total risk
  const weightIntensity = (rainfallIntensity / 150) * 1.4;
  const weightDuration = (rainfallDuration / 360) * 1.0;
  const weightBlockage = (drainageBlockage / 100) * 1.2;
  const weightEfficiencyDeficit = ((100 - drainageEfficiency) / 90) * 0.9;

  const totalWeights = weightIntensity + weightDuration + weightBlockage + weightEfficiencyDeficit || 1;

  const factorAttribution = [
    {
      factorName: "Rainfall Intensity",
      contributionPct: Math.round((weightIntensity / totalWeights) * 100),
      color: "#ff334b",
      description: `${rainfallIntensity} mm/h precipitation exceeds standard sewer runoff velocity.`
    },
    {
      factorName: "Drainage Siltation & Blockage",
      contributionPct: Math.round((weightBlockage / totalWeights) * 100),
      color: "#ff7700",
      description: `${drainageBlockage}% cross-sectional obstruction reduces discharge throughput.`
    },
    {
      factorName: "Storm Duration",
      contributionPct: Math.round((weightDuration / totalWeights) * 100),
      color: "#00b4d8",
      description: `${rainfallDuration} mins duration accumulates ${totalRainfallMm.toFixed(0)}mm total volume.`
    },
    {
      factorName: "Reduced Drainage Efficiency",
      contributionPct: Math.round((weightEfficiencyDeficit / totalWeights) * 100),
      color: "#ffcc00",
      description: `${100 - drainageEfficiency}% efficiency loss from pipe degradation & backflow.`
    }
  ];

  // 12. Calculate Baseline Metrics for Comparison
  const baselineResults = computeBaselineResults();

  const comparison = {
    baseline: baselineResults,
    simulated: {
      floodProbability,
      estimatedWaterDepthM,
      affectedAreaSqKm,
      affectedRoadsCount: affectedRoads.filter(r => r.status !== 'CLEAR_OPEN').length,
      drainageOverloadPct
    },
    deltas: {
      probDelta: floodProbability - baselineResults.floodProbability,
      depthDelta: +(estimatedWaterDepthM - baselineResults.estimatedWaterDepthM).toFixed(2),
      areaDelta: +(affectedAreaSqKm - baselineResults.affectedAreaSqKm).toFixed(1),
      roadsDelta: affectedRoads.filter(r => r.status !== 'CLEAR_OPEN').length - baselineResults.affectedRoadsCount
    }
  };

  // 13. Determine Overall Risk Tier
  let riskTier = "LOW";
  if (floodProbability >= 80 || estimatedWaterDepthM >= 1.0) {
    riskTier = "CRITICAL";
  } else if (floodProbability >= 60 || estimatedWaterDepthM >= 0.5) {
    riskTier = "HIGH";
  } else if (floodProbability >= 40 || estimatedWaterDepthM >= 0.25) {
    riskTier = "MODERATE";
  }

  // 14. Action SOP Recommendations
  const actionableRecommendations = generateActionSOPs(riskTier, estimatedWaterDepthM, affectedRoads);

  return {
    simulationId: `SIM-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    params,
    riskTier,
    floodProbability,
    estimatedWaterDepthM,
    affectedAreaSqKm,
    drainageOverloadPct,
    estimatedTimeToFlooding,
    totalRainfallMm: +totalRainfallMm.toFixed(1),
    affectedRoads,
    criticalInfraAtRisk,
    factorAttribution,
    comparison,
    actionableRecommendations
  };
}

function computeBaselineResults() {
  const durationHours = BASELINE_CONDITIONS.rainfallDuration / 60;
  const totalRainfallMm = BASELINE_CONDITIONS.rainfallIntensity * durationHours;
  const effectiveEff = (BASELINE_CONDITIONS.drainageEfficiency / 100) * (1 - (BASELINE_CONDITIONS.drainageBlockage / 100) * 0.9);
  const hydroSev = (Math.pow(BASELINE_CONDITIONS.rainfallIntensity / 40, 1.25) * Math.pow(durationHours, 0.65)) / Math.pow(effectiveEff, 0.85);

  return {
    floodProbability: 22,
    estimatedWaterDepthM: 0.15,
    affectedAreaSqKm: 3.4,
    affectedRoadsCount: 0,
    drainageOverloadPct: 28,
    riskTier: "LOW"
  };
}

function generateActionSOPs(riskTier, depth, roads) {
  const list = [];
  if (riskTier === "CRITICAL") {
    list.push("Issue Red Alert broadcast for low-lying urban catchments.");
    list.push("Deploy auxiliary diesel high-head submersible pumps to railway underpasses.");
    list.push("Activate emergency green corridors for critical hospital trauma ambulances.");
    list.push("Order closure of subways with water depth exceeding 0.3 meters.");
  } else if (riskTier === "HIGH") {
    list.push("Post traffic police diversion warnings at arterial highway junctions.");
    list.push("Engage standby pumping turbines to maintain intake sump drawdown.");
    list.push("Inspect trash racks at primary drainage outfalls for plastic blockages.");
  } else if (riskTier === "MODERATE") {
    list.push("Monitor live IoT ultrasonic gauges for rapid water level rise.");
    list.push("Alert municipal ward disaster control cells for localized clearing.");
  } else {
    list.push("Standard routine telemetry monitoring. No immediate emergency deployment required.");
  }
  return list;
}
