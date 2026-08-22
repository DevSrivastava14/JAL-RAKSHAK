from typing import Any, Dict, List, Literal, Optional, Union
from pydantic import BaseModel, Field


class GeoJSONGeometry(BaseModel):
    type: Literal["Point", "LineString", "Polygon", "MultiPolygon"]
    coordinates: Any


class GeoJSONFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    id: Optional[str] = None
    geometry: GeoJSONGeometry
    properties: Dict[str, Any] = {}


class GeoJSONFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: List[GeoJSONFeature]


class FloodMapOverviewResponse(BaseModel):
    city_id: str
    cityName: str
    center: List[float]
    zoom: int = 13
    last_updated: str
    risk_colors: Dict[str, str]
    risk_bg_colors: Dict[str, str]
    geojson: GeoJSONFeatureCollection
    summary: Dict[str, Any]
