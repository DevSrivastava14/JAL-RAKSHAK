from typing import Any, Dict, List
from fastapi import APIRouter, status
from app.schemas.route import (
    SafeRouteRequest,
    SafeRouteResponse,
    LocationItem
)
from app.services.routing_service import SafeRoutingService

router = APIRouter()
routing_service = SafeRoutingService()


@router.post(
    "/safe",
    response_model=SafeRouteResponse,
    summary="Compute flood-aware safe routes",
    description="Calculate safest navigation corridors avoiding submerged roads, underpasses, and high-risk flood zones."
)
async def compute_safe_route(route_req: SafeRouteRequest):
    result = routing_service.compute_safe_route(
        from_loc=route_req.start_location or "Kurla",
        to_loc=route_req.destination or "Dadar",
        is_emergency=route_req.is_emergency_mode,
        env_conditions=route_req.current_flood_conditions
    )
    return result


@router.get(
    "/locations/{city_id}",
    response_model=List[LocationItem],
    summary="Get city location nodes for routing",
    description="Retrieve available landmark navigation nodes with live risk tags."
)
async def get_locations(city_id: str = "mumbai"):
    locations = routing_service.get_locations(city_id=city_id)
    return locations


@router.get(
    "/hazards/{city_id}",
    response_model=List[Dict[str, Any]],
    summary="Get active road hazards and submerged underpasses",
    description="Retrieve list of active flood obstructions and barricaded road segments."
)
async def get_hazards(city_id: str = "mumbai"):
    hazards = routing_service.get_hazards(city_id=city_id)
    return hazards
