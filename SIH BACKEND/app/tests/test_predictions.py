import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_predictions_list(client: AsyncClient):
    response = await client.get("/api/v1/predictions?city_id=mumbai")
    assert response.status_code == 200
    data = response.json()
    assert data["city_id"] == "mumbai"
    assert "predictions" in data
    assert len(data["predictions"]) > 0
    first_pred = data["predictions"][0]
    assert "zone_id" in first_pred
    assert "floodProbability" in first_pred
    assert "severity" in first_pred
    assert "estimatedWaterDepthM" in first_pred
    assert "hourlyNowcast" in first_pred
    assert len(first_pred["hourlyNowcast"]) == 8


@pytest.mark.asyncio
async def test_get_zone_prediction(client: AsyncClient):
    response = await client.get("/api/v1/predictions/ZONE-KUR-01")
    assert response.status_code == 200
    data = response.json()
    assert data["zone_id"] == "ZONE-KUR-01"
    assert data["severity"] == "CRITICAL"
    assert data["floodProbability"] >= 80
    assert data["estimatedWaterDepthM"] >= 1.0
    assert "factors" in data
    assert "rainfall_intensity" in data["factors"]
    assert "drainage_blockage" in data["factors"]


@pytest.mark.asyncio
async def test_prediction_not_found(client: AsyncClient):
    response = await client.get("/api/v1/predictions/ZONE-NONEXISTENT")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
