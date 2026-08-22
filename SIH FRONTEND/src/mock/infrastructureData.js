// =========================================================
// JALRAKSHAK - Modular Infrastructure Impact Dataset
// SIH26085 Critical Urban Asset Monitoring & Exposure Assessment
// Replaceable with live GIS / Municipal Asset REST APIs
// =========================================================

export const INFRASTRUCTURE_ASSETS = [
  {
    id: "INF-TRN-01",
    name: "Kurla Railway Station (Central & Harbour)",
    category: "Transit Lifeline",
    categoryType: "TRANSIT",
    location: "Kurla West (L-Ward)",
    nearbyFloodZone: "Kurla West & Mithi River Basin Zone",
    currentFloodRisk: "CRITICAL",
    impactSeverity: "CRITICAL",
    operationalStatus: "Service Restricted",
    operationalStatusType: "RESTRICTED",
    estimatedWaterDepthM: 0.85,
    safeThresholdM: 0.20,
    dailyUsersAffected: 380000,
    operator: "Central Railway Mumbai Division",
    contactDesk: "+91 22 2503 2345 / Disaster Cell",
    
    // 4 Visual Risk Indicator Dimensions (0-100 scale)
    riskDimensions: {
      accessDisruption: 90,     // 90% blocked (LBS road waterlogged)
      structuralExposure: 75,   // 75% track ballast submerged
      utilityDisruption: 65,    // 65% signaling track circuits submerged
      emergencyImportance: 98   // Vital lifeline
    },

    estimatedDisruption: "Slow line tracks between Kurla and Chunabhatti submerged under 8 inches of water. Train movements restricted to fast lines at 20 kmph caution speed. Harbour line platform 1 waterlogged.",
    recommendedResponse: [
      "Switch train operations from slow to fast corridor through Kurla junction",
      "Deploy 2 auxiliary 5000 LPS trailer-mounted pumps at platform 1 sump",
      "Announce suburban passenger diversions via Ghatkopar Metro Line 1",
      "Deploy Railway Protection Force (RPF) to guide commuters away from waterlogged tracks"
    ]
  },
  {
    id: "INF-HOSP-01",
    name: "Lokmanya Tilak Municipal Hospital (Sion Hospital)",
    category: "Critical Healthcare",
    categoryType: "HEALTHCARE",
    location: "Sion West (F/North Ward)",
    nearbyFloodZone: "Sion Circle & Gandhi Market Basin",
    currentFloodRisk: "CRITICAL",
    impactSeverity: "CRITICAL",
    operationalStatus: "Barrier Deployed (Ambulances Only)",
    operationalStatusType: "RESTRICTED",
    estimatedWaterDepthM: 0.45,
    safeThresholdM: 0.15,
    dailyUsersAffected: 12000,
    operator: "Brihanmumbai Municipal Corporation (BMC)",
    contactDesk: "+91 22 2407 6381 / Casualty Wing",

    riskDimensions: {
      accessDisruption: 85,     // Access road waterlogged
      structuralExposure: 40,   // Flood barriers holding ground floor
      utilityDisruption: 30,    // Dual DG backup active
      emergencyImportance: 100  // Tier 1 Apex Trauma Center
    },

    estimatedDisruption: "Ground approach road (Sulochana Shetty Marg) has 0.45m standing water. Standard private vehicles and light taxis barred. Only high-clearance ambulances able to reach trauma casualty ward.",
    recommendedResponse: [
      "Maintain active deployment of pneumatic flood barriers at emergency entrance",
      "Station specialized disaster relief ambulances at Sion Circle interchange",
      "Ensure 3x 1000kVA backup diesel generators have 48-hour continuous fuel reserve",
      "Prepare upper floor expansion wards for patient transfer if water exceeds 0.6m"
    ]
  },
  {
    id: "INF-SUB-01",
    name: "Milan Subway Corridor",
    category: "Road Underpass",
    categoryType: "ROAD_NETWORK",
    location: "Santacruz - Khar (H/West Ward)",
    nearbyFloodZone: "Milan & Khar Subway Corridor",
    currentFloodRisk: "CRITICAL",
    impactSeverity: "CRITICAL",
    operationalStatus: "Barricaded / Closed",
    operationalStatusType: "CLOSED",
    estimatedWaterDepthM: 0.95,
    safeThresholdM: 0.25,
    dailyUsersAffected: 75000,
    operator: "Traffic Police & Municipal Roads Dept",
    contactDesk: "Traffic Control: 103 / +91 22 2493 7755",

    riskDimensions: {
      accessDisruption: 100,    // Completely closed
      structuralExposure: 85,   // Underpass submerged to 0.95m
      utilityDisruption: 50,    // Subway lighting and pumps on GenSet
      emergencyImportance: 80   // Major arterial east-west connector
    },

    estimatedDisruption: "Vehicular underpass closed due to 0.95m deep water accumulation. Traffic diverted entirely to overhead Milan flyover bridge and S.V. Road junction.",
    recommendedResponse: [
      "Lock automatic boom barriers at both east and west portals",
      "Run all 3 Gazdarbandh outfall dewatering pumps at 100% duty cycle",
      "Broadcast alternate route advisories via Western Railway FM radio",
      "Inspect intake trash racks for floating plastic debris removal"
    ]
  },
  {
    id: "INF-POW-01",
    name: "Kurla 33kV Electrical Distribution Substation",
    category: "Power Grid Utility",
    categoryType: "UTILITY",
    location: "Kurla East / Nehru Nagar",
    nearbyFloodZone: "Kurla West & Mithi River Basin Zone",
    currentFloodRisk: "CRITICAL",
    impactSeverity: "CRITICAL",
    operationalStatus: "GenSet Backup Engaged",
    operationalStatusType: "RESTRICTED",
    estimatedWaterDepthM: 0.55,
    safeThresholdM: 0.30,
    dailyUsersAffected: 145000,
    operator: "Tata Power / Adani Electricity",
    contactDesk: "+91 22 6665 1912 / Grid Ops",

    riskDimensions: {
      accessDisruption: 70,     // Surrounding lanes submerged
      structuralExposure: 80,   // Perimeter flood wall near breach limit
      utilityDisruption: 75,    // 2 Feeder lines isolated as precautionary measure
      emergencyImportance: 95   // Powers Kurla Hospital and Railway Traction
    },

    estimatedDisruption: "Water depth around transformer yard reached 0.55m. Two feeder lines isolated to prevent short-circuiting. Auxiliary diesel generators supplying essential power to railway traction and Bhabha Hospital.",
    recommendedResponse: [
      "Deploy sandbag perimeter around main 33kV switchgear room",
      "Operate submersible sump pumps to drain transformer yard foundation",
      "Coordinate with Tata Power grid desk for feeder load-shedding protocol",
      "Maintain 24/7 electrical emergency team on site"
    ]
  },
  {
    id: "INF-PUMP-01",
    name: "Britannia Stormwater Pumping Station",
    category: "Drainage Facility",
    categoryType: "DRAINAGE",
    location: "Reay Road / Britannia Jn (F/South)",
    nearbyFloodZone: "Hindmata & Dadar TT Lowland",
    currentFloodRisk: "HIGH",
    impactSeverity: "HIGH",
    operationalStatus: "Operational Max (6/6 Turbines)",
    operationalStatusType: "OPERATIONAL",
    estimatedWaterDepthM: 1.10,
    safeThresholdM: 1.50,
    dailyUsersAffected: 250000,
    operator: "Storm Water Drains (SWD) Department, BMC",
    contactDesk: "+91 22 2371 4422 / Chief Engineer SWD",

    riskDimensions: {
      accessDisruption: 40,     // Surrounding road waterlogged
      structuralExposure: 60,   // Heavy inflow surging into intake sump
      utilityDisruption: 20,    // Dual grid feed + 1500kVA DG running
      emergencyImportance: 96   // Vital drainage lifeline for South Central
    },

    estimatedDisruption: "Intake culvert receiving 35,200 LPS stormwater inflow from Hindmata and Lalbaug. Gravity outfall locked by 3.82m sea tide. All 6 heavy turbines discharging at peak capacity into Mumbai harbour.",
    recommendedResponse: [
      "Keep all 6 turbine units running at maximum RPM without interruption",
      "Monitor intake screen siltation levels every 30 minutes",
      "Ensure diesel fuel tanks filled for continuous 48-hour operation",
      "Coordinate with Haji Ali and Lovegrove stations for load balance"
    ]
  },
  {
    id: "INF-TRN-02",
    name: "Sion Railway Station (Central Mainline)",
    category: "Transit Lifeline",
    categoryType: "TRANSIT",
    location: "Sion (F/North Ward)",
    nearbyFloodZone: "Sion Circle & Gandhi Market",
    currentFloodRisk: "HIGH",
    impactSeverity: "HIGH",
    operationalStatus: "Slow Speed Caution Order (20 kmph)",
    operationalStatusType: "RESTRICTED",
    estimatedWaterDepthM: 0.70,
    safeThresholdM: 0.20,
    dailyUsersAffected: 220000,
    operator: "Central Railway Mumbai Division",
    contactDesk: "+91 22 2407 1122 / Station Master",

    riskDimensions: {
      accessDisruption: 65,     // Gandhi Market entry flooded
      structuralExposure: 70,   // Track 2 ballast waterlogged
      utilityDisruption: 45,    // Automatic signaling caution active
      emergencyImportance: 92   // Central commuter lifeline
    },

    estimatedDisruption: "Water over slow line tracks between Sion and Matunga reached 7 inches. Suburban local trains operating with 20–30 minute delays under caution orders.",
    recommendedResponse: [
      "Maintain 20 kmph caution speed across submerged track sections",
      "Keep mobile dewatering pump operating at Gandhi Market nullah culvert",
      "Direct passengers to central fast line platforms via foot overbridge"
    ]
  },
  {
    id: "INF-ROAD-01",
    name: "Andheri East-West Subway",
    category: "Road Underpass",
    categoryType: "ROAD_NETWORK",
    location: "Andheri (K/East Ward)",
    nearbyFloodZone: "Andheri Subway & Sahar Basin",
    currentFloodRisk: "HIGH",
    impactSeverity: "HIGH",
    operationalStatus: "Boom Barriers Standby",
    operationalStatusType: "RESTRICTED",
    estimatedWaterDepthM: 0.45,
    safeThresholdM: 0.30,
    dailyUsersAffected: 95000,
    operator: "Traffic Police & BMC Roads",
    contactDesk: "Traffic Control: 103 / Andheri Desk",

    riskDimensions: {
      accessDisruption: 60,     // Heavy slow-moving congestion
      structuralExposure: 55,   // Underpass floor water accumulating
      utilityDisruption: 25,    // Pumps operating
      emergencyImportance: 82   // Key connectivity between East and West
    },

    estimatedDisruption: "Water depth reached 0.45m inside subway. Light motor vehicles moving with caution. Boom barrier team on site ready for closure if depth exceeds 0.50m.",
    recommendedResponse: [
      "Prepare boom barrier lockdown if rainfall exceeds 50 mm/hr",
      "Station traffic wardens at SV Road and Western Express approaches",
      "Run all 3 Mogra nullah intake pumps at 100% capacity"
    ]
  },
  {
    id: "INF-ROAD-02",
    name: "Bandra-Kurla Complex (BKC) Road Network",
    category: "Arterial Road Network",
    categoryType: "ROAD_NETWORK",
    location: "BKC (H/East Ward)",
    nearbyFloodZone: "Bandra-Kurla Complex Basin",
    currentFloodRisk: "MODERATE",
    impactSeverity: "MODERATE",
    operationalStatus: "Normal Traffic Flow",
    operationalStatusType: "OPERATIONAL",
    estimatedWaterDepthM: 0.25,
    safeThresholdM: 0.40,
    dailyUsersAffected: 320000,
    operator: "MMRDA & Traffic Police",
    contactDesk: "+91 22 2659 4000 / MMRDA Control",

    riskDimensions: {
      accessDisruption: 25,     // Minor curb ponding at Kalanagar
      structuralExposure: 20,   // Elevated plinth roads dry
      utilityDisruption: 10,    // Normal grid power
      emergencyImportance: 88   // Major commercial & financial hub
    },

    estimatedDisruption: "Vakola Nullah flowing at 75% capacity without overtopping. Minor road ponding near Kalanagar junction; all arterial lanes open and operational.",
    recommendedResponse: [
      "Monitor Vakola Nullah discharge sensor SEN-FLW-01",
      "Keep roadside catchbasin gratings clear of leaves and trash",
      "Maintain green corridor readiness for emergency transit"
    ]
  },
  {
    id: "INF-HOSP-02",
    name: "KEM Hospital & Seth G.S. Medical College",
    category: "Critical Healthcare",
    categoryType: "HEALTHCARE",
    location: "Parel (F/South Ward)",
    nearbyFloodZone: "Hindmata & Dadar TT Lowland",
    currentFloodRisk: "MODERATE",
    impactSeverity: "MODERATE",
    operationalStatus: "Fully Accessible",
    operationalStatusType: "OPERATIONAL",
    estimatedWaterDepthM: 0.20,
    safeThresholdM: 0.35,
    dailyUsersAffected: 16000,
    operator: "BMC Public Health Dept",
    contactDesk: "+91 22 2410 7000 / Medical Dean",

    riskDimensions: {
      accessDisruption: 20,     // Approach clear via Acharya Donde Marg
      structuralExposure: 15,   // High plinth elevation secure
      utilityDisruption: 10,    // Dual power lines active
      emergencyImportance: 98   // Tertiary Referral Medical Center
    },

    estimatedDisruption: "Approach roads completely accessible for emergency patient ambulances. No internal compound flooding reported.",
    recommendedResponse: [
      "Maintain liaison with Sion hospital for emergency trauma overflow admissions",
      "Verify standby diesel generator fuel reserves"
    ]
  },
  {
    id: "INF-DRAIN-01",
    name: "Mahim Creek Tidal Sluice Barrier",
    category: "Coastal Sluice Asset",
    categoryType: "DRAINAGE",
    location: "Mahim Estuary (L / G-North Junction)",
    nearbyFloodZone: "Mithi River Estuary",
    currentFloodRisk: "HIGH",
    impactSeverity: "HIGH",
    operationalStatus: "Tidal Restricted (40% Open)",
    operationalStatusType: "RESTRICTED",
    estimatedWaterDepthM: 3.42,
    safeThresholdM: 2.70,
    dailyUsersAffected: 450000,
    operator: "BMC Storm Water Drains / Hydraulic Engineering",
    contactDesk: "+91 22 2430 8899 / Sluice SCADA",

    riskDimensions: {
      accessDisruption: 30,     // Service road flooded
      structuralExposure: 85,   // Marine tide surge pressure against gates
      utilityDisruption: 15,    // Solar hydraulic actuators active
      emergencyImportance: 94   // Controls Mithi river mouth backflow
    },

    estimatedDisruption: "Sluice gate aperture restrained to 40% to prevent high tide sea surge backflow into Mithi river basin.",
    recommendedResponse: [
      "Adjust gate aperture dynamically according to tidal gauge SEN-TID-01",
      "Prepare full closure during peak high tide (4.54m at 14:45 IST)",
      "Coordinate with upstream Kurla evacuation teams"
    ]
  },
  {
    id: "INF-SHEL-01",
    name: "Kurla Municipal High School Emergency Relief Camp",
    category: "Emergency Shelter",
    categoryType: "SHELTER",
    location: "Kurla West (L-Ward)",
    nearbyFloodZone: "Kurla West & Mithi River Basin Zone",
    currentFloodRisk: "LOW",
    impactSeverity: "LOW",
    operationalStatus: "Open & Accepting Evacuees",
    operationalStatusType: "OPERATIONAL",
    estimatedWaterDepthM: 0.15,
    safeThresholdM: 0.40,
    dailyUsersAffected: 2500,
    operator: "BMC Disaster Management Dept",
    contactDesk: "+91 98201 44321 / Ward Relief Officer",

    riskDimensions: {
      accessDisruption: 25,     // Minor perimeter water
      structuralExposure: 10,   // Elevated building ground
      utilityDisruption: 10,    // Generator + Clean Water Active
      emergencyImportance: 90   // Primary Evacuation Camp
    },

    estimatedDisruption: "Shelter operating smoothly on elevated ground. Accommodating 1,420 displaced residents from Kranti Nagar with food and medical supplies.",
    recommendedResponse: [
      "Maintain continuous drinking water supply and hot meal rations",
      "Station medical desk for waterborne illness screening",
      "Keep mobile charging units and emergency lighting active"
    ]
  },
  {
    id: "INF-PUMP-02",
    name: "Haji Ali Stormwater Pumping Station",
    category: "Drainage Facility",
    categoryType: "DRAINAGE",
    location: "Haji Ali Bay Outfall (D-Ward)",
    nearbyFloodZone: "Haji Ali Coastal Basin",
    currentFloodRisk: "LOW",
    impactSeverity: "LOW",
    operationalStatus: "Operational (5/6 Pumps Active)",
    operationalStatusType: "OPERATIONAL",
    estimatedWaterDepthM: 0.30,
    safeThresholdM: 1.20,
    dailyUsersAffected: 180000,
    operator: "BMC Storm Water Drains",
    contactDesk: "+91 22 2351 7788 / Station Supt",

    riskDimensions: {
      accessDisruption: 15,     // Clean access
      structuralExposure: 25,   // Normal sump volume
      utilityDisruption: 10,    // Grid power stable
      emergencyImportance: 85   // Direct sea discharge outfall
    },

    estimatedDisruption: "5 pumps active discharging 29,800 LPS into Arabian Sea. 1 pump on warm standby. Sump water levels well within safe thresholds.",
    recommendedResponse: [
      "Maintain continuous discharge cycle",
      "Engage 6th pump unit if rainfall rate exceeds 50 mm/hr"
    ]
  }
];

export const INFRA_SUMMARY_METRICS = {
  assetsMonitored: 12,
  atRisk: 8,
  critical: 4,
  estimatedDisruptions: 6
};
