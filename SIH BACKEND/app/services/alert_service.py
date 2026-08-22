import random
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.database.connection import get_database


class AlertService:
    @staticmethod
    async def get_alerts(
        city_id: str = "mumbai",
        severity_filter: Optional[str] = None,
        status_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        db = get_database()
        query: Dict[str, Any] = {"city_id": city_id.lower()}
        
        if severity_filter and severity_filter.upper() != "ALL":
            query["severity"] = severity_filter.upper()
        if status_filter and status_filter.upper() != "ALL":
            query["status"] = status_filter

        cursor = db["alerts"].find(query)
        alerts = await cursor.to_list(length=100)
        return alerts

    @staticmethod
    async def get_active_alerts(city_id: str = "mumbai") -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db["alerts"].find({
            "city_id": city_id.lower(),
            "status": {"$in": ["Active", "Dispatched", "Monitoring"]}
        })
        alerts = await cursor.to_list(length=100)
        return alerts

    @staticmethod
    async def get_alert_by_id(alert_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        alert = await db["alerts"].find_one({"id": alert_id})
        return alert

    @staticmethod
    async def dispatch_alert(alert_data: Dict[str, Any]) -> Dict[str, Any]:
        db = get_database()
        random_code = random.randint(1000, 9999)
        new_id = f"ALT-{alert_data.get('city_id', 'MUM').upper()[:3]}-{random_code}"
        
        new_alert = {
            "id": new_id,
            "city_id": alert_data.get("city_id", "mumbai").lower(),
            "capCode": f"CAP-IN-{alert_data.get('city_id', 'MUM').upper()[:3]}-2026-{random_code}",
            "title": alert_data.get("title", "Disaster Alert"),
            "location": alert_data.get("location") or alert_data.get("ward", "Command Center"),
            "ward": alert_data.get("ward"),
            "wardCode": alert_data.get("wardCode", "L-Ward"),
            "alertType": alert_data.get("alertType", "Emergency Waterlogging"),
            "severity": alert_data.get("severity", "WARNING"),
            "status": "Dispatched",
            "rainfallMmHr": alert_data.get("rainfallMmHr", 50.0),
            "rainfallStr": f"{alert_data.get('rainfallMmHr', 50.0):.1f} mm/h",
            "floodProbability": alert_data.get("floodProbability", 80),
            "probability": round(alert_data.get("floodProbability", 80) / 100.0, 2),
            "expectedImpactTime": "Immediate",
            "leadTimeToPeak": "30 mins",
            "waterDepthM": alert_data.get("waterDepthM", 0.5),
            "estimated_water_depth": alert_data.get("waterDepthM", 0.5),
            "dangerThresholdM": 0.5,
            "aiConfidence": 94,
            "affectedPopulation": alert_data.get("affectedPopulation", 25000),
            "affectedPopEstimate": alert_data.get("affectedPopulation", 25000),
            "timestamp": "Just now",
            "reportedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
            "source": "JALRAKSHAK Early Warning Command Hub",
            "description": alert_data.get("description", "Emergency alert dispatched to response units."),
            "reason": alert_data.get("description"),
            "triggerFactors": alert_data.get("triggerFactors", [
                {
                    "id": "fac-rain-intensity",
                    "name": "Rainfall Intensity",
                    "measuredValue": f"{alert_data.get('rainfallMmHr', 50.0):.1f} mm/h",
                    "contributionPct": 35,
                    "severity": "HIGH",
                    "statusColor": "#ff7700",
                    "explanation": "High precipitation rate exceeds local storm drain capacity."
                }
            ]),
            "recommendedActions": alert_data.get("actionItems") or alert_data.get("recommendedActions", [
                "Evacuate low-lying ground floor areas",
                "Deploy mobile de-watering pump units",
                "Divert vehicular traffic away from flood corridor"
            ]),
            "actionItems": alert_data.get("actionItems", []),
            "recommended_action": alert_data.get("actionItems", ["Evacuate ground floors"])[0] if alert_data.get("actionItems") else "Evacuate ground floors",
            "broadcastSent": True,
            "channels": alert_data.get("channels", ["SMS Broadcast", "Civil Defense", "Traffic Feed"])
        }

        await db["alerts"].insert_one(new_alert)
        return new_alert
