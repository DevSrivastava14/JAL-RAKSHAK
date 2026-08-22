// =========================================================
// JALRAKSHAK - Modular Alerts & Early Warning Dataset
// SIH26085 Urban Flood Command Center
// Replaceable with live CAP / municipal alert REST APIs
// =========================================================

export const INITIAL_ALERTS_DATA = [
  {
    id: "ALT-MUM-01",
    capCode: "CAP-IN-MH-MUM-2026-0891",
    title: "Mithi River Bank Breached - Immediate Evacuation Triggered",
    location: "Kurla West & Mithi River Basin",
    wardCode: "L-Ward",
    alertType: "River Overflow",
    severity: "CRITICAL", // CRITICAL, HIGH, MODERATE, ADVISORY
    status: "Active",     // Active, Dispatched, Monitoring, Acknowledged
    rainfallMmHr: 68.0,
    rainfallStr: "68.0 mm/h",
    floodProbability: 96,
    expectedImpactTime: "Immediate (Active Overflow)",
    leadTimeToPeak: "38 mins",
    waterDepthM: 1.45,
    dangerThresholdM: 1.00,
    aiConfidence: 97,
    affectedPopulation: 86000,
    timestamp: "12 mins ago",
    reportedAt: "Today, 14:18 IST",
    source: "JALRAKSHAK AI Nowcasting Engine & Gauge SEN-RAD-01",
    description: "Mithi River water surface level has crossed the danger mark (3.00m at 3.42m). Floodwater is breaching river retaining walls near Kranti Nagar and Bail Bazar. Immediate ground floor evacuation is active.",
    
    // "Why this alert was triggered" - 5 Key Factors with visual weights
    triggerFactors: [
      {
        id: "fac-rain-intensity",
        name: "Rainfall Intensity",
        measuredValue: "68.0 mm/h",
        contributionPct: 32,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        explanation: "Extreme convective cloudburst rate exceeds local stormwater conduit capacity by 240%."
      },
      {
        id: "fac-river-level",
        name: "River Water Level Surcharge",
        measuredValue: "3.42m (Danger: 3.00m)",
        contributionPct: 24,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        explanation: "Ultrasonic radar gauge detected continuous water level rise at +0.18 m/hr."
      },
      {
        id: "fac-drain-blockage",
        name: "Drainage Blockage & Siltation",
        measuredValue: "65% Choked / Silted",
        contributionPct: 20,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        explanation: "Heavy plastic and silt deposits restrict gravity outflow into Mahim Bay estuary."
      },
      {
        id: "fac-elevation",
        name: "Elevation & Topography",
        value: "2.4m AMSL (Depression)",
        contributionPct: 14,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Low-lying topographic depression acts as a natural catchment basin for surrounding slopes."
      },
      {
        id: "fac-history",
        name: "Historical Flood Tendency",
        value: "14 Inundations / 5 Yrs",
        contributionPct: 10,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        explanation: "High historical vulnerability weight reinforces rapid trigger threshold."
      }
    ],

    recommendedActions: [
      "Evacuate ground floor occupants of Kranti Nagar and Bail Bazar to Kurla Municipal School Camp",
      "Deploy 4 additional 6,000 LPS high-head submersible dewatering pumps to LBS Road",
      "Barricade LBS Marg between Kurla Station and Chunabhatti for all vehicular traffic",
      "Dispatch NDRF Battalion 04 inflatable rescue boats to Mithi riverbanks"
    ]
  },
  {
    id: "ALT-MUM-02",
    capCode: "CAP-IN-MH-MUM-2026-0890",
    title: "Hindmata Stormwater Gravity Outfall Locked by High Tide",
    location: "Hindmata & Dadar TT Lowland",
    wardCode: "F/North Ward",
    alertType: "Tidal Lock & Sump Overflow",
    severity: "CRITICAL",
    status: "Active",
    rainfallMmHr: 54.5,
    rainfallStr: "54.5 mm/h",
    floodProbability: 92,
    expectedImpactTime: "Active Waterlogging",
    leadTimeToPeak: "25 mins",
    waterDepthM: 1.40,
    dangerThresholdM: 0.80,
    aiConfidence: 95,
    affectedPopulation: 64000,
    timestamp: "24 mins ago",
    reportedAt: "Today, 14:06 IST",
    source: "Coastal Sluice SCADA Telemetry & Sensor SEN-RAD-02",
    description: "Sea tide level at Mahim/Worli outfall has reached 3.82m CD, preventing gravitational discharge. Britannia pumping station running 6/6 heavy turbine pumps. Inundation depth at Hindmata junction reached 1.40m.",
    
    triggerFactors: [
      {
        id: "fac-tide-lock",
        name: "River & Sea Tide Level",
        measuredValue: "3.82m Coastal Tide",
        contributionPct: 34,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        explanation: "Tidal backpressure completely blocks gravity drains, causing stormwater backflow."
      },
      {
        id: "fac-elevation",
        name: "Elevation & Topography",
        measuredValue: "1.8m AMSL (Deep Basin)",
        contributionPct: 26,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        explanation: "Lowest topographical depression in south-central Mumbai, collecting runoff from Parel and Dadar."
      },
      {
        id: "fac-rain-intensity",
        name: "Rainfall Intensity",
        measuredValue: "54.5 mm/h",
        contributionPct: 20,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Intense sustained downpour exceeds underground retention tank inflow capacity."
      },
      {
        id: "fac-drain-capacity",
        name: "Drainage Capacity",
        measuredValue: "36,000 LPS (Max Duty)",
        contributionPct: 12,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Britannia pumping station operating at 100% capacity; holding tank 78% filled."
      },
      {
        id: "fac-history",
        name: "Historical Flood Tendency",
        measuredValue: "18 Breaches / 5 Yrs",
        contributionPct: 8,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        explanation: "Chronic annual flood hotspot; model relies heavily on historical tidal correlation."
      }
    ],

    recommendedActions: [
      "Keep all 6 Britannia de-watering turbines at maximum continuous RPM",
      "Divert South-bound Dr. B.A. Road vehicular traffic onto Lalbaug flyover overhead lanes",
      "Inspect Pramod Mahajan Kala Kendra holding tank retention buffer",
      "Deploy traffic marshals to prevent light motor vehicles entering underpass"
    ]
  },
  {
    id: "ALT-MUM-03",
    capCode: "CAP-IN-MH-MUM-2026-0889",
    title: "Milan Subway Waterlogging Danger - Level Rising at +0.20m/hr",
    location: "Milan & Khar Subway Corridor",
    wardCode: "H/West Ward",
    alertType: "Subway Flash Flood",
    severity: "HIGH",
    status: "Dispatched",
    rainfallMmHr: 51.0,
    rainfallStr: "51.0 mm/h",
    floodProbability: 84,
    expectedImpactTime: "T+15 mins",
    leadTimeToPeak: "45 mins",
    waterDepthM: 0.95,
    dangerThresholdM: 0.50,
    aiConfidence: 93,
    affectedPopulation: 42000,
    timestamp: "45 mins ago",
    reportedAt: "Today, 13:45 IST",
    source: "Computer Vision Optical Depth Camera SEN-RAD-03",
    description: "Optical depth gauge detected water accumulation reaching 0.95m inside Milan subway. Automatic boom barriers activated for light vehicles. 3 of 4 dewatering pumps operating.",
    
    triggerFactors: [
      {
        id: "fac-elevation",
        name: "Elevation & Underpass Dip",
        measuredValue: "Sunken Dip (-1.2m)",
        contributionPct: 30,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        explanation: "Subway underpass geometry funnels runoff from S.V. Road and railway tracks directly to floor."
      },
      {
        id: "fac-rain-intensity",
        name: "Rainfall Intensity",
        measuredValue: "51.0 mm/h",
        contributionPct: 26,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Intense localized cloud shower produces rapid surface water pooling."
      },
      {
        id: "fac-drain-blockage",
        name: "Drainage Blockage & Siltation",
        measuredValue: "40% Screen Silt",
        contributionPct: 20,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Intake trash screens partially choked by street plastic debris."
      },
      {
        id: "fac-drain-capacity",
        name: "Drainage Capacity",
        measuredValue: "18,000 LPS (3/4 Active)",
        contributionPct: 14,
        severity: "WARNING",
        statusColor: "#ffaa00",
        explanation: "Gazdarbandh outfall backpressure reduces net discharge velocity."
      },
      {
        id: "fac-history",
        name: "Historical Flood Tendency",
        measuredValue: "12 Breaches / 5 Yrs",
        contributionPct: 10,
        severity: "LOW",
        statusColor: "#10b981",
        explanation: "Frequent monsoon waterlogging history matches current predictive runoff curves."
      }
    ],

    recommendedActions: [
      "Ensure automatic boom barriers remain locked at subway portals",
      "Inspect Gazdarbandh outfall pump screens for debris clearing",
      "Broadcast alternate route advisories via Western Railway FM & Traffic Police Feed"
    ]
  },
  {
    id: "ALT-MUM-04",
    capCode: "CAP-IN-MH-MUM-2026-0888",
    title: "Central Railway Sion-Kurla Track Submersion Warning",
    location: "Sion Circle & Gandhi Market",
    wardCode: "F/North Ward",
    alertType: "Railway Track Inundation",
    severity: "HIGH",
    status: "Monitoring",
    rainfallMmHr: 49.0,
    rainfallStr: "49.0 mm/h",
    floodProbability: 79,
    expectedImpactTime: "T+25 mins",
    leadTimeToPeak: "50 mins",
    waterDepthM: 0.80,
    dangerThresholdM: 0.50,
    aiConfidence: 91,
    affectedPopulation: 51000,
    timestamp: "1 hour ago",
    reportedAt: "Today, 13:30 IST",
    source: "IoT Ultrasonic Track Water Level Network",
    description: "Water on slow line tracks between Sion and Kurla reached 8 inches above rail level. Train speed restricted to 20 kmph. High capacity trailer pump active at Gandhi Market.",
    
    triggerFactors: [
      {
        id: "fac-drain-blockage",
        name: "Drainage Blockage & Culverts",
        measuredValue: "45% Silt in Rail Culvert",
        contributionPct: 28,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Under-track stormwater culvert restricted by siltation and construction material."
      },
      {
        id: "fac-rain-intensity",
        name: "Rainfall Intensity",
        measuredValue: "49.0 mm/h",
        contributionPct: 25,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "High precipitation rate exceeds natural slope drainage into Sion Nullah."
      },
      {
        id: "fac-elevation",
        name: "Elevation & Topography",
        measuredValue: "2.8m AMSL",
        contributionPct: 20,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Depressed terrain between Sion Fort hill and Matunga slope pools stormwater."
      },
      {
        id: "fac-drain-capacity",
        name: "Drainage Capacity",
        measuredValue: "20,000 LPS (3/4 Active)",
        contributionPct: 17,
        severity: "WARNING",
        statusColor: "#ffaa00",
        explanation: "Mobile pump operating at Gandhi Market maintaining buffer against rail level."
      },
      {
        id: "fac-history",
        name: "Historical Flood Tendency",
        measuredValue: "11 Breaches / 5 Yrs",
        contributionPct: 10,
        severity: "LOW",
        statusColor: "#10b981",
        explanation: "Track waterlogging historically triggers when rainfall exceeds 45 mm/hr."
      }
    ],

    recommendedActions: [
      "Maintain 20 kmph train caution order between Sion and Kurla",
      "Switch train operations to fast corridor if depth exceeds 10 inches",
      "Deploy auxiliary diesel dewatering unit to Gandhi Market culvert intake"
    ]
  },
  {
    id: "ALT-MUM-05",
    capCode: "CAP-IN-MH-MUM-2026-0887",
    title: "Andheri Subway Flash Water Accumulation Advisory",
    location: "Andheri Subway & Sahar",
    wardCode: "K/East Ward",
    alertType: "Subway Waterlogging",
    severity: "MODERATE",
    status: "Monitoring",
    rainfallMmHr: 46.2,
    rainfallStr: "46.2 mm/h",
    floodProbability: 62,
    expectedImpactTime: "T+45 mins",
    leadTimeToPeak: "1h 10m",
    waterDepthM: 0.45,
    dangerThresholdM: 0.50,
    aiConfidence: 89,
    affectedPopulation: 38000,
    timestamp: "1.5 hours ago",
    reportedAt: "Today, 13:00 IST",
    source: "Automated Weather Station SEN-AWS-02",
    description: "Moderate water accumulation in pedestrian underpass. Traffic police monitoring water gauges. All 3 dewatering pumps running normally.",
    
    triggerFactors: [
      {
        id: "fac-elevation",
        name: "Elevation & Topography",
        measuredValue: "Underpass Sump (-0.8m)",
        contributionPct: 28,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Sunken underpass roadway gathers water from SV Road and station platforms."
      },
      {
        id: "fac-rain-intensity",
        name: "Rainfall Intensity",
        measuredValue: "46.2 mm/h",
        contributionPct: 26,
        severity: "HIGH",
        statusColor: "#ff7700",
        explanation: "Rainfall intensity approaching the 50 mm/h threshold for subway barricading."
      },
      {
        id: "fac-drain-blockage",
        name: "Drainage Blockage & Siltation",
        measuredValue: "30% Screen Silt",
        contributionPct: 22,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        explanation: "Moderate debris accumulation in Mogra nullah intake channel."
      },
      {
        id: "fac-drain-capacity",
        name: "Drainage Capacity",
        measuredValue: "16,000 LPS (3/3 Pumps)",
        contributionPct: 14,
        severity: "SAFE",
        statusColor: "#10b981",
        explanation: "All 3 dewatering pumps operating smoothly, keeping depth below 0.5m."
      },
      {
        id: "fac-history",
        name: "Historical Flood Tendency",
        measuredValue: "8 Breaches / 5 Yrs",
        contributionPct: 10,
        severity: "LOW",
        statusColor: "#10b981",
        explanation: "Recent pump station upgrade has significantly reduced drainage clearance latency."
      }
    ],

    recommendedActions: [
      "Monitor optical depth camera SEN-RAD-03 for surge",
      "Prepare automatic boom barriers for deployment if precipitation exceeds 50 mm/hr",
      "Station traffic wardens at Andheri East and West approaches"
    ]
  },
  {
    id: "ALT-MUM-06",
    capCode: "CAP-IN-MH-MUM-2026-0886",
    title: "Scheduled Peak High Tide of 4.54m at 14:45 IST",
    location: "Mahim & Coastal Sluice Outfalls",
    wardCode: "All Coastal Wards",
    alertType: "High Tide Surge Warning",
    severity: "ADVISORY",
    status: "Acknowledged",
    rainfallMmHr: 38.0,
    rainfallStr: "38.0 mm/h",
    floodProbability: 45,
    expectedImpactTime: "T+4 hours",
    leadTimeToPeak: "4 hours",
    waterDepthM: 0.25,
    dangerThresholdM: 0.60,
    aiConfidence: 96,
    affectedPopulation: 120000,
    timestamp: "2 hours ago",
    reportedAt: "Today, 12:30 IST",
    source: "INCOIS Ocean Hydrodynamic Model",
    description: "Spring tide coupled with active monsoon downpour may cause backpressure in Mahim, Worli, and Lovegrove outfalls. All 42 pumping units placed on warm standby.",
    
    triggerFactors: [
      {
        id: "fac-tide-height",
        name: "River & Sea Tide Level",
        measuredValue: "4.54m Peak Spring Tide",
        contributionPct: 42,
        severity: "CRITICAL",
        statusColor: "#ff334b",
        explanation: "High tide elevation creates positive pressure differential against coastal flap gates."
      },
      {
        id: "fac-rain-intensity",
        name: "Rainfall Intensity",
        measuredValue: "38.0 mm/h",
        contributionPct: 24,
        severity: "MODERATE",
        statusColor: "#ffcc00",
        explanation: "Moderate citywide rain rate requiring continuous pumping during high tide."
      },
      {
        id: "fac-drain-capacity",
        name: "Drainage Capacity",
        measuredValue: "184,000 LPS (38/42 Pumps)",
        contributionPct: 18,
        severity: "SAFE",
        statusColor: "#10b981",
        explanation: "Heavy pumping stations placed on full standby to bypass tidal gates."
      },
      {
        id: "fac-elevation",
        name: "Elevation & Topography",
        measuredValue: "Sea Level Boundary",
        contributionPct: 10,
        severity: "LOW",
        statusColor: "#10b981",
        explanation: "Coastal seawalls protect direct overtopping under normal surge conditions."
      },
      {
        id: "fac-history",
        name: "Historical Flood Tendency",
        measuredValue: "6 Inundations / 5 Yrs",
        contributionPct: 6,
        severity: "LOW",
        statusColor: "#10b981",
        explanation: "High tide combined with >50 mm/h rainfall historically causes low-lying inundation."
      }
    ],

    recommendedActions: [
      "Deploy beach marshals and disaster response vans along Marine Drive, Dadar, and Juhu",
      "Ensure auxiliary diesel generators fueled for 24-hour continuous runtime",
      "Close automated sluice gates during maximum tide crest window"
    ]
  }
];
