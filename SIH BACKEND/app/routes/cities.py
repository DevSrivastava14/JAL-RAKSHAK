from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.city import (
    CityResponse,
    CityListResponse,
    CityOverviewResponse,
    ZoneResponse,
    ZoneListResponse
)
from app.services.city_service import CityService

router = APIRouter()


@router.get(
    "",
    response_model=List[CityResponse],
    summary="List all supported cities",
    description="Retrieve all supported smart cities with comparative flood risk scores and readiness metrics."
)
async def list_cities():
    cities = await CityService.get_all_cities()
    return cities


@router.get(
    "/{city_id}",
    response_model=CityResponse,
    summary="Get city by ID",
    description="Retrieve detailed disaster command profile for a specific city."
)
async def get_city(city_id: str):
    city = await CityService.get_city_by_id(city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with id '{city_id}' not found."
        )
    return city


@router.get(
    "/{city_id}/overview",
    response_model=CityOverviewResponse,
    summary="Get city live command overview",
    description="Retrieve real-time telemetry metrics, tidal status, rainfall stats, and emergency response posture."
)
async def get_city_overview(city_id: str):
    overview = await CityService.get_city_overview(city_id)
    if not overview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Overview metrics for city '{city_id}' not found."
        )
    return overview


@router.get(
    "/{city_id}/zones",
    response_model=List[ZoneResponse],
    summary="Get all zones for a city",
    description="Retrieve list of municipal wards and low-lying catchment zones with risk levels."
)
async def list_city_zones(
    city_id: str,
    risk: Optional[str] = Query(None, description="Optional risk filter: ALL, CRITICAL, HIGH, MODERATE, LOW, SAFE")
):
    city = await CityService.get_city_by_id(city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with id '{city_id}' not found."
        )
    zones = await CityService.get_city_zones(city_id, risk_filter=risk)
    return zones


@router.get(
    "/{city_id}/zones/{zone_id}",
    response_model=ZoneResponse,
    summary="Get zone by ID",
    description="Retrieve catchment details and hydrodynamic thresholds for a specific zone."
)
async def get_zone(city_id: str, zone_id: str):
    zone = await CityService.get_zone_by_id(zone_id)
    if not zone or zone.get("city_id") != city_id.lower():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zone with id '{zone_id}' not found in city '{city_id}'."
        )
    return zone


@router.get(
    "/{city_id}/sensors",
    summary="Get IoT telemetry sensors for a city",
    description="Retrieve live IoT water level, ultrasonic, and rain gauge telemetry nodes."
)
async def list_city_sensors(city_id: str):
    city = await CityService.get_city_by_id(city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with id '{city_id}' not found."
        )
    sensors = await CityService.get_city_sensors(city_id)
    return sensors
