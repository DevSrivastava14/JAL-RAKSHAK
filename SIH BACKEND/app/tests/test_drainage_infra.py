import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_drainage_nodes(client: AsyncClient):
    response = await client.get("/api/v1/drainage/mumbai")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first_node = data[0]
    assert "capacityM3s" in first_node
    assert "blockagePct" in first_node
    assert "status" in first_node


@pytest.mark.asyncio
async def test_get_infrastructure_assets(client: AsyncClient):
    response = await client.get("/api/v1/infrastructure/mumbai")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first_asset = data[0]
    assert "impactSeverity" in first_asset
    assert "safeThresholdM" in first_asset
    assert "operationalStatus" in first_asset


@pytest.mark.asyncio
async def test_get_affected_infrastructure(client: AsyncClient):
    response = await client.get("/api/v1/infrastructure/affected?city_id=mumbai&min_severity=HIGH")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for asset in data:
        assert asset["impactSeverity"] in ["HIGH", "CRITICAL"]


@pytest.mark.asyncio
async def test_toggle_pump_status(client: AsyncClient):
    # Test increasing active pump count
    response = await client.post("/api/v1/infrastructure/INF-PUMP-02/pump-toggle", json={"deltaActive": 1})
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "INF-PUMP-02"
    assert data["activePumps"] == 6
    assert data["status"] == "OPERATIONAL_MAX"

    # Test decreasing pump count
    response2 = await client.post("/api/v1/infrastructure/INF-PUMP-02/pump-toggle", json={"deltaActive": -2})
    assert response2.status_code == 200
    data2 = response2.json()
    assert data2["activePumps"] == 4
