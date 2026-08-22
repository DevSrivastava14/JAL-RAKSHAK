from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.database.connection import get_database


class CityService:
    @staticmethod
    async def get_all_cities() -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db["cities"].find({})
        cities = await cursor.to_list(length=100)
        return cities

    @staticmethod
    async def get_city_by_id(city_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        city = await db["cities"].find_one({"id": city_id.lower()})
        return city

    @staticmethod
    async def get_city_overview(city_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        city = await CityService.get_city_by_id(city_id)
        if not city:
            return None

        # Fetch live stats from zones, sensors, alerts
        zones_cursor = db["zones"].find({"city_id": city_id.lower()})
        zones = await zones_cursor.to_list(length=100)

        sensors_cursor = db["sensors"].find({"city_id": city_id.lower()})
        sensors = await sensors_cursor.to_list(length=100)

        alerts_cursor = db["alerts"].find({"city_id": city_id.lower()})
        alerts = await alerts_cursor.to_list(length=100)

        critical_alerts = sum(1 for a in alerts if a.get("severity") == "CRITICAL")
        warning_alerts = sum(1 for a in alerts if a.get("severity") in ("WARNING", "HIGH"))
        advisory_alerts = sum(1 for a in alerts if a.get("severity") in ("ADVISORY", "WATCH", "INFO"))

        return {
            "cityName": f"{city.get('name', 'Mumbai')} Flood Command Zone",
            "state": f"{city.get('state', 'Maharashtra')}, India",
            "crisisStatus": "ORANGE_ALERT" if city.get("floodRisk") in ("HIGH", "CRITICAL") else "NORMAL",
            "crisisTitle": f"{city.get('waterloggingSeverity', 'Active Flood Inundation Monitoring')}",
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
            "leadTimeToPeak": "42 mins",
            "overallRiskScore": city.get("readiness", 78),
            "activeSensors": {
                "online": len(sensors) if sensors else 142,
                "total": (len(sensors) + 6) if sensors else 148
            },
            "activePumps": {
                "running": 38,
                "total": 42,
                "capacityLPS": 184000
            },
            "activeAlertsCount": {
                "critical": critical_alerts,
                "warning": warning_alerts,
                "advisory": advisory_alerts
            },
            "rainfallStats": {
                "currentAvgMmHr": city.get("rainfall", 48.5),
                "past24hAccumulatedMm": round(city.get("rainfall", 48.5) * 3.4, 1),
                "next3hPredictedMm": round(city.get("rainfall", 48.5) * 1.7, 1),
                "radarPeakIntensity": round(city.get("rainfall", 48.5) * 2.3, 1)
            },
            "tideInfo": {
                "currentHeightM": 3.82,
                "peakTideHeightM": 4.54,
                "peakTideTime": "14:45 IST",
                "isTidalLockActive": True,
                "sluiceGateStatus": "PARTIALLY_LOCKED"
            },
            "evacuationStats": {
                "sheltersOpen": city.get("sheltersActive", 28),
                "displacedPop": city.get("affectedZones", 18) * 190,
                "rescueTeamsDeployed": city.get("responseTeams", 18),
                "safeCorridorsActive": 12
            }
        }

    @staticmethod
    async def get_city_zones(city_id: str, risk_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        db = get_database()
        query: Dict[str, Any] = {"city_id": city_id.lower()}
        if risk_filter and risk_filter.upper() != "ALL":
            query["riskLevel"] = risk_filter.upper()
        cursor = db["zones"].find(query)
        zones = await cursor.to_list(length=200)
        return zones

    @staticmethod
    async def get_zone_by_id(zone_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        zone = await db["zones"].find_one({"id": zone_id})
        return zone

    @staticmethod
    async def get_city_sensors(city_id: str) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db["sensors"].find({"city_id": city_id.lower()})
        sensors = await cursor.to_list(length=200)
        return sensors
