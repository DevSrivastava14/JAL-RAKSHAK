import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_simulation_scenarios(client: AsyncClient):
    response = await client.get("/api/v1/simulation/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    scenario_ids = [s["id"] for s in data]
    assert "scen-baseline" in scenario_ids
    assert "scen-heavy" in scenario_ids


@pytest.mark.asyncio
async def test_run_simulation(client: AsyncClient):
    payload = {
        "rainfallIntensity": 85,
        "rainfallDuration": 120,
        "drainageEfficiency": 65,
        "drainageBlockage": 45,
        "pumpsOnlinePct": 80,
        "highTideM": 4.2
    }
    response = await client.post("/api/v1/simulation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "simulationId" in data
    assert "floodProbability" in data
    assert data["floodProbability"] >= 70
    assert "estimatedWaterDepthM" in data
    assert data["estimatedWaterDepthM"] >= 0.8
    assert "affectedAreaSqKm" in data
    assert "affectedRoads" in data
    assert "criticalInfraAtRisk" in data
    assert "factorAttribution" in data
    assert len(data["factorAttribution"]) == 4
    assert "comparison" in data
    assert "actionableRecommendations" in data
    assert len(data["actionableRecommendations"]) > 0

    # Test retrieving the simulation result by ID
    sim_id = data["simulationId"]
    get_res = await client.get(f"/api/v1/simulation/{sim_id}")
    assert get_res.status_code == 200
    assert get_res.json()["simulationId"] == sim_id
