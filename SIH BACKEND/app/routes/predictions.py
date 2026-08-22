from typing import Any, Dict, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.prediction import (
    ZonePredictionResponse,
    PredictionExplanationResponse,
    PredictionListResponse
)
from app.services.prediction_service import PredictionService
from app.services.xai_service import XAIService

router = APIRouter()
prediction_service = PredictionService()
xai_service = XAIService()


@router.get(
    "",
    response_model=PredictionListResponse,
    summary="Get 0–6 hour flood nowcast predictions",
    description="Retrieve 0-6 hour spatial-temporal flood predictions for all catchment zones in a city."
)
async def get_predictions(
    city_id: str = Query("mumbai", description="City identifier (e.g. mumbai, delhi, bengaluru, chennai)")
):
    result = await prediction_service.get_city_predictions(city_id=city_id)
    return result


@router.get(
    "/{zone_id}",
    response_model=ZonePredictionResponse,
    summary="Get nowcast prediction for a specific zone",
    description="Retrieve 0-6 hour hydrograph curve, peak flood arrival time, and estimated water depth."
)
async def get_zone_prediction(
    zone_id: str,
    rainfall: Optional[float] = Query(None, description="Simulated rainfall intensity override in mm/h")
):
    env_params = {}
    if rainfall is not None:
        env_params["rainfallIntensity"] = rainfall

    prediction = await prediction_service.get_zone_prediction(zone_id, env_params=env_params)
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction for zone '{zone_id}' not found."
        )
    return prediction


@router.get(
    "/{zone_id}/explanation",
    response_model=PredictionExplanationResponse,
    summary="Explainable AI (XAI) feature attribution",
    description="Retrieve relative feature importance breakdown explaining why a zone was classified at risk."
)
async def get_zone_explanation(
    zone_id: str,
    rainfall: Optional[float] = Query(None, description="Simulated rainfall intensity override in mm/h")
):
    env_params = {}
    if rainfall is not None:
        env_params["rainfallIntensity"] = rainfall

    explanation = await xai_service.get_zone_explanation(zone_id, env_params=env_params)
    if not explanation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"XAI Explanation for zone '{zone_id}' not found."
        )
    return explanation
