from datetime import datetime, timezone
from typing import Any, Dict, Optional
from app.database.connection import get_database
from app.ml.mock_engine import DeterministicRulePredictionEngine
from app.ml.xai_explainer import FactorAttributionExplainer


class XAIService:
    def __init__(self):
        self.prediction_engine = DeterministicRulePredictionEngine()
        self.explainer = FactorAttributionExplainer()

    async def get_zone_explanation(self, zone_id: str, env_params: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        db = get_database()
        zone = await db["zones"].find_one({"id": zone_id})
        if not zone:
            return None

        env_params = env_params or {}
        prediction = self.prediction_engine.predict_zone_nowcast(zone, env_params)
        explanation = self.explainer.explain_prediction(zone, prediction)

        return {
            "zone_id": zone_id,
            "zone_name": zone.get("name", "Catchment Zone"),
            "city_id": zone.get("city_id", "mumbai"),
            "severity": prediction.get("severity", "MODERATE"),
            "flood_probability": prediction.get("flood_probability", 0.5),
            "prediction_confidence": prediction.get("prediction_confidence", 0.9),
            "factors": explanation["factors"],
            "xai_factors": explanation["xai_factors"],
            "summary_explanation": explanation["summary_explanation"],
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
