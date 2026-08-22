from typing import Any, Dict, List
from app.ml.base import BaseExplainer


class FactorAttributionExplainer(BaseExplainer):
    """
    Explainable AI (XAI) feature attribution engine.
    Calculates feature contribution percentages, impact directions,
    and descriptive rationale. Drop-in compatible with future SHAP model explainers.
    """
    def explain_prediction(self, zone_data: Dict[str, Any], prediction_result: Dict[str, Any]) -> Dict[str, Any]:
        rainfall_intensity = float(prediction_result.get("currentRainfall", 50.0))
        elevation_amsl = float(zone_data.get("elevationAMSL", 3.0))
        drainage_capacity = float(zone_data.get("drainageCapacityLPS", 20000.0))
        drainage_blockage = float(zone_data.get("drainageBlockagePct", 35.0))
        impervious_pct = float(zone_data.get("imperviousPct", 85.0))
        historical_breaches = int(zone_data.get("historicalInundations5Yr", 5))
        
        # Raw weights computation
        w_rain_intensity = (rainfall_intensity / 100.0) * 2.5
        w_duration = 1.2
        w_elevation = max(0.2, (7.0 - min(7.0, elevation_amsl)) / 4.0) * 1.8
        w_drain_blockage = (drainage_blockage / 100.0) * 2.0
        w_drain_capacity = max(0.3, (35000.0 - drainage_capacity) / 25000.0) * 1.4
        w_impervious = (impervious_pct / 100.0) * 0.9
        w_history = min(1.5, (historical_breaches / 15.0) * 1.0)

        total_weight = (
            w_rain_intensity + w_duration + w_elevation + 
            w_drain_blockage + w_drain_capacity + w_impervious + w_history
        ) or 1.0

        # Normalized feature contributions for API (sum to ~1.0)
        factors_normalized = {
            "rainfall_intensity": round(w_rain_intensity / total_weight, 2),
            "drainage_blockage": round(w_drain_blockage / total_weight, 2),
            "rainfall_duration": round(w_duration / total_weight, 2),
            "elevation": round(w_elevation / total_weight, 2),
            "drainage_capacity": round(w_drain_capacity / total_weight, 2),
            "impervious_surface": round(w_impervious / total_weight, 2),
            "historical_flood_tendency": round(w_history / total_weight, 2)
        }

        # Percentage contributions (sum to 100%)
        p_rain = int(round((w_rain_intensity / total_weight) * 100))
        p_block = int(round((w_drain_blockage / total_weight) * 100))
        p_dur = int(round((w_duration / total_weight) * 100))
        p_elev = int(round((w_elevation / total_weight) * 100))
        p_cap = int(round((w_drain_capacity / total_weight) * 100))
        p_imp = int(round((w_impervious / total_weight) * 100))
        p_hist = max(1, 100 - (p_rain + p_block + p_dur + p_elev + p_cap + p_imp))

        # Build structured XAI factor cards
        xai_factors = [
            {
                "id": "factor-rain-intensity",
                "name": "Rainfall Intensity",
                "value": f"{rainfall_intensity:.1f} mm/h",
                "contributionPct": p_rain,
                "severity": "CRITICAL" if rainfall_intensity >= 60 else ("HIGH" if rainfall_intensity >= 45 else "MODERATE"),
                "statusColor": "#ff334b" if rainfall_intensity >= 60 else ("#ff7700" if rainfall_intensity >= 45 else "#ffcc00"),
                "impactDirection": "INCREASES_RISK",
                "explanation": f"Precipitation rate of {rainfall_intensity:.1f} mm/h {'exceeds local stormwater conduit capacity by >200%' if rainfall_intensity >= 60 else 'generates heavy localized surface runoff'}."
            },
            {
                "id": "factor-drain-blockage",
                "name": "Drainage Blockage & Siltation",
                "value": f"{drainage_blockage:.0f}% Choked / Silted",
                "contributionPct": p_block,
                "severity": "CRITICAL" if drainage_blockage >= 60 else ("HIGH" if drainage_blockage >= 40 else "MODERATE"),
                "statusColor": "#ff334b" if drainage_blockage >= 60 else ("#ff7700" if drainage_blockage >= 40 else "#ffcc00"),
                "impactDirection": "INCREASES_RISK",
                "explanation": f"Heavy sediment and debris deposits restrict stormwater discharge by {drainage_blockage:.0f}%."
            },
            {
                "id": "factor-rain-duration",
                "name": "Rainfall Duration",
                "value": "Sustained Monsoon Inflow",
                "contributionPct": p_dur,
                "severity": "HIGH",
                "statusColor": "#ff7700",
                "impactDirection": "INCREASES_RISK",
                "explanation": "Continuous storm duration saturates catchment soil infiltration and natural drainage sumps."
            },
            {
                "id": "factor-elevation",
                "name": "Elevation & Topography",
                "value": f"{elevation_amsl:.1f}m AMSL ({'Depression' if elevation_amsl < 3.0 else 'Slope'})",
                "contributionPct": p_elev,
                "severity": "CRITICAL" if elevation_amsl < 2.2 else ("HIGH" if elevation_amsl < 3.5 else "LOW"),
                "statusColor": "#ff334b" if elevation_amsl < 2.2 else ("#ff7700" if elevation_amsl < 3.5 else "#10b981"),
                "impactDirection": "INCREASES_RISK" if elevation_amsl < 3.5 else "REDUCES_RISK",
                "explanation": f"{'Low-lying topographic depression pools gravity runoff from surrounding areas' if elevation_amsl < 3.5 else 'Favorable elevation gradient accelerates natural gravity runoff'}."
            },
            {
                "id": "factor-drain-capacity",
                "name": "Drainage Capacity",
                "value": f"{drainage_capacity:,.0f} LPS",
                "contributionPct": p_cap,
                "severity": "WARNING" if drainage_capacity < 22000 else "SAFE",
                "statusColor": "#ffaa00" if drainage_capacity < 22000 else "#10b981",
                "impactDirection": "INCREASES_RISK" if drainage_capacity < 22000 else "REDUCES_RISK",
                "explanation": f"{'Receiving storm outfalls experiencing high hydraulic surcharge' if drainage_capacity < 22000 else 'Adequate stormwater pumping and channel throughput'}."
            },
            {
                "id": "factor-impervious",
                "name": "Impervious Surface Fraction",
                "value": f"{impervious_pct:.0f}% Built-up / Concrete",
                "contributionPct": p_imp,
                "severity": "MODERATE",
                "statusColor": "#ffcc00",
                "impactDirection": "INCREASES_RISK",
                "explanation": f"Dense urban pavement converts {impervious_pct:.0f}% of gross rainfall into immediate surface runoff."
            },
            {
                "id": "factor-history",
                "name": "Historical Flood Tendency",
                "value": f"{historical_breaches} Inundations / 5 Yrs",
                "contributionPct": p_hist,
                "severity": "MODERATE" if historical_breaches >= 5 else "LOW",
                "statusColor": "#ffcc00" if historical_breaches >= 5 else "#10b981",
                "impactDirection": "INCREASES_RISK",
                "explanation": f"Historical spatial vulnerability prior ({historical_breaches} events in 5 yrs) confirms susceptibility."
            }
        ]

        # Sort factors by contribution percentage descending
        xai_factors.sort(key=lambda f: f["contributionPct"], reverse=True)

        zone_name = zone_data.get("name", "Zone")
        summary_explanation = (
            f"{zone_name} is under elevated flood risk primarily due to {xai_factors[0]['name'].lower()} "
            f"({xai_factors[0]['contributionPct']}% attribution) and {xai_factors[1]['name'].lower()} "
            f"({xai_factors[1]['contributionPct']}% attribution)."
        )

        return {
            "factors": factors_normalized,
            "xai_factors": xai_factors,
            "summary_explanation": summary_explanation
        }
