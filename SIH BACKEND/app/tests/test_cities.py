import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_cities(client: AsyncClient):
    response = await client.get("/api/v1/cities")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 8
    city_names = [c["name"] for c in data]
    assert "Mumbai" in city_names
    assert "Delhi" in city_names
    assert "Bengaluru" in city_names
    assert "Chennai" in city_names


@pytest.mark.asyncio
async def test_get_city_by_id(client: AsyncClient):
    response = await client.get("/api/v1/cities/mumbai")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "mumbai"
    assert data["name"] == "Mumbai"
    assert data["floodRisk"] == "CRITICAL"
    assert "floodProneZones" in data
    assert len(data["floodProneZones"]) > 0


@pytest.mark.asyncio
async def test_get_city_overview(client: AsyncClient):
    response = await client.get("/api/v1/cities/mumbai/overview")
    assert response.status_code == 200
    data = response.json()
    assert "cityName" in data
    assert "overallRiskScore" in data
    assert "activeSensors" in data
    assert "activePumps" in data
    assert "rainfallStats" in data


@pytest.mark.asyncio
async def test_get_city_zones(client: AsyncClient):
    response = await client.get("/api/v1/cities/mumbai/zones")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    zone_ids = [z["id"] for z in data]
    assert "ZONE-KUR-01" in zone_ids


@pytest.mark.asyncio
async def test_get_zone_by_id(client: AsyncClient):
    response = await client.get("/api/v1/cities/mumbai/zones/ZONE-KUR-01")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "ZONE-KUR-01"
    assert data["riskLevel"] == "CRITICAL"
    assert data["floodProbability"] > 80


@pytest.mark.asyncio
async def test_city_not_found(client: AsyncClient):
    response = await client.get("/api/v1/cities/unknowncity")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert "not found" in data["error"].lower()
