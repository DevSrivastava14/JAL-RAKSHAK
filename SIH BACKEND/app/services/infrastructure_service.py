from typing import Any, Dict, List, Optional
from app.database.connection import get_database


class InfrastructureService:
    @staticmethod
    def _normalize_asset(asset: Dict[str, Any]) -> Dict[str, Any]:
        asset.setdefault("dailyUsersAffected", 0)
        return asset

    @staticmethod
    async def get_drainage_nodes(city_id: str = "mumbai") -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db["drainage_nodes"].find({"city_id": city_id.lower()})
        nodes = await cursor.to_list(length=100)
        return nodes

    @staticmethod
    async def get_infrastructure_assets(city_id: str = "mumbai") -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db["infrastructure"].find({"city_id": city_id.lower()})
        assets = await cursor.to_list(length=100)
        return [InfrastructureService._normalize_asset(asset) for asset in assets]

    @staticmethod
    async def get_affected_infrastructure(city_id: str = "mumbai", min_severity: str = "HIGH") -> List[Dict[str, Any]]:
        db = get_database()
        severity_ranks = {"CRITICAL": 3, "HIGH": 2, "MODERATE": 1, "LOW": 0}
        min_rank = severity_ranks.get(min_severity.upper(), 2)

        cursor = db["infrastructure"].find({"city_id": city_id.lower()})
        assets = await cursor.to_list(length=100)
        assets = [InfrastructureService._normalize_asset(asset) for asset in assets]
        
        affected = [
            a for a in assets
            if severity_ranks.get(a.get("impactSeverity", "LOW").upper(), 0) >= min_rank
        ]
        return affected

    @staticmethod
    async def toggle_pump_status(infra_id: str, delta_active: int) -> Optional[Dict[str, Any]]:
        db = get_database()
        asset = await db["infrastructure"].find_one({"id": infra_id})
        if not asset:
            return None

        installed = asset.get("installedPumps", 6)
        current = asset.get("activePumps", 5)
        new_active = max(0, min(installed, current + delta_active))
        
        ratio = (new_active / installed) if installed > 0 else 1.0
        total_capacity = asset.get("totalCapacityLPS", 36000)
        new_discharge = round(total_capacity * ratio)

        if new_active == installed:
            new_status = "OPERATIONAL_MAX"
        elif new_active > 0:
            new_status = "OPERATIONAL"
        else:
            new_status = "OFFLINE"

        update_fields = {
            "activePumps": new_active,
            "currentDischargeLPS": new_discharge,
            "status": new_status,
            "operationalStatus": f"Operational ({new_active}/{installed} Pumps Active)"
        }

        await db["infrastructure"].update_one(
            {"id": infra_id},
            {"$set": update_fields}
        )

        asset.update(update_fields)
        return InfrastructureService._normalize_asset(asset)
