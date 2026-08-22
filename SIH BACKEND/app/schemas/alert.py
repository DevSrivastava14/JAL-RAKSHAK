from typing import Any, Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field


class AlertSeverityEnum(str, Enum):
    INFO = "INFO"
    ADVISORY = "ADVISORY"
    WATCH = "WATCH"
    WARNING = "WARNING"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AlertStatusEnum(str, Enum):
    ACTIVE = "Active"
    DISPATCHED = "Dispatched"
    MONITORING = "Monitoring"
    ACKNOWLEDGED = "Acknowledged"
    RESOLVED = "Resolved"


class AlertTriggerFactor(BaseModel):
    id: str
    name: str
    measuredValue: Optional[str] = None
    value: Optional[str] = None
    contributionPct: int = 20
    severity: str = "HIGH"
    statusColor: str = "#ff7700"
    explanation: str


class AlertCreateRequest(BaseModel):
    title: str
    ward: str
    location: Optional[str] = None
    severity: AlertSeverityEnum = AlertSeverityEnum.WARNING
    alertType: str = "Urban Waterlogging"
    description: str
    rainfallMmHr: Optional[float] = 50.0
    waterDepthM: Optional[float] = 0.5
    floodProbability: Optional[int] = 75
    affectedPopulation: Optional[int] = 20000
    channels: List[str] = ["SMS Broadcast", "Civil Defense", "Traffic Feed"]
    actionItems: List[str] = []
    city_id: str = "mumbai"


class AlertResponse(BaseModel):
    id: str
    city_id: str = "mumbai"
    capCode: Optional[str] = None
    title: str
    location: str
    ward: Optional[str] = None
    wardCode: Optional[str] = None
    alertType: str = "River Overflow"
    severity: str  # CRITICAL, HIGH, WARNING, ADVISORY, INFO
    status: str = "Active"
    rainfallMmHr: Optional[float] = 0.0
    rainfallStr: Optional[str] = None
    floodProbability: Optional[int] = 0
    probability: Optional[float] = None
    expectedImpactTime: Optional[str] = None
    leadTimeToPeak: Optional[str] = None
    waterDepthM: Optional[float] = 0.0
    estimated_water_depth: Optional[float] = None
    dangerThresholdM: Optional[float] = 0.5
    aiConfidence: Optional[int] = 90
    affectedPopulation: Optional[int] = 0
    affectedPopEstimate: Optional[int] = None
    timestamp: str
    reportedAt: Optional[str] = None
    source: Optional[str] = "JALRAKSHAK Early Warning Engine"
    description: str
    reason: Optional[str] = None
    triggerFactors: List[AlertTriggerFactor] = []
    recommendedActions: List[str] = []
    actionItems: List[str] = []
    recommended_action: Optional[str] = None
    broadcastSent: bool = True
    channels: List[str] = ["SMS Broadcast", "Traffic Police Feed"]


class AlertListResponse(BaseModel):
    total: int
    active_count: int
    critical_count: int
    city_id: str
    alerts: List[AlertResponse]
