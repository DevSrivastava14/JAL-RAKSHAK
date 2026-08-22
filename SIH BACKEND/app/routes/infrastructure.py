from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.infrastructure import (
    InfrastructureAssetResponse,
    PumpToggleRequest
)
from app.services.infrastructure_service import InfrastructureService
from app.services.city_service import CityService

router = APIRouter()


@router.get(
    "/affected",
    response_model=List[InfrastructureAssetResponse],
    summary="Get affected infrastructure",
    description="Retrieve assets currently impacted by flood waterlogging above safety thresholds."
)
async def get_affected_infrastructure(
    city_id: str = Query("mumbai", description="City identifier"),
    min_severity: str = Query("HIGH", description="Minimum severity: CRITICAL, HIGH, MODERATE, LOW")
):
    affected = await InfrastructureService.get_affected_infrastructure(city_id=city_id, min_severity=min_severity)
    return affected


@router.get(
    "/{city_id}",
    response_model=List[InfrastructureAssetResponse],
    summary="Get all infrastructure assets",
    description="Retrieve all monitored municipal assets, pump stations, hospitals, and transit nodes."
)
async def get_infrastructure(city_id: str):
    city = await CityService.get_city_by_id(city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with id '{city_id}' not found."
        )
    assets = await InfrastructureService.get_infrastructure_assets(city_id=city_id)
    return assets


@router.post(
    "/{infra_id}/pump-toggle",
    response_model=InfrastructureAssetResponse,
    summary="Toggle pump operational status",
    description="Increase or decrease active stormwater pump units and recalculate current discharge capacity."
)
async def toggle_pump(infra_id: str, req: PumpToggleRequest):
    updated = await InfrastructureService.toggle_pump_status(infra_id, req.deltaActive)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Infrastructure asset with id '{infra_id}' not found."
        )
    return updated
