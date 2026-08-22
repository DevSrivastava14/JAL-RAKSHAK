from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class XAIFactor(BaseModel):
    id: str
    name: str
    value: str
    contributionPct: int = Field(..., ge=0, le=100)
    severity: str = "MODERATE"
    statusColor: str = "#ffcc00"
    impactDirection: str = "INCREASES_RISK"  # INCREASES_RISK, REDUCES_RISK, LOW_RISK
    explanation: str


class HourlyNowcastPoint(BaseModel):
    timeLabel: str
    offsetMin: int
    offsetMinutes: Optional[int] = None
    rainfallMmHr: float
    rainfallIntensityMmHr: Optional[float] = None
    waterLevelM: float
    floodProbPct: int
    predictedRunoffM3s: Optional[float] = None
    inundatedAreaSqKm: Optional[float] = None
    confidencePct: Optional[int] = None


class ZonePredictionResponse(BaseModel):
    id: str
    zone_id: str
    city_id: str = "mumbai"
    name: str
    wardCode: Optional[str] = None
    zoneCategory: Optional[str] = None
    currentRainfall: float
    currentRainfallStr: Optional[str] = None
    floodProbability: int = Field(..., ge=0, le=100)
    flood_probability: Optional[float] = None  # 0.0 - 1.0 normalized
    predictionConfidence: int = Field(..., ge=0, le=100)
    prediction_confidence: Optional[float] = None
    severity: str  # CRITICAL, HIGH, MODERATE, LOW, SAFE
    estimatedWaterDepthM: float
    estimated_water_depth_cm: Optional[float] = None
    dangerThresholdM: float = 0.5
    expectedTimeToFlooding: str
    time_to_flooding_minutes: Optional[int] = None
    leadTimeToPeak: Optional[str] = None
    peakFloodArrival: Optional[str] = None
    forecast_horizon_hours: int = 6
    populationAtRisk: int = 0
    description: Optional[str] = None
    factors: Optional[Dict[str, float]] = None  # Normalized feature weights
    xaiFactors: List[XAIFactor] = []
    hourlyNowcast: List[HourlyNowcastPoint] = []
    prediction_timestamp: Optional[str] = None


class PredictionExplanationResponse(BaseModel):
    zone_id: str
    zone_name: str
    city_id: str = "mumbai"
    severity: str
    flood_probability: float
    prediction_confidence: float
    factors: Dict[str, float]
    xai_factors: List[XAIFactor]
    summary_explanation: str
    generated_at: str


class PredictionListResponse(BaseModel):
    total: int
    city_id: str
    model_metadata: Dict[str, Any]
    predictions: List[ZonePredictionResponse]
