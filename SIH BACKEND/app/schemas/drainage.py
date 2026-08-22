from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class DrainageNodeResponse(BaseModel):
    id: str
    city_id: str = "mumbai"
    name: str
    type: str
    typeLabel: Optional[str] = None
    lat: float
    lng: float
    ward: Optional[str] = None
    capacityM3s: float
    currentFlowM3s: float
    blockagePct: int
    siltationLevelM: float
    waterLevelM: float
    status: str  # CHOKED, HIGH_LOAD, NORMAL
    lastInspected: Optional[str] = None
    sensorId: Optional[str] = None
    description: Optional[str] = None
    actionRequired: Optional[str] = None


class DrainageListResponse(BaseModel):
    total: int
    city_id: str
    nodes: List[DrainageNodeResponse]
