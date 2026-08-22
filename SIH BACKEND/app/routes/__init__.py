"""API v1 routes package for JALRAKSHAK."""
from fastapi import APIRouter
from app.routes.cities import router as cities_router
from app.routes.predictions import router as predictions_router
from app.routes.alerts import router as alerts_router
from app.routes.flood_map import router as map_router
from app.routes.drainage import router as drainage_router
from app.routes.infrastructure import router as infrastructure_router
from app.routes.simulation import router as simulation_router
from app.routes.routes import router as safe_routes_router

api_v1_router = APIRouter()

api_v1_router.include_router(cities_router, prefix="/cities", tags=["Cities & Zones"])
api_v1_router.include_router(predictions_router, prefix="/predictions", tags=["Predictions & Nowcasting"])
api_v1_router.include_router(alerts_router, prefix="/alerts", tags=["Alerts & Early Warning"])
api_v1_router.include_router(map_router, prefix="/flood-map", tags=["Flood Map GeoJSON"])
api_v1_router.include_router(drainage_router, prefix="/drainage", tags=["Drainage Network"])
api_v1_router.include_router(infrastructure_router, prefix="/infrastructure", tags=["Critical Infrastructure"])
api_v1_router.include_router(simulation_router, prefix="/simulation", tags=["What-If Flood Simulation"])
api_v1_router.include_router(safe_routes_router, prefix="/routes", tags=["Safe Route Recommendation"])
