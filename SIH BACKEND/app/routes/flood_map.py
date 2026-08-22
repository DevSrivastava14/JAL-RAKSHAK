from fastapi import APIRouter, HTTPException, status
from app.schemas.flood_map import FloodMapOverviewResponse
from app.services.map_service import FloodMapService
from app.services.city_service import CityService

router = APIRouter()


@router.get(
    "/{city_id}",
    response_model=FloodMapOverviewResponse,
    summary="Get GeoJSON flood map for city",
    description="Retrieve GeoJSON FeatureCollection with flood risk polygons, roads, drainage outfalls, and shelters."
)
async def get_flood_map(city_id: str):
    city = await CityService.get_city_by_id(city_id)
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with id '{city_id}' not found."
        )
    map_data = await FloodMapService.get_flood_map_geojson(city_id=city_id)
    return map_data
