from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.alert import (
    AlertResponse,
    AlertListResponse,
    AlertCreateRequest
)
from app.services.alert_service import AlertService

router = APIRouter()


@router.get(
    "",
    response_model=List[AlertResponse],
    summary="List flood alerts",
    description="Retrieve list of emergency alerts with CAP metadata, severity tier, and SOP action items."
)
async def list_alerts(
    city_id: str = Query("mumbai", description="City identifier"),
    severity: Optional[str] = Query(None, description="Filter: CRITICAL, HIGH, WARNING, ADVISORY, INFO, ALL"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter: Active, Dispatched, Monitoring, ALL")
):
    alerts = await AlertService.get_alerts(
        city_id=city_id,
        severity_filter=severity,
        status_filter=status_filter
    )
    return alerts


@router.get(
    "/active",
    response_model=List[AlertResponse],
    summary="Get active emergency alerts",
    description="Retrieve currently active high-priority disaster warnings and evacuation broadcasts."
)
async def get_active_alerts(
    city_id: str = Query("mumbai", description="City identifier")
):
    alerts = await AlertService.get_active_alerts(city_id=city_id)
    return alerts


@router.get(
    "/{alert_id}",
    response_model=AlertResponse,
    summary="Get alert by ID",
    description="Retrieve detailed CAP alert payload and trigger factors."
)
async def get_alert(alert_id: str):
    alert = await AlertService.get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with id '{alert_id}' not found."
        )
    return alert


@router.post(
    "/dispatch",
    response_model=AlertResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Dispatch a new emergency alert",
    description="Broadcast a new flood alert across civil defense and municipal notification channels."
)
async def dispatch_alert(alert_req: AlertCreateRequest):
    new_alert = await AlertService.dispatch_alert(alert_req.model_dump())
    return new_alert
