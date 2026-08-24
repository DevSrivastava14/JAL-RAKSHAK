from typing import Any, Dict, List
from fastapi import APIRouter, status

router = APIRouter(
    prefix="",
)

@router.get("/drainage_migration")
async def broadcast_alert():
    """
    Sends migration data to frontend
    """
    try:
        with open("mumbai_dem.tiff","r+") as file:
            data = file.read()
    except Exception as e:
        a = "hello"
        
    return "Migration route"