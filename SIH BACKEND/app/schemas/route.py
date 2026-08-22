from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, model_validator


class LocationItem(BaseModel):
    id: str
    name: str
    shortName: Optional[str] = None
    lat: float
    lng: float
    risk: str = "LOW"


class SafeRouteRequest(BaseModel):
    start_location: Optional[str] = None
    fromLocation: Optional[str] = None
    destination: Optional[str] = None
    toLocation: Optional[str] = None
    is_emergency_mode: bool = False
    isEmergencyMode: bool = False
    city_id: str = "mumbai"
    current_flood_conditions: Optional[Dict[str, Any]] = None
    predicted_flood_conditions: Optional[Dict[str, Any]] = None

    @model_validator(mode="after")
    def normalize_locations(self):
        if not self.start_location:
            self.start_location = self.fromLocation or "Kurla"
        if not self.destination:
            self.destination = self.toLocation or "Dadar"
        if not self.is_emergency_mode:
            self.is_emergency_mode = self.isEmergencyMode
        return self


class RoutePoint(BaseModel):
    x: Optional[float] = None
    y: Optional[float] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    label: Optional[str] = None
    alert: Optional[str] = None


class RouteOptionResponse(BaseModel):
    id: str
    name: str
    isRecommended: bool
    is_recommended: Optional[bool] = None
    status: str
    statusBadge: str
    statusColor: str  # safe, warning, critical
    distance: str
    route_distance: Optional[str] = None
    travelTime: str
    estimated_time: Optional[str] = None
    safetyScore: int
    floodRisk: str
    flood_risk: Optional[str] = None
    affectedSegments: str
    unsafe_segments: List[str] = []
    waterDepth: str
    roadAccessibility: int
    floodExposure: int
    estimatedDelay: str
    riskySegmentsCount: int
    nearbyEmergencyHubs: List[str] = []
    explanation: str
    routeType: str
    polylinePoints: List[RoutePoint] = []


class SafeRouteResponse(BaseModel):
    city_id: str = "mumbai"
    start_location: str
    destination: str
    is_emergency_mode: bool
    recommended_route: Optional[RouteOptionResponse] = None
    alternative_routes: List[RouteOptionResponse] = []
    all_routes: List[RouteOptionResponse] = []
    nearby_facilities: List[Dict[str, Any]] = []
    active_hazards: List[Dict[str, Any]] = []
