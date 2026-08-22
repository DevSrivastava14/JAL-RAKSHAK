from abc import ABC, abstractmethod
from typing import Any, Dict, List


class BasePredictionEngine(ABC):
    """
    Abstract base class for flood prediction engines.
    Future trained deep learning models (e.g. ST-GNN, ConvLSTM, XGBoost)
    will subclass this interface without modifying the API layer.
    """
    @abstractmethod
    def predict_zone_nowcast(self, zone_data: Dict[str, Any], env_params: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a 0-6 hour nowcast prediction for a specific catchment zone."""
        pass

    @abstractmethod
    def batch_predict_city(self, zones: List[Dict[str, Any]], city_params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Run batch inference for all zones in a metropolitan region."""
        pass


class BaseExplainer(ABC):
    """
    Abstract base class for Explainable AI (XAI) feature attribution.
    Can be backed by heuristic feature weights or SHAP (SHapley Additive exPlanations).
    """
    @abstractmethod
    def explain_prediction(self, zone_data: Dict[str, Any], prediction_result: Dict[str, Any]) -> Dict[str, Any]:
        """Compute feature importance attribution explaining why a zone is classified at risk."""
        pass
