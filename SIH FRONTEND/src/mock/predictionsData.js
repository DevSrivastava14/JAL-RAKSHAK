// =========================================================
// JALRAKSHAK - Modular Predictions & Explainable AI Dataset
// SIH26085 0-6 Hour Flood Nowcasting Machine Learning Engine
// Replaceable with live ML / Graph Neural Network REST API
// =========================================================

export const AI_MODEL_METADATA = {
  modelArchitecture: "ConvLSTM + Spatio-Temporal Graph Neural Net (ST-GNN v2.4)",
  radarFeed: "IMD Santacruz S-Band Doppler Weather Radar (100m grid)",
  iotNetworkSensors: 142,
  inferenceLatencyMs: 38,
  confidenceEnsemble: 94.2, // %
  lastModelRun: new Date().toISOString()
};

export const ZONES_PREDICTIONS = [
  {
    id: "ZONE-PRED-KUR",
    name: "Kurla West & Mithi River Basin",
    wardCode: "L-Ward",
    zoneCategory: "Riverine Lowland Basin",
    currentRainfall: 68.0,
    currentRainfallStr: "68.0 mm/h",
    floodProbability: 96,
    expectedTimeToFlooding: "Immediate (Active Overflow)",
    leadTimeToPeak: "38 mins",
    peakFloodArrival: "14:50 IST",
    estimatedWaterDepthM: 1.45,
    dangerThresholdM: 1.00,
    severity: "CRITICAL",
    predictionConfidence: 97,
    populationAtRisk: 86000,
    description: "Mithi River water level has crossed the danger mark. High-intensity convective cell moving directly over Kranti Nagar and Bail Bazar.",
    
    // Explainable AI (XAI) Feature Attribution for the 7 Key Factors
    xaiFactors: [
      {
        id: "factor-rain-intensity",
        name: "Rainfall Intensity",
        value: "68.0 mm/h",
        contributionPct: 28,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        impactDirection: "INCREASES_RISK",
        explanation: "Convective cell intensity of 68.0 mm/h exceeds local stormwater conduit throughput by 240%."
      },
      {
        id: "factor-drain-blockage",
        name: "Drainage Blockage & Siltation",
        value: "65% Choked / Silted",
        contributionPct: 22,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        impactDirection: "INCREASES_RISK",
        explanation: "Heavy plastic and sediment accumulation in Mithi trunk outfall constricts cross-sectional discharge."
      },
      {
        id: "factor-rain-duration",
        name: "Rainfall Duration",
        value: "2h 15m Sustained",
        contributionPct: 18,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "135 minutes of continuous rainfall has completely saturated catchment surface infiltration capacity."
      },
      {
        id: "factor-elevation",
        name: "Elevation & Topography",
        value: "2.4m AMSL (Depression)",
        contributionPct: 12,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Low-lying topographic depression causes high gravity runoff pooling from surrounding elevated areas."
      },
      {
        id: "factor-drain-capacity",
        name: "Drainage Capacity",
        value: "24,000 LPS (138% Load)",
        contributionPct: 9,
        severity: "WARNING",
        statusColor: "#ffaa00",
        impactDirection: "INCREASES_RISK",
        explanation: "Gravity drain channels are surcharge-locked due to high water surface elevations in receiving nullahs."
      },
      {
        id: "factor-impervious",
        name: "Impervious Surface Fraction",
        value: "88% Built-up / Concrete",
        contributionPct: 7,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Dense urban pavement converts 92% of gross rainfall into instantaneous surface runoff."
      },
      {
        id: "factor-history",
        name: "Historical Flood Tendency",
        value: "14 Inundations / 5 Yrs",
        contributionPct: 4,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Historical spatial vulnerability prior strongly reinforces high-probability flood classification."
      }
    ],

    // 0-6 Hour Time-Series Progression for Selected Zone
    hourlyNowcast: [
      { timeLabel: "Now (T+0)", offsetMin: 0, rainfallMmHr: 68.0, waterLevelM: 1.45, floodProbPct: 96 },
      { timeLabel: "T+30m", offsetMin: 30, rainfallMmHr: 76.5, waterLevelM: 1.62, floodProbPct: 98 },
      { timeLabel: "T+1h", offsetMin: 60, rainfallMmHr: 84.0, waterLevelM: 1.78, floodProbPct: 99 },
      { timeLabel: "T+1h 30m (Peak)", offsetMin: 90, rainfallMmHr: 91.2, waterLevelM: 1.95, floodProbPct: 99 },
      { timeLabel: "T+2h", offsetMin: 120, rainfallMmHr: 65.0, waterLevelM: 1.80, floodProbPct: 94 },
      { timeLabel: "T+3h", offsetMin: 180, rainfallMmHr: 42.0, waterLevelM: 1.40, floodProbPct: 82 },
      { timeLabel: "T+4h", offsetMin: 240, rainfallMmHr: 24.0, waterLevelM: 0.95, floodProbPct: 60 },
      { timeLabel: "T+6h", offsetMin: 360, rainfallMmHr: 12.0, waterLevelM: 0.40, floodProbPct: 25 }
    ]
  },
  {
    id: "ZONE-PRED-HIN",
    name: "Hindmata & Dadar TT Lowland",
    wardCode: "F/North Ward",
    zoneCategory: "Tidal Lock Lowland Bowl",
    currentRainfall: 54.5,
    currentRainfallStr: "54.5 mm/h",
    floodProbability: 92,
    expectedTimeToFlooding: "Active Waterlogging",
    leadTimeToPeak: "25 mins",
    peakFloodArrival: "14:40 IST",
    estimatedWaterDepthM: 1.40,
    dangerThresholdM: 0.80,
    severity: "CRITICAL",
    predictionConfidence: 95,
    populationAtRisk: 64000,
    description: "Gravitational discharge into Arabian sea locked by 3.82m coastal high tide. Britannia pumping station running 6/6 heavy turbine units.",
    
    xaiFactors: [
      {
        id: "factor-drain-capacity",
        name: "Drainage Capacity & Tidal Lock",
        value: "Locked by 3.82m Sea Tide",
        contributionPct: 29,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        impactDirection: "INCREASES_RISK",
        explanation: "High sea tide creates hydraulic backpressure, completely stopping gravitational stormwater outfall."
      },
      {
        id: "factor-elevation",
        name: "Elevation & Topography",
        value: "1.8m AMSL (Deep Basin)",
        contributionPct: 23,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        impactDirection: "INCREASES_RISK",
        explanation: "Lowest topographical bowl in island city, collecting water from Parel, Dadar, and Matunga hills."
      },
      {
        id: "factor-rain-intensity",
        name: "Rainfall Intensity",
        value: "54.5 mm/h",
        contributionPct: 20,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Continuous high downpour exceeds Britannia pumping station volumetric sump intake capacity."
      },
      {
        id: "factor-drain-blockage",
        name: "Drainage Blockage & Siltation",
        value: "50% Choked Sump",
        contributionPct: 13,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Sump silt deposits reduce underground holding tank active retention buffer by 3.2 million litres."
      },
      {
        id: "factor-impervious",
        name: "Impervious Surface Fraction",
        value: "94% Urban Concrete",
        contributionPct: 8,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Ultra-dense commercial asphalt surface allows near-zero natural groundwater percolation."
      },
      {
        id: "factor-rain-duration",
        name: "Rainfall Duration",
        value: "1h 45m Sustained",
        contributionPct: 5,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Sustained storm duration continually feeds low-lying depression sumps."
      },
      {
        id: "factor-history",
        name: "Historical Flood Tendency",
        value: "18 Breaches / 5 Yrs",
        contributionPct: 2,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "INCREASES_RISK",
        explanation: "Chronic annual flood hotspot; model relies heavily on historical inundation depth correlations."
      }
    ],

    hourlyNowcast: [
      { timeLabel: "Now (T+0)", offsetMin: 0, rainfallMmHr: 54.5, waterLevelM: 1.40, floodProbPct: 92 },
      { timeLabel: "T+30m", offsetMin: 30, rainfallMmHr: 62.0, waterLevelM: 1.55, floodProbPct: 96 },
      { timeLabel: "T+1h", offsetMin: 60, rainfallMmHr: 71.0, waterLevelM: 1.68, floodProbPct: 98 },
      { timeLabel: "T+1h 30m", offsetMin: 90, rainfallMmHr: 75.0, waterLevelM: 1.74, floodProbPct: 98 },
      { timeLabel: "T+2h", offsetMin: 120, rainfallMmHr: 52.0, waterLevelM: 1.50, floodProbPct: 90 },
      { timeLabel: "T+3h", offsetMin: 180, rainfallMmHr: 34.0, waterLevelM: 1.10, floodProbPct: 74 },
      { timeLabel: "T+4h", offsetMin: 240, rainfallMmHr: 18.0, waterLevelM: 0.65, floodProbPct: 45 },
      { timeLabel: "T+6h", offsetMin: 360, rainfallMmHr: 8.0, waterLevelM: 0.20, floodProbPct: 15 }
    ]
  },
  {
    id: "ZONE-PRED-MIL",
    name: "Milan & Khar Subway Corridor",
    wardCode: "H/West Ward",
    zoneCategory: "Railway Subway Underpass",
    currentRainfall: 51.0,
    currentRainfallStr: "51.0 mm/h",
    floodProbability: 84,
    expectedTimeToFlooding: "T+15 mins",
    leadTimeToPeak: "45 mins",
    peakFloodArrival: "15:00 IST",
    estimatedWaterDepthM: 0.95,
    dangerThresholdM: 0.50,
    severity: "HIGH",
    predictionConfidence: 93,
    populationAtRisk: 42000,
    description: "Water accumulating in subway underpass from surrounding road gradients. Automatic boom barriers activated.",
    
    xaiFactors: [
      {
        id: "factor-elevation",
        name: "Elevation & Topography",
        value: "Underpass Dip (-1.2m)",
        contributionPct: 31,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        impactDirection: "INCREASES_RISK",
        explanation: "Sunken railway subway geometry funnels road surface runoff into localized trough."
      },
      {
        id: "factor-rain-intensity",
        name: "Rainfall Intensity",
        value: "51.0 mm/h",
        contributionPct: 24,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Localized intense showers generate immediate flash ponding inside the underpass."
      },
      {
        id: "factor-drain-blockage",
        name: "Drainage Blockage & Siltation",
        value: "40% Screen Clog",
        contributionPct: 17,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Trash screens at subway pump intake partially blocked by roadside plastic debris."
      },
      {
        id: "factor-drain-capacity",
        name: "Drainage Capacity",
        value: "18,000 LPS (3/4 Pumps)",
        contributionPct: 12,
        severity: "WARNING",
        statusColor: "#ffaa00",
        impactDirection: "INCREASES_RISK",
        explanation: "3 submersible pumps active; Gazdarbandh outfall backpressure slowing discharge."
      },
      {
        id: "factor-rain-duration",
        name: "Rainfall Duration",
        value: "1h 15m",
        contributionPct: 8,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Moderate storm duration maintaining steady water inflow into subway floor."
      },
      {
        id: "factor-impervious",
        name: "Impervious Surface Fraction",
        value: "91% Paved Asphalt",
        contributionPct: 5,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Surrounding S.V. Road asphalt channels 95% runoff directly into subway portals."
      },
      {
        id: "factor-history",
        name: "Historical Flood Tendency",
        value: "12 Breaches / 5 Yrs",
        contributionPct: 3,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "INCREASES_RISK",
        explanation: "Frequent monsoon waterlogging history aligns with current hydraulic solver predictions."
      }
    ],

    hourlyNowcast: [
      { timeLabel: "Now (T+0)", offsetMin: 0, rainfallMmHr: 51.0, waterLevelM: 0.95, floodProbPct: 84 },
      { timeLabel: "T+30m", offsetMin: 30, rainfallMmHr: 58.0, waterLevelM: 1.15, floodProbPct: 90 },
      { timeLabel: "T+1h", offsetMin: 60, rainfallMmHr: 64.0, waterLevelM: 1.28, floodProbPct: 93 },
      { timeLabel: "T+1h 30m", offsetMin: 90, rainfallMmHr: 55.0, waterLevelM: 1.20, floodProbPct: 88 },
      { timeLabel: "T+2h", offsetMin: 120, rainfallMmHr: 38.0, waterLevelM: 0.90, floodProbPct: 75 },
      { timeLabel: "T+3h", offsetMin: 180, rainfallMmHr: 22.0, waterLevelM: 0.55, floodProbPct: 50 },
      { timeLabel: "T+4h", offsetMin: 240, rainfallMmHr: 14.0, waterLevelM: 0.25, floodProbPct: 25 },
      { timeLabel: "T+6h", offsetMin: 360, rainfallMmHr: 5.0, waterLevelM: 0.05, floodProbPct: 10 }
    ]
  },
  {
    id: "ZONE-PRED-SIO",
    name: "Sion Circle & Gandhi Market",
    wardCode: "F/North Ward",
    zoneCategory: "Arterial Road & Rail Trough",
    currentRainfall: 49.0,
    currentRainfallStr: "49.0 mm/h",
    floodProbability: 79,
    expectedTimeToFlooding: "T+25 mins",
    leadTimeToPeak: "50 mins",
    peakFloodArrival: "15:05 IST",
    estimatedWaterDepthM: 0.80,
    dangerThresholdM: 0.50,
    severity: "HIGH",
    predictionConfidence: 91,
    populationAtRisk: 51000,
    description: "Water on slow line tracks between Sion and Kurla reached 8 inches above rail level. Caution orders active.",
    
    xaiFactors: [
      {
        id: "factor-drain-blockage",
        name: "Drainage Blockage & Siltation",
        value: "45% Silt in Drain Culvert",
        contributionPct: 26,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Culvert under Central Railway tracks restricted by siltation and construction debris."
      },
      {
        id: "factor-rain-intensity",
        name: "Rainfall Intensity",
        value: "49.0 mm/h",
        contributionPct: 24,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Precipitation rate exceeds gravitational drainage velocity into Sion nullah."
      },
      {
        id: "factor-elevation",
        name: "Elevation & Topography",
        value: "2.8m AMSL",
        contributionPct: 18,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Depressed terrain between Sion Fort hill and Matunga slope pools surface water."
      },
      {
        id: "factor-rain-duration",
        name: "Rainfall Duration",
        value: "1h 30m",
        contributionPct: 14,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Continuous precipitation maintains water levels above rail head level."
      },
      {
        id: "factor-drain-capacity",
        name: "Drainage Capacity",
        value: "20,000 LPS (3/4 Pumps)",
        contributionPct: 9,
        severity: "WARNING",
        statusColor: "#ffaa00",
        impactDirection: "INCREASES_RISK",
        explanation: "Mobile dewatering pump deployed at Gandhi Market operating at 75% duty cycle."
      },
      {
        id: "factor-impervious",
        name: "Impervious Surface Fraction",
        value: "86% Asphalt & Rail Track",
        contributionPct: 6,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Impermeable track ballast and road surface accelerates stormwater concentration."
      },
      {
        id: "factor-history",
        name: "Historical Flood Tendency",
        value: "11 Inundations / 5 Yrs",
        contributionPct: 3,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "INCREASES_RISK",
        explanation: "Track waterlogging historically correlates with 45+ mm/h rainfall events."
      }
    ],

    hourlyNowcast: [
      { timeLabel: "Now (T+0)", offsetMin: 0, rainfallMmHr: 49.0, waterLevelM: 0.80, floodProbPct: 79 },
      { timeLabel: "T+30m", offsetMin: 30, rainfallMmHr: 56.0, waterLevelM: 0.98, floodProbPct: 86 },
      { timeLabel: "T+1h", offsetMin: 60, rainfallMmHr: 60.0, waterLevelM: 1.10, floodProbPct: 89 },
      { timeLabel: "T+1h 30m", offsetMin: 90, rainfallMmHr: 50.0, waterLevelM: 1.02, floodProbPct: 82 },
      { timeLabel: "T+2h", offsetMin: 120, rainfallMmHr: 35.0, waterLevelM: 0.75, floodProbPct: 68 },
      { timeLabel: "T+3h", offsetMin: 180, rainfallMmHr: 20.0, waterLevelM: 0.45, floodProbPct: 40 },
      { timeLabel: "T+4h", offsetMin: 240, rainfallMmHr: 10.0, waterLevelM: 0.18, floodProbPct: 20 },
      { timeLabel: "T+6h", offsetMin: 360, rainfallMmHr: 4.0, waterLevelM: 0.00, floodProbPct: 5 }
    ]
  },
  {
    id: "ZONE-PRED-AND",
    name: "Andheri Subway & Sahar",
    wardCode: "K/East Ward",
    zoneCategory: "Western Suburban Sump",
    currentRainfall: 46.2,
    currentRainfallStr: "46.2 mm/h",
    floodProbability: 62,
    expectedTimeToFlooding: "T+45 mins",
    leadTimeToPeak: "1h 10m",
    peakFloodArrival: "15:25 IST",
    estimatedWaterDepthM: 0.45,
    dangerThresholdM: 0.50,
    severity: "MODERATE",
    predictionConfidence: 89,
    populationAtRisk: 38000,
    description: "Moderate water accumulation in pedestrian underpass. Traffic police monitoring boom barriers.",
    
    xaiFactors: [
      {
        id: "factor-elevation",
        name: "Elevation & Topography",
        value: "Underpass Sump (-0.8m)",
        contributionPct: 27,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Road underpass collects stormwater from SV Road and Andheri station platform drains."
      },
      {
        id: "factor-rain-intensity",
        name: "Rainfall Intensity",
        value: "46.2 mm/h",
        contributionPct: 25,
        severity: "HIGH",
        statusColor: "#ff7700",
        impactDirection: "INCREASES_RISK",
        explanation: "Rainfall intensity approaching 50 mm/h threshold for subway closure."
      },
      {
        id: "factor-drain-blockage",
        name: "Drainage Blockage & Siltation",
        value: "30% Screen Silt",
        contributionPct: 16,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "INCREASES_RISK",
        explanation: "Moderate debris accumulation in Mogra nullah intake channel."
      },
      {
        id: "factor-drain-capacity",
        name: "Drainage Capacity",
        value: "16,000 LPS (3/3 Pumps)",
        contributionPct: 14,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "All 3 dewatering pumps running smoothly, actively evacuating subway inflow."
      },
      {
        id: "factor-rain-duration",
        name: "Rainfall Duration",
        value: "50 mins",
        contributionPct: 9,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Short duration shower reduces cumulative ponding risk."
      },
      {
        id: "factor-impervious",
        name: "Impervious Surface Fraction",
        value: "84% Paved",
        contributionPct: 6,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "MODERATE_RISK",
        explanation: "Standard suburban commercial asphalt density."
      },
      {
        id: "factor-history",
        name: "Historical Flood Tendency",
        value: "8 Inundations / 5 Yrs",
        contributionPct: 3,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Recent pump upgrades have improved drainage clearance times by 40%."
      }
    ],

    hourlyNowcast: [
      { timeLabel: "Now (T+0)", offsetMin: 0, rainfallMmHr: 46.2, waterLevelM: 0.45, floodProbPct: 62 },
      { timeLabel: "T+30m", offsetMin: 30, rainfallMmHr: 50.0, waterLevelM: 0.58, floodProbPct: 70 },
      { timeLabel: "T+1h", offsetMin: 60, rainfallMmHr: 44.0, waterLevelM: 0.52, floodProbPct: 65 },
      { timeLabel: "T+1h 30m", offsetMin: 90, rainfallMmHr: 30.0, waterLevelM: 0.38, floodProbPct: 48 },
      { timeLabel: "T+2h", offsetMin: 120, rainfallMmHr: 18.0, waterLevelM: 0.20, floodProbPct: 28 },
      { timeLabel: "T+3h", offsetMin: 180, rainfallMmHr: 10.0, waterLevelM: 0.08, floodProbPct: 12 },
      { timeLabel: "T+4h", offsetMin: 240, rainfallMmHr: 4.0, waterLevelM: 0.00, floodProbPct: 5 },
      { timeLabel: "T+6h", offsetMin: 360, rainfallMmHr: 2.0, waterLevelM: 0.00, floodProbPct: 0 }
    ]
  },
  {
    id: "ZONE-PRED-BKC",
    name: "Bandra-Kurla Complex (BKC)",
    wardCode: "H/East Ward",
    zoneCategory: "Channelized Commercial Hub",
    currentRainfall: 38.0,
    currentRainfallStr: "38.0 mm/h",
    floodProbability: 48,
    expectedTimeToFlooding: "T+1.2 hrs",
    leadTimeToPeak: "1h 45m",
    peakFloodArrival: "16:00 IST",
    estimatedWaterDepthM: 0.25,
    dangerThresholdM: 0.60,
    severity: "MODERATE",
    predictionConfidence: 94,
    populationAtRisk: 28000,
    description: "Vakola Nullah carrying heavy discharge but flowing within designed channel banks. No immediate road blockages.",
    
    xaiFactors: [
      {
        id: "factor-drain-capacity",
        name: "Drainage Capacity",
        value: "32,000 LPS (Engineered)",
        contributionPct: 28,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Modern channelized concrete storm drains provide high discharge velocity towards Mahim Creek."
      },
      {
        id: "factor-rain-intensity",
        name: "Rainfall Intensity",
        value: "38.0 mm/h",
        contributionPct: 24,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        impactDirection: "MODERATE_RISK",
        explanation: "Moderate precipitation within planned storm sewer design capacity."
      },
      {
        id: "factor-drain-blockage",
        name: "Drainage Blockage & Siltation",
        value: "20% Clean Channels",
        contributionPct: 18,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Recently desilted Vakola nullah cross-sections ensure smooth hydraulic gradient."
      },
      {
        id: "factor-elevation",
        name: "Elevation & Topography",
        value: "4.2m AMSL (Elevated Plinth)",
        contributionPct: 14,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Reclaimed plinth elevation prevents rapid tidal seawater backflow."
      },
      {
        id: "factor-rain-duration",
        name: "Rainfall Duration",
        value: "45 mins",
        contributionPct: 9,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Short duration showers allow continuous drainage evacuation."
      },
      {
        id: "factor-impervious",
        name: "Impervious Surface Fraction",
        value: "80% Paved",
        contributionPct: 5,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "MODERATE_RISK",
        explanation: "Extensive roadside catchbasins compensate for urban hard surfaces."
      },
      {
        id: "factor-history",
        name: "Historical Flood Tendency",
        value: "3 Inundations / 5 Yrs",
        contributionPct: 2,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Low historical frequency following Mithi widening project."
      }
    ],

    hourlyNowcast: [
      { timeLabel: "Now (T+0)", offsetMin: 0, rainfallMmHr: 38.0, waterLevelM: 0.25, floodProbPct: 48 },
      { timeLabel: "T+30m", offsetMin: 30, rainfallMmHr: 42.0, waterLevelM: 0.32, floodProbPct: 52 },
      { timeLabel: "T+1h", offsetMin: 60, rainfallMmHr: 35.0, waterLevelM: 0.28, floodProbPct: 45 },
      { timeLabel: "T+1h 30m", offsetMin: 90, rainfallMmHr: 22.0, waterLevelM: 0.18, floodProbPct: 30 },
      { timeLabel: "T+2h", offsetMin: 120, rainfallMmHr: 12.0, waterLevelM: 0.08, floodProbPct: 15 },
      { timeLabel: "T+3h", offsetMin: 180, rainfallMmHr: 5.0, waterLevelM: 0.00, floodProbPct: 5 },
      { timeLabel: "T+4h", offsetMin: 240, rainfallMmHr: 2.0, waterLevelM: 0.00, floodProbPct: 0 },
      { timeLabel: "T+6h", offsetMin: 360, rainfallMmHr: 0.0, waterLevelM: 0.00, floodProbPct: 0 }
    ]
  },
  {
    id: "ZONE-PRED-CHE",
    name: "Chembur Postal Colony",
    wardCode: "M/West Ward",
    zoneCategory: "Suburban Basin",
    currentRainfall: 28.5,
    currentRainfallStr: "28.5 mm/h",
    floodProbability: 28,
    expectedTimeToFlooding: "> 3 Hours (Safe Buffer)",
    leadTimeToPeak: "None",
    peakFloodArrival: "Safe Condition",
    estimatedWaterDepthM: 0.10,
    dangerThresholdM: 0.50,
    severity: "LOW",
    predictionConfidence: 96,
    populationAtRisk: 11000,
    description: "Storm drains operating normally with free gravitational discharge. No major water logging detected.",
    
    xaiFactors: [
      {
        id: "factor-drain-capacity",
        name: "Drainage Capacity",
        value: "15,000 LPS (Normal Flow)",
        contributionPct: 32,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Drainage network operating within 42% design capacity."
      },
      {
        id: "factor-rain-intensity",
        name: "Rainfall Intensity",
        value: "28.5 mm/h (Light-Mod)",
        contributionPct: 26,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Light to moderate rain showers fully absorbed by drainage outfalls."
      },
      {
        id: "factor-elevation",
        name: "Elevation & Topography",
        value: "6.5m AMSL (High Ground)",
        contributionPct: 18,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Elevated topography naturally accelerates gravity runoff into Trombay creek."
      },
      {
        id: "factor-drain-blockage",
        name: "Drainage Blockage & Siltation",
        value: "15% Clean Channels",
        contributionPct: 12,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Clean channels provide unimpeded hydraulic discharge."
      },
      {
        id: "factor-rain-duration",
        name: "Rainfall Duration",
        value: "30 mins",
        contributionPct: 6,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Short duration shower poses minimal accumulation threat."
      },
      {
        id: "factor-impervious",
        name: "Impervious Surface Fraction",
        value: "72% Residential",
        contributionPct: 4,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Residential gardens and soil patches provide partial natural percolation."
      },
      {
        id: "factor-history",
        name: "Historical Flood Tendency",
        value: "2 Inundations / 5 Yrs",
        contributionPct: 2,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Historically stable suburban catchment under sub-50 mm/h rain events."
      }
    ],

    hourlyNowcast: [
      { timeLabel: "Now (T+0)", offsetMin: 0, rainfallMmHr: 28.5, waterLevelM: 0.10, floodProbPct: 28 },
      { timeLabel: "T+30m", offsetMin: 30, rainfallMmHr: 25.0, waterLevelM: 0.12, floodProbPct: 25 },
      { timeLabel: "T+1h", offsetMin: 60, rainfallMmHr: 18.0, waterLevelM: 0.08, floodProbPct: 18 },
      { timeLabel: "T+1h 30m", offsetMin: 90, rainfallMmHr: 10.0, waterLevelM: 0.04, floodProbPct: 10 },
      { timeLabel: "T+2h", offsetMin: 120, rainfallMmHr: 5.0, waterLevelM: 0.00, floodProbPct: 5 },
      { timeLabel: "T+3h", offsetMin: 180, rainfallMmHr: 0.0, waterLevelM: 0.00, floodProbPct: 0 },
      { timeLabel: "T+4h", offsetMin: 240, rainfallMmHr: 0.0, waterLevelM: 0.00, floodProbPct: 0 },
      { timeLabel: "T+6h", offsetMin: 360, rainfallMmHr: 0.0, waterLevelM: 0.00, floodProbPct: 0 }
    ]
  },
  {
    id: "ZONE-PRED-COL",
    name: "Colaba & Marine Lines",
    wardCode: "A-Ward",
    zoneCategory: "Coastal Island City Outfall",
    currentRainfall: 22.0,
    currentRainfallStr: "22.0 mm/h",
    floodProbability: 12,
    expectedTimeToFlooding: "None (Zero Risk)",
    leadTimeToPeak: "None",
    peakFloodArrival: "Safe Condition",
    estimatedWaterDepthM: 0.00,
    dangerThresholdM: 0.60,
    severity: "LOW",
    predictionConfidence: 98,
    populationAtRisk: 0,
    description: "Direct deep-sea gravity outfalls completely clear with zero road waterlogging.",
    
    xaiFactors: [
      {
        id: "factor-drain-capacity",
        name: "Drainage Capacity",
        value: "28,000 LPS (Direct Outfall)",
        contributionPct: 35,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Short distance direct ocean outfalls provide maximum gravity runoff."
      },
      {
        id: "factor-rain-intensity",
        name: "Rainfall Intensity",
        value: "22.0 mm/h (Light)",
        contributionPct: 28,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Light coastal drizzle easily discharged through existing drains."
      },
      {
        id: "factor-elevation",
        name: "Elevation & Topography",
        value: "5.8m AMSL Coastal Ridge",
        contributionPct: 15,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Natural slope directs surface runoff directly into Arabian Sea."
      },
      {
        id: "factor-drain-blockage",
        name: "Drainage Blockage & Siltation",
        value: "10% Clear Drains",
        contributionPct: 10,
        severity: "SAFE",
        statusColor: "#10b981",
        impactDirection: "REDUCES_RISK",
        explanation: "Regularly maintained heritage storm drains free of major silt."
      },
      {
        id: "factor-rain-duration",
        name: "Rainfall Duration",
        value: "20 mins",
        contributionPct: 6,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Scattered passing coastal cloud band."
      },
      {
        id: "factor-impervious",
        name: "Impervious Surface Fraction",
        value: "85% Urban",
        contributionPct: 4,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "High density mitigated by large diameter coastal storm culverts."
      },
      {
        id: "factor-history",
        name: "Historical Flood Tendency",
        value: "0 Inundations / 5 Yrs",
        contributionPct: 2,
        severity: "LOW",
        statusColor: "#10b981",
        impactDirection: "LOW_RISK",
        explanation: "Zero inundation incidents recorded in past 5 monsoon cycles."
      }
    ],

    hourlyNowcast: [
      { timeLabel: "Now (T+0)", offsetMin: 0, rainfallMmHr: 22.0, waterLevelM: 0.00, floodProbPct: 12 },
      { timeLabel: "T+30m", offsetMin: 30, rainfallMmHr: 18.0, waterLevelM: 0.00, floodProbPct: 10 },
      { timeLabel: "T+1h", offsetMin: 60, rainfallMmHr: 12.0, waterLevelM: 0.00, floodProbPct: 5 },
      { timeLabel: "T+1h 30m", offsetMin: 90, rainfallMmHr: 5.0, waterLevelM: 0.00, floodProbPct: 2 },
      { timeLabel: "T+2h", offsetMin: 120, rainfallMmHr: 2.0, waterLevelM: 0.00, floodProbPct: 0 },
      { timeLabel: "T+3h", offsetMin: 180, rainfallMmHr: 0.0, waterLevelM: 0.00, floodProbPct: 0 },
      { timeLabel: "T+4h", offsetMin: 240, rainfallMmHr: 0.0, waterLevelM: 0.00, floodProbPct: 0 },
      { timeLabel: "T+6h", offsetMin: 360, rainfallMmHr: 0.0, waterLevelM: 0.00, floodProbPct: 0 }
    ]
  }
];
