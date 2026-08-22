// =========================================================
// JALRAKSHAK - Modular Safe Routes & Emergency Navigation Dataset
// SIH26085 Flood-Aware Dynamic Route Planning Engine
// =========================================================

export const MUMBAI_LOCATIONS = [
  { id: "LOC-KUR", name: "Kurla (Central Catchment)", shortName: "Kurla", lat: 19.0688, lng: 72.8797, risk: "CRITICAL" },
  { id: "LOC-BKC", name: "BKC (Commercial Hub)", shortName: "BKC", lat: 19.0607, lng: 72.8662, risk: "MODERATE" },
  { id: "LOC-SIO", name: "Sion (Sion Circle)", shortName: "Sion", lat: 19.0400, lng: 72.8600, risk: "HIGH" },
  { id: "LOC-DAD", name: "Dadar (Dadar TT / Central)", shortName: "Dadar", lat: 19.0178, lng: 72.8478, risk: "CRITICAL" },
  { id: "LOC-AND", name: "Andheri (East / West)", shortName: "Andheri", lat: 19.1197, lng: 72.8464, risk: "MODERATE" },
  { id: "LOC-BAN", name: "Bandra (Reclamation / West)", shortName: "Bandra", lat: 19.0550, lng: 72.8350, risk: "LOW" },
  { id: "LOC-SAN", name: "Santacruz (Airport / Milan)", shortName: "Santacruz", lat: 19.0833, lng: 72.8398, risk: "HIGH" },
  { id: "LOC-CHE", name: "Chembur (Eastern Suburbs)", shortName: "Chembur", lat: 19.0522, lng: 72.8994, risk: "LOW" },
  { id: "LOC-COL", name: "Colaba (South Mumbai)", shortName: "Colaba", lat: 18.9067, lng: 72.8147, risk: "LOW" }
];

export const WARNING_HAZARDS = [
  {
    id: "HAZ-01",
    name: "LBS Marg & Kranti Nagar Breach",
    type: "SUBMERGED_ROAD",
    severity: "CRITICAL",
    depth: "1.25m Waterlogging",
    x: 42,
    y: 38,
    desc: "LBS Marg closed between Kurla Station and Chunabhatti."
  },
  {
    id: "HAZ-02",
    name: "Milan Subway Underpass",
    type: "SUBMERGED_SUBWAY",
    severity: "CRITICAL",
    depth: "0.95m Submersion",
    x: 22,
    y: 30,
    desc: "Vehicular underpass barricaded. Automatic boom barrier locked."
  },
  {
    id: "HAZ-03",
    name: "Hindmata Sump Depression",
    type: "TIDAL_LOCK_INUNDATION",
    severity: "HIGH",
    depth: "0.70m Standing Water",
    x: 36,
    y: 72,
    desc: "Gravity drain locked by high tide. Surface road congested."
  },
  {
    id: "HAZ-04",
    name: "Sion Gandhi Market Rail Culvert",
    type: "TRACK_WATERLOGGING",
    severity: "HIGH",
    depth: "0.55m Curb Water",
    x: 48,
    y: 54,
    desc: "Slow movement caution order active."
  }
];

export const EMERGENCY_FACILITIES = [
  { id: "EF-HOSP-SION", name: "Sion Trauma Hospital", type: "HOSPITAL", x: 45, y: 56, symbol: "🏥" },
  { id: "EF-FIRE-DADAR", name: "Dadar Water Rescue Base", type: "FIRE_STATION", x: 34, y: 70, symbol: "🚒" },
  { id: "EF-NDRF-BKC", name: "NDRF Battalion 04 Base", type: "POLICE_NDRF", x: 38, y: 44, symbol: "🛡️" },
  { id: "EF-SHEL-KUR", name: "Kurla Relief Camp", type: "SHELTER", x: 50, y: 35, symbol: "🏫" }
];

/**
 * Modular function to compute or lookup safe route options
 */
export function getSafeRoutes(fromLocation, toLocation, isEmergencyMode = false) {
  const fromName = fromLocation || "Kurla";
  const toName = toLocation || "Dadar";

  if (isEmergencyMode) {
    return [
      {
        id: "RT-EMG-01",
        name: "Emergency Life-Line Green Corridor (EEH + SCLR)",
        isRecommended: true,
        status: "Recommended",
        statusBadge: "RECOMMENDED SAFEST ROUTE",
        statusColor: "safe",
        distance: "9.2 km",
        travelTime: "18 mins",
        safetyScore: 98,
        floodRisk: "LOW",
        affectedSegments: "0 Flood Segments (Dedicated Green Corridor)",
        waterDepth: "0.00m (Completely Dry Elevated SCLR)",
        roadAccessibility: 100,
        floodExposure: 4,
        estimatedDelay: "+0 mins (Priority Flow)",
        riskySegmentsCount: 0,
        nearbyEmergencyHubs: ["Sion Trauma Hospital Access Gate", "NDRF BKC Base", "Dadar Rescue Center"],
        explanation: `Emergency Response Mode prioritizes wide arterial grade-separated corridors (SCLR & Eastern Express) with direct high-clearance access to ${toName}. Zero exposure to Mithi river overflow.`,
        routeType: "ELEVATED_EMERGENCY",
        polylinePoints: [
          { x: 52, y: 34, label: fromName },
          { x: 50, y: 40 },
          { x: 44, y: 46 },
          { x: 45, y: 56, alert: "🏥 Sion Trauma Hub" },
          { x: 40, y: 68 },
          { x: 35, y: 75, label: toName }
        ]
      },
      {
        id: "RT-EMG-02",
        name: "Secondary Flyover Bypass via Western Connector",
        isRecommended: false,
        status: "Caution",
        statusBadge: "CAUTION ADVISED",
        statusColor: "warning",
        distance: "11.6 km",
        travelTime: "29 mins",
        safetyScore: 78,
        floodRisk: "MODERATE",
        affectedSegments: "1 Slow Corridor (Near Kalanagar Sump)",
        waterDepth: "0.20m Shallow Curb Buffer",
        roadAccessibility: 80,
        floodExposure: 26,
        estimatedDelay: "+8 mins",
        riskySegmentsCount: 1,
        nearbyEmergencyHubs: ["Bandra Reclamation Relief Center"],
        explanation: `Maintains bypass over lowlands via flyovers but encounters minor traffic slowdown near Bandra connector. Suitable for high-clearance utility vans.`,
        routeType: "WESTERN_BYPASS",
        polylinePoints: [
          { x: 52, y: 34, label: fromName },
          { x: 36, y: 38 },
          { x: 28, y: 50 },
          { x: 30, y: 66 },
          { x: 35, y: 75, label: toName }
        ]
      }
    ];
  }

  // Standard Routing Options
  return [
    {
      id: "RT-REC-01",
      name: "Elevated Expressway & Flyover Bypass Corridor",
      isRecommended: true,
      status: "Recommended",
      statusBadge: "RECOMMENDED SAFEST ROUTE",
      statusColor: "safe",
      distance: "8.8 km",
      travelTime: "22 mins",
      safetyScore: 94,
      floodRisk: "LOW",
      affectedSegments: "0 Inundated Segments (100% Elevated Flyover Buffer)",
      waterDepth: "0.00m (Clear Elevated Road)",
      roadAccessibility: 96,
      floodExposure: 8,
      estimatedDelay: "+4 mins",
      riskySegmentsCount: 0,
      nearbyEmergencyHubs: ["Sion Municipal Hospital", "BKC Emergency Desk"],
      explanation: `Recommended route avoids the highest-risk inundation zones around the Mithi River basin and minimizes exposure to roads with predicted water depth above safe limits. Direct connection from ${fromName} to ${toName} via elevated grade separators.`,
      routeType: "RECOMMENDED_SAFE",
      polylinePoints: [
        { x: 52, y: 34, label: fromName },
        { x: 48, y: 42 },
        { x: 44, y: 52 },
        { x: 42, y: 62 },
        { x: 35, y: 75, label: toName }
      ]
    },
    {
      id: "RT-ALT-02",
      name: "Direct Arterial Surface Route via S.V. / Dr. B.A. Road",
      isRecommended: false,
      status: "Caution",
      statusBadge: "CAUTION (SURFACE PONDING)",
      statusColor: "warning",
      distance: "7.2 km",
      travelTime: "44 mins",
      safetyScore: 64,
      floodRisk: "HIGH",
      affectedSegments: "2 Chokepoints (Gandhi Market & Parel Lowlands)",
      waterDepth: "0.45m Surface Waterlogging",
      roadAccessibility: 58,
      floodExposure: 52,
      estimatedDelay: "+22 mins",
      riskySegmentsCount: 2,
      nearbyEmergencyHubs: ["Dadar Fire Base"],
      explanation: `Shorter physical distance but traverses low-lying depression sumps with active 0.45m curb ponding. Expect severe traffic slowdowns (15 kmph).`,
      routeType: "SURFACE_CAUTION",
      polylinePoints: [
        { x: 52, y: 34, label: fromName },
        { x: 44, y: 44, alert: "⚠️ 0.45m Ponding" },
        { x: 40, y: 58 },
        { x: 35, y: 75, label: toName }
      ]
    },
    {
      id: "RT-AVD-03",
      name: "Subway & Lowland Shortcut (LBS / Milan Corridor)",
      isRecommended: false,
      status: "Avoid",
      statusBadge: "AVOID (SUBMERGED CHOKEPOINTS)",
      statusColor: "critical",
      distance: "6.4 km",
      travelTime: "85+ mins (Blocked)",
      safetyScore: 14,
      floodRisk: "CRITICAL",
      affectedSegments: "1 Submerged Underpass (0.95m) + 2 Overflown Drains",
      waterDepth: "1.25m Deep Submersion",
      roadAccessibility: 15,
      floodExposure: 92,
      estimatedDelay: "+60 mins / Gridlock",
      riskySegmentsCount: 3,
      nearbyEmergencyHubs: ["Kurla Shelter"],
      explanation: `DANGER: Route enters barricaded subway underpass and Mithi river overflow zone with water depths exceeding vehicle intake thresholds. High risk of vehicle stalling.`,
      routeType: "CRITICAL_AVOID",
      polylinePoints: [
        { x: 52, y: 34, label: fromName },
        { x: 42, y: 38, alert: "⛔ Submerged 1.25m" },
        { x: 32, y: 52 },
        { x: 35, y: 75, label: toName }
      ]
    }
  ];
}
