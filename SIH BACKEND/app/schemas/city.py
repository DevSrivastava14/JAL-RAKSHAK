from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CityCoordinates(BaseModel):
    x: Optional[float] = None
    y: Optional[float] = None


class CityBase(BaseModel):
    id: str
    name: str
    state: str
    region: str
    center: Optional[List[float]] = None
    coordinates: Optional[CityCoordinates] = None
    floodRisk: str = "MODERATE"
    riskColor: Optional[str] = "#ffaa00"
    rainfall: float = 0.0
    rainfallStr: Optional[str] = "0 mm/hr"
    activeAlerts: int = 0
    affectedZones: int = 0
    infrastructureRisk: int = 0
    readiness: int = 80
    inundation: float = 0.0
    waterloggingSeverity: Optional[str] = None
    trend: Optional[str] = None
    floodProneZones: List[str] = []
    roadsAffected: int = 0
    hospitalsAtRisk: int = 0
    transportImpact: Optional[str] = None
    powerRisk: Optional[str] = None
    shelters: int = 0
    sheltersActive: int = 0
    emergencyVehicles: int = 0
    responseTeams: int = 0
    criticalWarnings: Optional[str] = None
    riverCatchment: Optional[str] = None
    explanation: Optional[str] = None


class CityResponse(CityBase):
    pass


class CityListResponse(BaseModel):
    total: int
    cities: List[CityResponse]


class CityOverviewResponse(BaseModel):
    cityName: str
    state: str
    crisisStatus: str = "ORANGE_ALERT"
    crisisTitle: str
    lastUpdated: str
    leadTimeToPeak: str
    overallRiskScore: int
    activeSensors: Dict[str, int]
    activePumps: Dict[str, Any]
    activeAlertsCount: Dict[str, int]
    rainfallStats: Dict[str, float]
    tideInfo: Optional[Dict[str, Any]] = None
    evacuationStats: Dict[str, int]


class ZoneBase(BaseModel):
    id: str
    city_id: str = "mumbai"
    name: str
    code: Optional[str] = None
    wardCode: Optional[str] = None
    zoneCategory: Optional[str] = None
    riskLevel: str
    riskScore: int = 50
    floodProbability: Optional[int] = 0
    waterLevelM: float = 0.0
    warningLevelM: float = 0.0
    dangerLevelM: float = 0.0
    inundationDepthM: float = 0.0
    waterDepthM: Optional[float] = None
    rainfallRateMmHr: float = 0.0
    currentRainfall: Optional[float] = None
    populationAtRisk: int = 0
    affectedPopulation: Optional[int] = None
    pumpsOperating: Optional[str] = "0 / 0"
    leadTimeToFlood: Optional[str] = None
    expectedOnset: Optional[str] = None
    criticalHotspots: List[str] = []
    coordinates: Optional[Dict[str, float]] = None
    center: Optional[List[float]] = None
    polygonCoords: Optional[List[List[float]]] = None
    trend: Optional[str] = None
    statusNote: Optional[str] = None
    description: Optional[str] = None
    recommendedAction: Optional[str] = None
    elevationAMSL: Optional[float] = None
    imperviousPct: Optional[float] = None
    historicalInundations5Yr: Optional[int] = None


class ZoneResponse(ZoneBase):
    pass


class ZoneListResponse(BaseModel):
    total: int
    city_id: str
    zones: List[ZoneResponse]
