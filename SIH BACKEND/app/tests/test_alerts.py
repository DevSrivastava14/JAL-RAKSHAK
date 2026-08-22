import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_alerts(client: AsyncClient):
    response = await client.get("/api/v1/alerts?city_id=mumbai")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first_alert = data[0]
    assert "severity" in first_alert
    assert "status" in first_alert
    assert "description" in first_alert


@pytest.mark.asyncio
async def test_get_active_alerts(client: AsyncClient):
    response = await client.get("/api/v1/alerts/active?city_id=mumbai")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for alert in data:
        assert alert["status"] in ["Active", "Dispatched", "Monitoring"]


@pytest.mark.asyncio
async def test_get_alert_by_id(client: AsyncClient):
    response = await client.get("/api/v1/alerts/ALT-MUM-01")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "ALT-MUM-01"
    assert data["severity"] == "CRITICAL"
    assert "triggerFactors" in data


@pytest.mark.asyncio
async def test_dispatch_new_alert(client: AsyncClient):
    payload = {
        "title": "Severe Flash Flood Warning in Dadar Underpass",
        "ward": "Dadar (F/North)",
        "location": "Dadar TT Circle",
        "severity": "CRITICAL",
        "alertType": "Flash Flood",
        "description": "High tide surcharge causing rapid ponding over 1.0m depth.",
        "rainfallMmHr": 72.0,
        "waterDepthM": 1.10,
        "floodProbability": 95,
        "affectedPopulation": 35000,
        "channels": ["SMS Broadcast", "Traffic Police Feed"],
        "actionItems": ["Barricade underpass", "Deploy turbine pumps"],
        "city_id": "mumbai"
    }
    response = await client.post("/api/v1/alerts/dispatch", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["title"] == payload["title"]
    assert data["severity"] == "CRITICAL"
    assert data["status"] == "Dispatched"
