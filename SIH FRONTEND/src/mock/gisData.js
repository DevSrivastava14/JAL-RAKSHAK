// =========================================================
// JALRAKSHAK - Modular GIS Data Layer (SIH26085)
// Replaceable with live GeoJSON / Municipal GIS REST APIs
// =========================================================

export const RISK_COLORS = {
  CRITICAL: '#ff334b', // Red
  HIGH: '#ff7700',     // Orange
  MODERATE: '#ffcc00', // Yellow
  LOW: '#10b981'       // Green
};

export const RISK_BG_COLORS = {
  CRITICAL: 'rgba(255, 51, 75, 0.28)',
  HIGH: 'rgba(255, 119, 0, 0.25)',
  MODERATE: 'rgba(255, 204, 0, 0.22)',
  LOW: 'rgba(16, 185, 129, 0.18)'
};

// 1. FLOOD RISK ZONES (Wards & Low-Lying Catchments)
export const FLOOD_RISK_ZONES = [
  {
    id: "ZONE-KUR-01",
    name: "Kurla West & Mithi Basin Zone",
    wardCode: "L-Ward",
    zoneCategory: "Riverine & Lowland Inundation",
    riskLevel: "CRITICAL",
    floodProbability: 96, // %
    expectedOnset: "Immediate (Active Overflow)",
    waterDepthM: 1.45,
    dangerMarkM: 1.00,
    drainageCapacityLPS: 24000,
    drainageBlockagePct: 65,
    affectedPopulation: 86000,
    criticalHotspots: ["Kranti Nagar", "Bail Bazar", "LBS Road Jn", "Chunabhatti"],
    evacuationStatus: "EVACUATION_IN_PROGRESS",
    description: "Mithi River water spilling over banks into residential settlements. Storm drains locked by high water surface elevation.",
    recommendedAction: "Evacuate ground floors to Kurla Municipal High School. Deploy 4 high-head dewatering pumps.",
    center: [19.0688, 72.8797],
    polygonCoords: [
      [19.0820, 72.8680],
      [19.0840, 72.8920],
      [19.0680, 72.8980],
      [19.0560, 72.8850],
      [19.0580, 72.8690]
    ]
  },
  {
    id: "ZONE-HIN-02",
    name: "Hindmata & Dadar TT Lowland",
    wardCode: "F/North Ward",
    zoneCategory: "Topographic Bowl & Tidal Lock",
    riskLevel: "CRITICAL",
    floodProbability: 92,
    expectedOnset: "Active Waterlogging",
    waterDepthM: 1.40,
    dangerMarkM: 0.80,
    drainageCapacityLPS: 36000,
    drainageBlockagePct: 50,
    affectedPopulation: 64000,
    criticalHotspots: ["Hindmata Underpass", "Dadar TT Circle", "Parel TT"],
    evacuationStatus: "TRAFFIC_DIVERTED",
    description: "Gravitational outfalls blocked by 3.82m sea tide. Britannia pumping station operating at 100% capacity.",
    recommendedAction: "Keep all 6 Britannia turbine pumps at maximum RPM. Divert traffic to Lalbaug flyover.",
    center: [19.0178, 72.8478],
    polygonCoords: [
      [19.0280, 72.8380],
      [19.0290, 72.8580],
      [19.0110, 72.8600],
      [19.0060, 72.8440],
      [19.0150, 72.8360]
    ]
  },
  {
    id: "ZONE-MIL-03",
    name: "Milan & Khar Subway Corridor",
    wardCode: "H/West Ward",
    zoneCategory: "Railway Underpass Dip",
    riskLevel: "HIGH",
    floodProbability: 84,
    expectedOnset: "T+15 mins",
    waterDepthM: 0.95,
    dangerMarkM: 0.50,
    drainageCapacityLPS: 18000,
    drainageBlockagePct: 40,
    affectedPopulation: 42000,
    criticalHotspots: ["Milan Subway", "S.V. Road Khar", "Gazdarbandh Nullah"],
    evacuationStatus: "BARRICADED",
    description: "Severe water accumulation inside subway underpass. Automatic boom barriers activated.",
    recommendedAction: "Operate Gazdarbandh outfall pumps. Maintain vehicular closure until depth < 0.3m.",
    center: [19.0833, 72.8398],
    polygonCoords: [
      [19.0940, 72.8310],
      [19.0950, 72.8480],
      [19.0760, 72.8510],
      [19.0730, 72.8340]
    ]
  },
  {
    id: "ZONE-SIO-04",
    name: "Sion Circle & Gandhi Market",
    wardCode: "F/North Ward",
    zoneCategory: "Arterial Road Sump",
    riskLevel: "HIGH",
    floodProbability: 79,
    expectedOnset: "T+25 mins",
    waterDepthM: 0.80,
    dangerMarkM: 0.50,
    drainageCapacityLPS: 20000,
    drainageBlockagePct: 45,
    affectedPopulation: 51000,
    criticalHotspots: ["Gandhi Market", "Sion Railway Station Track 2", "Sion Circle"],
    evacuationStatus: "MONITORING",
    description: "Waterlogging along Central Railway tracks and Dr. B.A. Road. Train speeds restricted to 20 kmph.",
    recommendedAction: "Deploy mobile trailer-mounted high-flow pumps to Gandhi Market drain sump.",
    center: [19.0400, 72.8600],
    polygonCoords: [
      [19.0490, 72.8510],
      [19.0510, 72.8710],
      [19.0320, 72.8720],
      [19.0300, 72.8530]
    ]
  },
  {
    id: "ZONE-AND-05",
    name: "Andheri East-West Subway",
    wardCode: "K/East Ward",
    zoneCategory: "Underpass Drainage Basin",
    riskLevel: "MODERATE",
    floodProbability: 62,
    expectedOnset: "T+45 mins",
    waterDepthM: 0.45,
    dangerMarkM: 0.50,
    drainageCapacityLPS: 16000,
    drainageBlockagePct: 30,
    affectedPopulation: 38000,
    criticalHotspots: ["Andheri Subway", "WEH Junction"],
    evacuationStatus: "WARNING_POSTED",
    description: "Moderate water ingress from surrounding elevated railway tracks. Auxiliary pump active.",
    recommendedAction: "Prepare boom barrier lockdown if precipitation rate exceeds 50 mm/hr.",
    center: [19.1197, 72.8464],
    polygonCoords: [
      [19.1310, 72.8360],
      [19.1320, 72.8580],
      [19.1110, 72.8600],
      [19.1090, 72.8380]
    ]
  },
  {
    id: "ZONE-BKC-06",
    name: "Bandra-Kurla Complex (BKC)",
    wardCode: "H/East Ward",
    zoneCategory: "Channelized Commercial Basin",
    riskLevel: "MODERATE",
    floodProbability: 48,
    expectedOnset: "T+1 hr",
    waterDepthM: 0.25,
    dangerMarkM: 0.60,
    drainageCapacityLPS: 32000,
    drainageBlockagePct: 20,
    affectedPopulation: 28000,
    criticalHotspots: ["Kalanagar Junction", "Vakola Outfall"],
    evacuationStatus: "CLEAR",
    description: "Vakola Nullah carrying high discharge but flowing smoothly. No major road blockages.",
    recommendedAction: "Monitor Vakola water level sensor SEN-FLW-01.",
    center: [19.0607, 72.8662],
    polygonCoords: [
      [19.0690, 72.8540],
      [19.0710, 72.8760],
      [19.0520, 72.8780],
      [19.0510, 72.8560]
    ]
  },
  {
    id: "ZONE-CHE-07",
    name: "Chembur Postal Colony",
    wardCode: "M/West Ward",
    zoneCategory: "Suburban Lowland",
    riskLevel: "LOW",
    floodProbability: 28,
    expectedOnset: "> 2 hrs",
    waterDepthM: 0.10,
    dangerMarkM: 0.50,
    drainageCapacityLPS: 15000,
    drainageBlockagePct: 15,
    affectedPopulation: 11000,
    criticalHotspots: ["Postal Colony Low Grounds"],
    evacuationStatus: "CLEAR",
    description: "Storm drainage network functioning smoothly. Minor curb puddling only.",
    recommendedAction: "Routine trash rack cleaning at collection culverts.",
    center: [19.0522, 72.8994],
    polygonCoords: [
      [19.0610, 72.8890],
      [19.0630, 72.9090],
      [19.0430, 72.9120],
      [19.0410, 72.8910]
    ]
  },
  {
    id: "ZONE-COL-08",
    name: "Colaba & Marine Lines",
    wardCode: "A-Ward",
    zoneCategory: "Coastal Island City",
    riskLevel: "LOW",
    floodProbability: 12,
    expectedOnset: "None",
    waterDepthM: 0.00,
    dangerMarkM: 0.60,
    drainageCapacityLPS: 28000,
    drainageBlockagePct: 10,
    affectedPopulation: 0,
    criticalHotspots: ["None"],
    evacuationStatus: "CLEAR",
    description: "Direct sea gravity outfalls functioning normally. No flood risk.",
    recommendedAction: "Maintain coastal watch for high tide surge.",
    center: [18.9067, 72.8147],
    polygonCoords: [
      [18.9300, 72.8050],
      [18.9350, 72.8300],
      [18.8950, 72.8350],
      [18.8900, 72.8100]
    ]
  }
];

// 2. MAJOR ROADS & ARTERIAL CORRIDORS
export const ROADS_DATA = [
  {
    id: "RD-LBS-01",
    name: "Lal Bahadur Shastri (LBS) Marg - Kurla",
    status: "SUBMERGED_CLOSED",
    statusLabel: "Submerged & Closed",
    riskLevel: "CRITICAL",
    waterDepthM: 1.25,
    speedLimitKmh: 0,
    trafficCondition: "Completely Closed",
    alternativeRoute: "Divert via Eastern Express Highway (EEH)",
    coordinates: [
      [19.0820, 72.8750],
      [19.0750, 72.8780],
      [19.0680, 72.8810],
      [19.0600, 72.8830]
    ]
  },
  {
    id: "RD-BAR-02",
    name: "Dr. Babasaheb Ambedkar Road - Hindmata",
    status: "SUBMERGED_CLOSED",
    statusLabel: "Submerged Underpass",
    riskLevel: "CRITICAL",
    waterDepthM: 1.40,
    speedLimitKmh: 0,
    trafficCondition: "Surface Road Closed (Flyover Open)",
    alternativeRoute: "Use Hindmata Flyover overhead lanes",
    coordinates: [
      [19.0280, 72.8460],
      [19.0220, 72.8470],
      [19.0160, 72.8480],
      [19.0100, 72.8490]
    ]
  },
  {
    id: "RD-SVR-03",
    name: "Swami Vivekanand (S.V.) Road - Khar / Milan",
    status: "WATERLOGGED_SLOW",
    statusLabel: "Waterlogged (Slow Moving)",
    riskLevel: "HIGH",
    waterDepthM: 0.65,
    speedLimitKmh: 15,
    trafficCondition: "Heavy Water Congestion",
    alternativeRoute: "Use Linking Road or Western Express Highway",
    coordinates: [
      [19.0920, 72.8380],
      [19.0850, 72.8390],
      [19.0780, 72.8410],
      [19.0710, 72.8420]
    ]
  },
  {
    id: "RD-WEH-04",
    name: "Western Express Highway (WEH) - Bandra to Andheri",
    status: "CLEAR_OPEN",
    statusLabel: "Clear & Operational",
    riskLevel: "LOW",
    waterDepthM: 0.05,
    speedLimitKmh: 60,
    trafficCondition: "Normal Monsoon Flow",
    alternativeRoute: "Primary North-South Emergency Corridor",
    coordinates: [
      [19.1200, 72.8520],
      [19.0950, 72.8540],
      [19.0700, 72.8560],
      [19.0550, 72.8530]
    ]
  },
  {
    id: "RD-EEH-05",
    name: "Eastern Express Highway (EEH) - Sion to Ghatkopar",
    status: "CLEAR_OPEN",
    statusLabel: "Clear & Operational",
    riskLevel: "LOW",
    waterDepthM: 0.08,
    speedLimitKmh: 60,
    trafficCondition: "Clear Emergency Route",
    alternativeRoute: "Primary Ambulance & Relief Route",
    coordinates: [
      [19.0880, 72.9050],
      [19.0680, 72.8900],
      [19.0480, 72.8750],
      [19.0380, 72.8650]
    ]
  }
];

// 3. DRAINAGE NODES & OUTFALLS
export const DRAINAGE_NODES = [
  {
    id: "DRN-MITHI-01",
    name: "Mithi River Main Outfall Trunk Junction",
    type: "TRUNK_OUTFALL",
    typeLabel: "Primary Riverine Outfall",
    lat: 19.0722,
    lng: 72.8750,
    ward: "Kurla West",
    capacityM3s: 120.0,
    currentFlowM3s: 114.5,
    blockagePct: 72,
    siltationLevelM: 1.80,
    waterLevelM: 3.42,
    status: "CHOKED",
    lastInspected: "Today, 08:30 IST",
    sensorId: "SEN-RAD-01",
    description: "Main stormwater discharge trunk for central suburbs. Heavy floating debris and high siltation blocking 72% cross-sectional area.",
    actionRequired: "Deploy amphibious hydraulic excavator for immediate trash clearing."
  },
  {
    id: "DRN-HIND-02",
    name: "Hindmata Storm Trunk Gravity Culvert",
    type: "CULVERT_JUNCTION",
    typeLabel: "Gravity Culvert Sump",
    lat: 19.0180,
    lng: 72.8485,
    ward: "Hindmata & Dadar",
    capacityM3s: 48.0,
    currentFlowM3s: 46.2,
    blockagePct: 52,
    siltationLevelM: 1.10,
    waterLevelM: 2.95,
    status: "CHOKED",
    lastInspected: "Today, 09:15 IST",
    sensorId: "SEN-RAD-02",
    description: "Gravity outflow obstructed by high tide sea level. Underground holding tank filling rapidly.",
    actionRequired: "Maintain Britannia pumping turbines at max RPM to bypass locked gravity flow."
  },
  {
    id: "DRN-VAK-03",
    name: "Vakola Nullah Drainage Channel",
    type: "CHANNEL_NODE",
    typeLabel: "Open Storm Channel",
    lat: 19.0640,
    lng: 72.8590,
    ward: "BKC / Vakola",
    capacityM3s: 65.0,
    currentFlowM3s: 42.8,
    blockagePct: 25,
    siltationLevelM: 0.45,
    waterLevelM: 1.65,
    status: "HIGH_LOAD",
    lastInspected: "Yesterday, 17:00 IST",
    sensorId: "SEN-FLW-01",
    description: "Flow velocity stable at 2.4 m/s. Discharging towards Mahim creek without major obstruction.",
    actionRequired: "Monitor telemetry SEN-FLW-01 for surge onset."
  },
  {
    id: "DRN-GAZ-04",
    name: "Gazdarbandh Tidal Outfall Box Drain",
    type: "TIDAL_OUTFALL",
    typeLabel: "Tidal Box Drain & Outfall",
    lat: 19.0790,
    lng: 72.8250,
    ward: "Khar Danda",
    capacityM3s: 55.0,
    currentFlowM3s: 48.0,
    blockagePct: 38,
    siltationLevelM: 0.85,
    waterLevelM: 2.75,
    status: "HIGH_LOAD",
    lastInspected: "Today, 07:00 IST",
    sensorId: "SEN-TID-01",
    description: "Sea tide flap gates engaged. Sump dewatering pumps operating at 83% load.",
    actionRequired: "Clear sea kelp and plastic debris from intake screens."
  },
  {
    id: "DRN-IRL-05",
    name: "Irla Nullah Storm Outfall Node",
    type: "TRUNK_OUTFALL",
    typeLabel: "Western Coast Trunk Outfall",
    lat: 19.1020,
    lng: 72.8280,
    ward: "Juhu / Irla",
    capacityM3s: 80.0,
    currentFlowM3s: 45.0,
    blockagePct: 18,
    siltationLevelM: 0.30,
    waterLevelM: 2.40,
    status: "NORMAL",
    lastInspected: "2 days ago",
    sensorId: "SEN-IRL-01",
    description: "Pumps running smoothly. Discharge flowing into Arabian Sea via Juhu outfall.",
    actionRequired: "Routine automated telemetry logging."
  }
];

// 4. CRITICAL HOSPITALS
export const HOSPITALS_DATA = [
  {
    id: "HOSP-SION-01",
    name: "Lokmanya Tilak Municipal General Hospital (Sion)",
    type: "TRAUMA_CENTER",
    typeLabel: "Apex Trauma Hospital",
    lat: 19.0360,
    lng: 72.8610,
    ward: "Sion (F/North)",
    totalBeds: 1400,
    icuBedsAvailable: 34,
    generatorBackup: "100% Operational (3x 1000kVA DG)",
    floodBarrierStatus: "DEPLOYED",
    accessRoadStatus: "AMBULANCE_ONLY",
    accessNotes: "Ground access road has 0.3m water. Special high-clearance ambulances routing via Sulochana Shetty Marg.",
    emergencyContact: "+91 22 2407 6381",
    floodSafeFloor: "Ground Floor Protected with Flood Barriers",
    riskLevel: "HIGH"
  },
  {
    id: "HOSP-KEM-02",
    name: "KEM Hospital & Seth G.S. Medical College",
    type: "SUPER_SPECIALTY",
    typeLabel: "Tertiary Referral Center",
    lat: 19.0020,
    lng: 72.8420,
    ward: "Parel (F/South)",
    totalBeds: 1800,
    icuBedsAvailable: 48,
    generatorBackup: "100% Operational (Dual Feed)",
    floodBarrierStatus: "SECURE",
    accessRoadStatus: "ACCESSIBLE",
    accessNotes: "Access clear via Acharya Donde Marg. Uninterrupted emergency intake.",
    emergencyContact: "+91 22 2410 7000",
    floodSafeFloor: "Elevated Plinth (Safe)",
    riskLevel: "MODERATE"
  },
  {
    id: "HOSP-KB-03",
    name: "Bhabha Hospital (Kurla)",
    type: "MUNICIPAL_GEN",
    typeLabel: "Municipal General Hospital",
    lat: 19.0650,
    lng: 72.8780,
    ward: "Kurla West (L-Ward)",
    totalBeds: 350,
    icuBedsAvailable: 12,
    generatorBackup: "Diesel GenSet Active",
    floodBarrierStatus: "AT_RISK",
    accessRoadStatus: "WATERLOGGED",
    accessNotes: "Water surrounding entrance compound (0.6m). NDRF dinghies assisting critical patient transfers.",
    emergencyContact: "+91 22 2503 5275",
    floodSafeFloor: "Patients moved to 1st & 2nd Floors",
    riskLevel: "CRITICAL"
  },
  {
    id: "HOSP-LIL-04",
    name: "Lilavati Hospital & Research Centre",
    type: "SUPER_SPECIALTY",
    typeLabel: "Super Specialty Hospital",
    lat: 19.0510,
    lng: 72.8290,
    ward: "Bandra West",
    totalBeds: 300,
    icuBedsAvailable: 22,
    generatorBackup: "Full Automatic Backup",
    floodBarrierStatus: "SECURE",
    accessRoadStatus: "ACCESSIBLE",
    accessNotes: "Clear approach road via Bandra Reclamation.",
    emergencyContact: "+91 22 2675 1000",
    floodSafeFloor: "High Elevation Secure",
    riskLevel: "LOW"
  }
];

// 5. SCHOOLS & EVACUATION CENTERS
export const SCHOOLS_DATA = [
  {
    id: "SCH-KUR-01",
    name: "Kurla Municipal High School & Relief Camp",
    type: "EVACUATION_CAMP",
    lat: 19.0715,
    lng: 72.8830,
    ward: "Kurla West",
    shelterCapacity: 2500,
    currentOccupancy: 1420,
    hasCleanWater: true,
    hasPowerBackup: true,
    medicalDeskActive: true,
    foodSupplyDays: 5,
    status: "OPEN_ACTIVE",
    statusLabel: "Open & Accepting Evacuees",
    contactPerson: "N. Deshmukh (Disaster Ward Officer)",
    phone: "+91 98201 44321",
    notes: "Accommodating displaced residents from Kranti Nagar and Bail Bazar slums."
  },
  {
    id: "SCH-SIO-02",
    name: "Sion Community High School Hall",
    type: "EVACUATION_CAMP",
    lat: 19.0380,
    lng: 72.8620,
    ward: "Sion Circle",
    shelterCapacity: 1800,
    currentOccupancy: 890,
    hasCleanWater: true,
    hasPowerBackup: true,
    medicalDeskActive: true,
    foodSupplyDays: 7,
    status: "OPEN_ACTIVE",
    statusLabel: "Open & Accepting Evacuees",
    contactPerson: "S. Kulkarni (Relief Incharge)",
    phone: "+91 98202 55678",
    notes: "Hot meals and dry rations distributed by civil defense teams."
  },
  {
    id: "SCH-DAD-03",
    name: "Dadar Youth Sports Complex Shelter",
    type: "EVACUATION_CAMP",
    lat: 19.0230,
    lng: 72.8410,
    ward: "Dadar West",
    shelterCapacity: 3200,
    currentOccupancy: 1110,
    hasCleanWater: true,
    hasPowerBackup: true,
    medicalDeskActive: true,
    foodSupplyDays: 6,
    status: "OPEN_ACTIVE",
    statusLabel: "Open & Accepting Evacuees",
    contactPerson: "Dr. A. Patil (Chief Medical Officer)",
    phone: "+91 98203 66789",
    notes: "Equipped with temporary bedding, emergency clinic, and mobile charging stations."
  },
  {
    id: "SCH-SAN-04",
    name: "Santacruz Central School & Relief Hub",
    type: "EVACUATION_CAMP",
    lat: 19.0850,
    lng: 72.8480,
    ward: "Santacruz East",
    shelterCapacity: 2000,
    currentOccupancy: 640,
    hasCleanWater: true,
    hasPowerBackup: true,
    medicalDeskActive: false,
    foodSupplyDays: 4,
    status: "OPEN_ACTIVE",
    statusLabel: "Open & Accepting Evacuees",
    contactPerson: "V. Sharma (Relief Officer)",
    phone: "+91 98204 77890",
    notes: "Designated overflow shelter for Milan and Khar subway vicinity."
  }
];

// 6. POLICE, FIRE & DISASTER STATIONS
export const EMERGENCY_STATIONS_DATA = [
  {
    id: "EMG-NDRF-01",
    name: "NDRF Battalion 04 - Urban Search & Rescue",
    type: "NDRF_BASE",
    typeLabel: "National Disaster Response Force",
    lat: 19.0760,
    lng: 72.8700,
    ward: "Kurla / BKC Base",
    boatsAvailable: 16,
    rescueTeamsActive: 6,
    vehiclesDeployed: 12,
    status: "DEPLOYED",
    statusLabel: "Active Search & Rescue Deployed",
    contactNumber: "1077 / +91 22 2503 9999",
    activeMissions: "Inundated slum evacuations along Mithi riverbanks using motorized inflatable dinghies."
  },
  {
    id: "EMG-FIRE-02",
    name: "Dadar Fire Brigade & Water Rescue Hub",
    type: "FIRE_STATION",
    typeLabel: "Municipal Fire Brigade",
    lat: 19.0200,
    lng: 72.8430,
    ward: "Dadar (F/South)",
    boatsAvailable: 6,
    rescueTeamsActive: 4,
    vehiclesDeployed: 8,
    status: "DEPLOYED",
    statusLabel: "Active Pumping & Rescue",
    contactNumber: "101 / +91 22 2413 5555",
    activeMissions: "Submersible pump deployment at Hindmata underpass; tree fall clearance."
  },
  {
    id: "EMG-POL-03",
    name: "Kurla Police Station & Flood Control Cell",
    type: "POLICE_HQ",
    typeLabel: "Police Disaster Unit",
    lat: 19.0660,
    lng: 72.8800,
    ward: "Kurla West",
    boatsAvailable: 4,
    rescueTeamsActive: 5,
    vehiclesDeployed: 10,
    status: "DEPLOYED",
    statusLabel: "Traffic Diversion & Law & Order",
    contactNumber: "100 / +91 22 2503 1111",
    activeMissions: "Enforcing road barricades on LBS Marg and assisting door-to-door siren warnings."
  },
  {
    id: "EMG-POL-04",
    name: "Bandra Traffic Control Center",
    type: "POLICE_HQ",
    typeLabel: "Traffic Police Headquarters",
    lat: 19.0580,
    lng: 72.8400,
    ward: "Bandra West",
    boatsAvailable: 0,
    rescueTeamsActive: 3,
    vehiclesDeployed: 14,
    status: "STANDBY",
    statusLabel: "Corridor Monitoring & Signal Overrides",
    contactNumber: "+91 22 2493 7755",
    activeMissions: "Green corridor management for emergency medical ambulances between Sion and KEM."
  }
];

// Helper Functions
export function getFeatureRiskColor(riskLevel) {
  return RISK_COLORS[riskLevel] || '#00b4d8';
}

export function getFeatureRiskBg(riskLevel) {
  return RISK_BG_COLORS[riskLevel] || 'rgba(0, 180, 216, 0.2)';
}
