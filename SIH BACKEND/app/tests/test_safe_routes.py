import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_routing_locations(client: AsyncClient):
    response = await client.get("/api/v1/routes/locations/mumbai")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 8
    location_names = [loc["shortName"] for loc in data]
    assert "Kurla" in location_names
    assert "Dadar" in location_names
    assert "BKC" in location_names


@pytest.mark.asyncio
async def test_get_hazards(client: AsyncClient):
    response = await client.get("/api/v1/routes/hazards/mumbai")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first_hazard = data[0]
    assert "severity" in first_hazard
    assert "desc" in first_hazard


@pytest.mark.asyncio
async def test_compute_safe_route_standard(client: AsyncClient):
    payload = {
        "start_location": "Kurla",
        "destination": "Dadar",
        "is_emergency_mode": False
    }
    response = await client.post("/api/v1/routes/safe", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["start_location"] == "Kurla"
    assert data["destination"] == "Dadar"
    assert "recommended_route" in data
    assert data["recommended_route"]["isRecommended"] is True
    assert data["recommended_route"]["floodRisk"] == "LOW"
    assert "alternative_routes" in data
    assert len(data["alternative_routes"]) > 0
    assert "all_routes" in data
    assert len(data["all_routes"]) == 3


@pytest.mark.asyncio
async def test_compute_safe_route_emergency_mode(client: AsyncClient):
    payload = {
        "start_location": "Kurla",
        "destination": "Dadar",
        "is_emergency_mode": True
    }
    response = await client.post("/api/v1/routes/safe", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_emergency_mode"] is True
    assert "Green Corridor" in data["recommended_route"]["name"]
    assert data["recommended_route"]["safetyScore"] >= 95
