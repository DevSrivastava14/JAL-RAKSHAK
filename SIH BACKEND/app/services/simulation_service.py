import math
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.database.connection import get_database

ALL_ROADS_CATALOG = [
    {
        "id": "RD-LBS",
        "name": "L.B.S. Marg (Kurla to Ghatkopar)",
        "zone": "Central Corridor",
        "baseThresholdM": 0.35,
        "criticalThresholdM": 0.80,
        "normalCapacityKmh": 45,
        "detourRoute": "Eastern Express Highway (EEH)"
    },
    {
        "id": "RD-HINDMATA",
        "name": "Dr. B.A. Road (Hindmata & Dadar TT)",
        "zone": "South-Central Lowland",
        "baseThresholdM": 0.30,
        "criticalThresholdM": 0.70,
        "normalCapacityKmh": 50,
        "detourRoute": "Lalbaug Flyover Overhead Corridor"
    },
    {
        "id": "RD-MILAN",
        "name": "Milan Subway (Santacruz - Khar)",
        "zone": "Western Suburbs",
        "baseThresholdM": 0.25,
        "criticalThresholdM": 0.60,
        "normalCapacityKmh": 40,
        "detourRoute": "Milan Flyover Bridge"
    },
    {
        "id": "RD-ANDHERI",
        "name": "Andheri Subway & S.V. Road Underpass",
        "zone": "Western Suburbs",
        "baseThresholdM": 0.25,
        "criticalThresholdM": 0.55,
        "normalCapacityKmh": 35,
        "detourRoute": "Gokhale Bridge & Western Express Highway"
    },
    {
        "id": "RD-SION",
        "name": "Sion Circle & Gandhi Market Arterial",
        "zone": "Central Sump",
        "baseThresholdM": 0.30,
        "criticalThresholdM": 0.65,
        "normalCapacityKmh": 45,
        "detourRoute": "Sion-Bandra Link Road"
    },
    {
        "id": "RD-BKC",
        "name": "BKC Connector & Kalanagar Junction",
        "zone": "Commercial Hub",
        "baseThresholdM": 0.45,
        "criticalThresholdM": 0.90,
        "normalCapacityKmh": 60,
        "detourRoute": "Bandra Reclamation Expressway"
    }
]

ALL_INFRA_CATALOG = [
    {
        "id": "INF-HOSP-SION",
        "name": "Lokmanya Tilak Municipal Hospital (Sion)",
        "type": "CRITICAL_HEALTHCARE",
        "thresholdDepthM": 0.45,
        "vulnerabilityNote": "Ground access road & casualty ward ingress risk."
    },
    {
        "id": "INF-RAIL-CR",
        "name": "Central Railway Mainline Tracks (Sion-Kurla)",
        "type": "TRANSIT_LIFELINE",
        "thresholdDepthM": 0.20,
        "vulnerabilityNote": "Track submersion above 4 inches requires speed reduction to 20 kmph."
    },
    {
        "id": "INF-PUMP-BRIT",
        "name": "Britannia Stormwater Pumping Station Sump",
        "type": "DRAINAGE_FACILITY",
        "thresholdDepthM": 0.60,
        "vulnerabilityNote": "Intake culvert surcharge exceeding gravitational discharge limit."
    },
    {
        "id": "INF-ELEC-KURLA",
        "name": "Kurla 33kV Power Distribution Substation",
        "type": "POWER_GRID",
        "thresholdDepthM": 0.50,
        "vulnerabilityNote": "Feeder switchgear tripping risk if flood wall breaches."
    },
    {
        "id": "INF-HOSP-BHABHA",
        "name": "Bhabha Municipal General Hospital",
        "type": "CRITICAL_HEALTHCARE",
        "thresholdDepthM": 0.40,
        "vulnerabilityNote": "Low-lying entrance requires deployable flood barrier gates."
    }
]


class SimulationService:
    @staticmethod
    async def get_preset_scenarios() -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db["simulation_scenarios"].find({})
        scenarios = await cursor.to_list(length=50)
        return scenarios

    @staticmethod
    async def run_simulation(params_dict: Dict[str, Any]) -> Dict[str, Any]:
        rainfall_intensity = float(params_dict.get("rainfallIntensity") or 75.0)
        rainfall_duration = float(params_dict.get("rainfallDuration") or 120.0)
        drainage_efficiency = float(params_dict.get("drainageEfficiency") or 70.0)
        drainage_blockage = float(params_dict.get("drainageBlockage") or 40.0)
        pumps_online_pct = float(params_dict.get("pumpsOnlinePct") or 90.0)
        high_tide_m = float(params_dict.get("highTideM") or 3.6)

        # 1. Total rainfall accumulation (mm)
        duration_hours = rainfall_duration / 60.0
        total_rainfall_mm = rainfall_intensity * duration_hours

        # 2. Net effective drainage capacity factor
        effective_efficiency = (drainage_efficiency / 100.0) * (1.0 - (drainage_blockage / 100.0) * 0.9)
        pump_factor = max(0.4, pumps_online_pct / 100.0)
        tide_factor = max(1.0, high_tide_m / 3.2)
        clamped_effective = max(0.06, (effective_efficiency * pump_factor) / tide_factor)

        # 3. Composite Hydrodynamic Severity Index
        hydro_severity = (math.pow(rainfall_intensity / 40.0, 1.25) * math.pow(duration_hours, 0.65)) / math.pow(clamped_effective, 0.85)

        # 4. Metrics
        raw_prob = min(99, max(5, int(round(15 + (hydro_severity * 24)))))
        flood_probability = raw_prob

        estimated_water_depth_m = float(round(min(2.85, max(0.04, 0.12 * math.pow(hydro_severity, 1.15))), 2))
        affected_area_sq_km = float(round(min(52.0, max(0.8, 4.2 * math.pow(hydro_severity, 1.1))), 1))
        drainage_overload_pct = min(100, int(round(min(250, hydro_severity * 45))))

        # 5. Onset Time
        if rainfall_intensity >= 90 or hydro_severity >= 3.5:
            time_to_flooding = "Immediate (Active Inundation)"
        elif hydro_severity >= 2.2:
            onset = max(10, int(round(45 / math.sqrt(hydro_severity))))
            time_to_flooding = f"T+{onset} mins"
        elif hydro_severity >= 1.2:
            onset = max(25, int(round(75 / math.sqrt(hydro_severity))))
            time_to_flooding = f"T+{onset} mins"
        elif hydro_severity >= 0.6:
            onset = int(round(120 / math.sqrt(hydro_severity)))
            time_to_flooding = f"T+{onset} mins (~{(onset / 60.0):.1f} hrs)"
        else:
            time_to_flooding = "> 3 Hours (Safe Buffer)"

        # 6. Affected Roads
        affected_roads = []
        for road in ALL_ROADS_CATALOG:
            r_depth = round(min(2.2, estimated_water_depth_m * (road["baseThresholdM"] / 0.3)), 2)
            if r_depth >= road["criticalThresholdM"]:
                status = "SUBMERGED_CLOSED"
                status_label = "Submerged & Barricaded"
                speed = 0
            elif r_depth >= road["baseThresholdM"]:
                status = "WATERLOGGED_SLOW"
                status_label = "Waterlogged (Slow)"
                speed = max(10, int(round(road["normalCapacityKmh"] * 0.3)))
            else:
                status = "CLEAR_OPEN"
                status_label = "Clear & Open"
                speed = road["normalCapacityKmh"]

            if r_depth >= 0.15 or hydro_severity > 1.0:
                affected_roads.append({
                    **road,
                    "currentDepthM": r_depth,
                    "status": status,
                    "statusLabel": status_label,
                    "currentSpeedKmh": speed
                })

        # 7. Critical Infrastructure
        critical_infra = []
        for infra in ALL_INFRA_CATALOG:
            is_at_risk = estimated_water_depth_m >= infra["thresholdDepthM"]
            severity_tier = "CRITICAL_RISK" if estimated_water_depth_m >= infra["thresholdDepthM"] * 1.5 else ("HIGH_RISK" if is_at_risk else "SAFE")
            critical_infra.append({
                **infra,
                "isAtRisk": is_at_risk,
                "severityTier": severity_tier,
                "waterDepthAroundAssetM": round(min(2.0, estimated_water_depth_m * 0.9), 2)
            })

        # 8. Factor Attribution
        w_int = (rainfall_intensity / 150.0) * 1.4
        w_dur = (rainfall_duration / 360.0) * 1.0
        w_blk = (drainage_blockage / 100.0) * 1.2
        w_eff = ((100.0 - drainage_efficiency) / 90.0) * 0.9
        total_w = (w_int + w_dur + w_blk + w_eff) or 1.0

        factor_attribution = [
            {
                "factorName": "Rainfall Intensity",
                "contributionPct": int(round((w_int / total_w) * 100)),
                "color": "#ff334b",
                "description": f"{rainfall_intensity:.0f} mm/h precipitation exceeds standard sewer velocity."
            },
            {
                "factorName": "Drainage Siltation & Blockage",
                "contributionPct": int(round((w_blk / total_w) * 100)),
                "color": "#ff7700",
                "description": f"{drainage_blockage:.0f}% cross-sectional obstruction reduces discharge throughput."
            },
            {
                "factorName": "Storm Duration",
                "contributionPct": int(round((w_dur / total_w) * 100)),
                "color": "#00b4d8",
                "description": f"{rainfall_duration:.0f} mins duration accumulates {total_rainfall_mm:.0f}mm total volume."
            },
            {
                "factorName": "Reduced Drainage Efficiency",
                "contributionPct": int(round((w_eff / total_w) * 100)),
                "color": "#ffcc00",
                "description": f"{100.0 - drainage_efficiency:.0f}% efficiency loss from pipe degradation & backflow."
            }
        ]

        # 9. Risk Tier
        if flood_probability >= 80 or estimated_water_depth_m >= 1.0:
            risk_tier = "CRITICAL"
        elif flood_probability >= 60 or estimated_water_depth_m >= 0.5:
            risk_tier = "HIGH"
        elif flood_probability >= 40 or estimated_water_depth_m >= 0.25:
            risk_tier = "MODERATE"
        else:
            risk_tier = "LOW"

        # 10. Recommendations
        recommendations = []
        if risk_tier == "CRITICAL":
            recommendations.extend([
                "Issue Red Alert broadcast for low-lying urban catchments.",
                "Deploy auxiliary diesel high-head submersible pumps to railway underpasses.",
                "Activate emergency green corridors for critical hospital trauma ambulances.",
                "Order closure of subways with water depth exceeding 0.3 meters."
            ])
        elif risk_tier == "HIGH":
            recommendations.extend([
                "Post traffic police diversion warnings at arterial highway junctions.",
                "Engage standby pumping turbines to maintain intake sump drawdown.",
                "Inspect trash racks at primary drainage outfalls for plastic blockages."
            ])
        elif risk_tier == "MODERATE":
            recommendations.extend([
                "Monitor live IoT ultrasonic gauges for rapid water level rise.",
                "Alert municipal ward disaster control cells for localized clearing."
            ])
        else:
            recommendations.append("Standard routine telemetry monitoring. No immediate emergency deployment required.")

        sim_id = f"SIM-{int(datetime.now(timezone.utc).timestamp() * 1000) % 1000000:06d}"

        result = {
            "simulationId": sim_id,
            "simulation_id": sim_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "params": {
                "rainfallIntensity": rainfall_intensity,
                "rainfallDuration": rainfall_duration,
                "drainageEfficiency": drainage_efficiency,
                "drainageBlockage": drainage_blockage,
                "pumpsOnlinePct": pumps_online_pct,
                "highTideM": high_tide_m
            },
            "riskTier": risk_tier,
            "severity": risk_tier,
            "floodProbability": flood_probability,
            "flood_probability": round(flood_probability / 100.0, 2),
            "estimatedWaterDepthM": estimated_water_depth_m,
            "estimated_water_depth": estimated_water_depth_m,
            "affectedAreaSqKm": affected_area_sq_km,
            "submerged_area": affected_area_sq_km,
            "drainageOverloadPct": drainage_overload_pct,
            "estimatedTimeToFlooding": time_to_flooding,
            "time_to_flooding": time_to_flooding,
            "totalRainfallMm": round(total_rainfall_mm, 1),
            "affectedRoads": affected_roads,
            "affected_infrastructure": critical_infra,
            "criticalInfraAtRisk": critical_infra,
            "factorAttribution": factor_attribution,
            "comparison": {
                "baseline": {
                    "floodProbability": 22,
                    "estimatedWaterDepthM": 0.15,
                    "affectedAreaSqKm": 3.4,
                    "affectedRoadsCount": 0,
                    "drainageOverloadPct": 28,
                    "riskTier": "LOW"
                },
                "simulated": {
                    "floodProbability": flood_probability,
                    "estimatedWaterDepthM": estimated_water_depth_m,
                    "affectedAreaSqKm": affected_area_sq_km,
                    "affectedRoadsCount": sum(1 for r in affected_roads if r.get("status") != "CLEAR_OPEN"),
                    "drainageOverloadPct": drainage_overload_pct
                },
                "deltas": {
                    "probDelta": flood_probability - 22,
                    "depthDelta": round(estimated_water_depth_m - 0.15, 2),
                    "areaDelta": round(affected_area_sq_km - 3.4, 1),
                    "roadsDelta": sum(1 for r in affected_roads if r.get("status") != "CLEAR_OPEN")
                }
            },
            "actionableRecommendations": recommendations
        }

        # Save to database
        db = get_database()
        await db["simulation_results"].insert_one(result)
        return result

    @staticmethod
    async def get_simulation_by_id(simulation_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        result = await db["simulation_results"].find_one({"simulationId": simulation_id})
        if not result:
            result = await db["simulation_results"].find_one({"simulation_id": simulation_id})
        return result
