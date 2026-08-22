from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, model_validator


class SimulationRunRequest(BaseModel):
    rainfallIntensity: Optional[float] = Field(None, description="Rainfall intensity in mm/hr (10-200)")
    rainfall_intensity: Optional[float] = None
    rainfallMmHr: Optional[float] = None

    rainfallDuration: Optional[float] = Field(None, description="Duration in minutes (15-360)")
    storm_duration: Optional[float] = None
    storm_duration_minutes: Optional[float] = None

    drainageEfficiency: Optional[float] = Field(None, description="Drainage capacity efficiency % (10-100)")
    drainage_capacity: Optional[float] = None

    drainageBlockage: Optional[float] = Field(None, description="Drainage blockage percentage % (0-100)")
    drainage_failure: Optional[float] = None
    drainageBlockagePct: Optional[float] = None

    pumpsOnlinePct: Optional[float] = Field(None, description="Active pump percentage % (0-100)")
    pump_failure: Optional[float] = None

    highTideM: Optional[float] = Field(None, description="Coastal high tide level in meters (0-6.0)")
    high_tide_m: Optional[float] = None

    zone_id: Optional[str] = None
    city_id: str = "mumbai"

    @model_validator(mode="after")
    def normalize_fields(self):
        # Normalize rainfall intensity
        if self.rainfallIntensity is None:
            self.rainfallIntensity = self.rainfall_intensity or self.rainfallMmHr or 75.0
        
        # Normalize duration
        if self.rainfallDuration is None:
            self.rainfallDuration = self.storm_duration or self.storm_duration_minutes or 120.0
        
        # Normalize drainage efficiency
        if self.drainageEfficiency is None:
            self.drainageEfficiency = self.drainage_capacity or 70.0

        # Normalize blockage
        if self.drainageBlockage is None:
            self.drainageBlockage = self.drainage_failure or self.drainageBlockagePct or 40.0

        # Normalize pumps
        if self.pumpsOnlinePct is None:
            if self.pump_failure is not None:
                self.pumpsOnlinePct = max(0.0, 100.0 - self.pump_failure)
            else:
                self.pumpsOnlinePct = 90.0

        # Normalize tide
        if self.highTideM is None:
            self.highTideM = self.high_tide_m or 3.2

        return self


class SimulationPresetScenario(BaseModel):
    id: str
    name: Optional[str] = None
    title: Optional[str] = None
    category: str
    params: Optional[Dict[str, Any]] = None
    rainfallMmHr: Optional[float] = None
    rainfallIntensity: Optional[float] = None
    rainfallDuration: Optional[float] = None
    highTideM: Optional[float] = None
    drainageBlockagePct: Optional[float] = None
    drainageEfficiency: Optional[float] = None
    pumpsOnlinePct: Optional[float] = None
    estimatedInundationSqKm: Optional[float] = None
    criticalWards: Optional[int] = None
    impactedPopulation: Optional[int] = None
    description: str


class SimulationFactorAttribution(BaseModel):
    factorName: str
    contributionPct: int
    color: str
    description: str


class SimulationBaselineComparison(BaseModel):
    baseline: Dict[str, Any]
    simulated: Dict[str, Any]
    deltas: Dict[str, Any]


class SimulationResponse(BaseModel):
    simulationId: str
    simulation_id: Optional[str] = None
    timestamp: str
    params: Dict[str, Any]
    riskTier: str
    severity: Optional[str] = None
    floodProbability: int
    flood_probability: Optional[float] = None
    estimatedWaterDepthM: float
    estimated_water_depth: Optional[float] = None
    affectedAreaSqKm: float
    submerged_area: Optional[float] = None
    drainageOverloadPct: int
    estimatedTimeToFlooding: str
    time_to_flooding: Optional[str] = None
    totalRainfallMm: float
    affectedRoads: List[Dict[str, Any]] = []
    affected_infrastructure: List[Dict[str, Any]] = []
    criticalInfraAtRisk: List[Dict[str, Any]] = []
    factorAttribution: List[SimulationFactorAttribution] = []
    comparison: Optional[SimulationBaselineComparison] = None
    actionableRecommendations: List[str] = []
