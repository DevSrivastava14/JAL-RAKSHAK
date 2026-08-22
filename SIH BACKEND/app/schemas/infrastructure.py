from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RiskDimensions(BaseModel):
    accessDisruption: int = 0
    structuralExposure: int = 0
    utilityDisruption: int = 0
    emergencyImportance: int = 0


class InfrastructureAssetResponse(BaseModel):
    id: str
    city_id: str = "mumbai"
    name: str
    category: str
    categoryType: str  # TRANSIT, HEALTHCARE, ROAD_NETWORK, UTILITY, DRAINAGE, SHELTER
    type: Optional[str] = None
    location: str
    ward: Optional[str] = None
    nearbyFloodZone: Optional[str] = None
    currentFloodRisk: str  # CRITICAL, HIGH, MODERATE, LOW
    impactSeverity: str   # CRITICAL, HIGH, MODERATE, LOW
    operationalStatus: str
    operationalStatusType: str  # RESTRICTED, CLOSED, OPERATIONAL
    estimatedWaterDepthM: float
    safeThresholdM: float
    dailyUsersAffected: int
    operator: Optional[str] = None
    contactDesk: Optional[str] = None
    installedPumps: Optional[int] = None
    activePumps: Optional[int] = None
    totalCapacityLPS: Optional[int] = None
    currentDischargeLPS: Optional[int] = None
    powerSource: Optional[str] = None
    status: Optional[str] = None
    waterInflowLevelM: Optional[float] = None
    dischargeOutfall: Optional[str] = None
    lastMaintenance: Optional[str] = None
    scadaControlled: Optional[bool] = None
    healthScore: Optional[int] = None
    riskDimensions: Optional[RiskDimensions] = None
    estimatedDisruption: Optional[str] = None
    recommendedResponse: List[str] = []


class PumpToggleRequest(BaseModel):
    deltaActive: int = Field(..., description="Change in active pumps (+1 or -1)")


class InfraSummaryMetricsResponse(BaseModel):
    assetsMonitored: int
    atRisk: int
    critical: int
    estimatedDisruptions: int


class InfrastructureListResponse(BaseModel):
    total: int
    city_id: str
    summary_metrics: InfraSummaryMetricsResponse
    assets: List[InfrastructureAssetResponse]
