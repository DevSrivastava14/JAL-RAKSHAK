from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.database.connection import get_database


class FloodMapService:
    @staticmethod
    async def get_flood_map_geojson(city_id: str = "mumbai") -> Dict[str, Any]:
        db = get_database()
        city = await db["cities"].find_one({"id": city_id.lower()}) or {
            "name": "Mumbai",
            "center": [19.0760, 72.8777]
        }

        features: List[Dict[str, Any]] = []

        # 1. Zone Polygons
        zones_cursor = db["zones"].find({"city_id": city_id.lower()})
        zones = await zones_cursor.to_list(length=100)
        for zone in zones:
            coords = zone.get("polygonCoords")
            if coords:
                # GeoJSON expects coordinates as [longitude, latitude]
                geojson_polygon = [[c[1], c[0]] for c in coords]
                # Close the polygon ring if not closed
                if geojson_polygon[0] != geojson_polygon[-1]:
                    geojson_polygon.append(geojson_polygon[0])

                features.append({
                    "type": "Feature",
                    "id": zone.get("id"),
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [geojson_polygon]
                    },
                    "properties": {
                        "layerType": "FLOOD_ZONE",
                        "zone_id": zone.get("id"),
                        "name": zone.get("name"),
                        "wardCode": zone.get("wardCode"),
                        "riskLevel": zone.get("riskLevel", "MODERATE"),
                        "riskScore": zone.get("riskScore", 50),
                        "floodProbability": zone.get("floodProbability", 50),
                        "waterDepthM": zone.get("waterDepthM", 0.0),
                        "dangerMarkM": zone.get("dangerMarkM", 0.5),
                        "affectedPopulation": zone.get("affectedPopulation", 0),
                        "evacuationStatus": zone.get("evacuationStatus", "CLEAR"),
                        "recommendedAction": zone.get("recommendedAction"),
                        "center": zone.get("center"),
                        "polygonCoords": zone.get("polygonCoords")
                    }
                })

        # 2. Roads LineStrings
        roads_cursor = db["roads"].find({"city_id": city_id.lower()})
        roads = await roads_cursor.to_list(length=100)
        for road in roads:
            coords = road.get("coordinates")
            if coords:
                geojson_line = [[c[1], c[0]] for c in coords]
                features.append({
                    "type": "Feature",
                    "id": road.get("id"),
                    "geometry": {
                        "type": "LineString",
                        "coordinates": geojson_line
                    },
                    "properties": {
                        "layerType": "ROAD_NETWORK",
                        "road_id": road.get("id"),
                        "name": road.get("name"),
                        "status": road.get("status", "CLEAR_OPEN"),
                        "statusLabel": road.get("statusLabel", "Clear"),
                        "riskLevel": road.get("riskLevel", "LOW"),
                        "waterDepthM": road.get("waterDepthM", 0.0),
                        "speedLimitKmh": road.get("speedLimitKmh", 50),
                        "trafficCondition": road.get("trafficCondition"),
                        "alternativeRoute": road.get("alternativeRoute"),
                        "coordinates": road.get("coordinates")
                    }
                })

        # 3. Drainage Outfall Points
        drain_cursor = db["drainage_nodes"].find({"city_id": city_id.lower()})
        drain_nodes = await drain_cursor.to_list(length=100)
        for node in drain_nodes:
            lat = node.get("lat")
            lng = node.get("lng")
            if lat is not None and lng is not None:
                features.append({
                    "type": "Feature",
                    "id": node.get("id"),
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "properties": {
                        "layerType": "DRAINAGE_NODE",
                        "drain_id": node.get("id"),
                        "name": node.get("name"),
                        "type": node.get("type"),
                        "typeLabel": node.get("typeLabel"),
                        "ward": node.get("ward"),
                        "capacityM3s": node.get("capacityM3s"),
                        "currentFlowM3s": node.get("currentFlowM3s"),
                        "blockagePct": node.get("blockagePct"),
                        "status": node.get("status"),
                        "waterLevelM": node.get("waterLevelM"),
                        "lat": lat,
                        "lng": lng
                    }
                })

        # 4. Infrastructure Points
        infra_cursor = db["infrastructure"].find({"city_id": city_id.lower()})
        infra_assets = await infra_cursor.to_list(length=100)
        for asset in infra_assets:
            features.append({
                "type": "Feature",
                "id": asset.get("id"),
                "geometry": {
                    "type": "Point",
                    "coordinates": [72.85, 19.05]
                },
                "properties": {
                    "layerType": "INFRASTRUCTURE",
                    "infra_id": asset.get("id"),
                    "name": asset.get("name"),
                    "category": asset.get("category"),
                    "categoryType": asset.get("categoryType"),
                    "impactSeverity": asset.get("impactSeverity"),
                    "operationalStatus": asset.get("operationalStatus"),
                    "estimatedWaterDepthM": asset.get("estimatedWaterDepthM")
                }
            })

        return {
            "city_id": city_id.lower(),
            "cityName": city.get("name", "Mumbai"),
            "center": city.get("center", [19.0760, 72.8777]),
            "zoom": 13,
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "risk_colors": {
                "CRITICAL": "#ff334b",
                "HIGH": "#ff7700",
                "MODERATE": "#ffcc00",
                "LOW": "#10b981"
            },
            "risk_bg_colors": {
                "CRITICAL": "rgba(255, 51, 75, 0.28)",
                "HIGH": "rgba(255, 119, 0, 0.25)",
                "MODERATE": "rgba(255, 204, 0, 0.22)",
                "LOW": "rgba(16, 185, 129, 0.18)"
            },
            "geojson": {
                "type": "FeatureCollection",
                "features": features
            },
            "summary": {
                "totalZones": len(zones),
                "criticalZones": sum(1 for z in zones if z.get("riskLevel") == "CRITICAL"),
                "totalRoads": len(roads),
                "closedRoads": sum(1 for r in roads if "CLOSED" in r.get("status", "")),
                "totalDrainageNodes": len(drain_nodes),
                "chokedDrains": sum(1 for d in drain_nodes if d.get("status") == "CHOKED")
            }
        }
