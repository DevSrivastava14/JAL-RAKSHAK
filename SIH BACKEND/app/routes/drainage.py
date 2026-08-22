from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.drainage import DrainageNodeResponse
from app.services.infrastructure_service import InfrastructureService
from app.services.city_service import CityService

router = APIRouter()


@router.get(
    "/{city_id}",
    response_model=List[DrainageNodeResponse],
    summary="Get drainage network nodes",
    description="Retrieve all major storm outfall junctions, culvert sumps, and siltation metrics for a city."
)
async def get_drainage(city_id: str):
    city = await CityService.get_city_by_id(city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with id '{city_id}' not found."
        )
    nodes = await InfrastructureService.get_drainage_nodes(city_id=city_id)
    return nodes
