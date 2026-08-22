import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["docs"] == "/docs"


@pytest.mark.asyncio
async def test_healthcheck_endpoint(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data


@pytest.mark.asyncio
async def test_validation_error_422(client: AsyncClient):
    # Missing required 'title' in alert dispatch request
    response = await client.post("/api/v1/alerts/dispatch", json={"ward": "Kurla"})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"] == "Validation Error"
    assert "validation_errors" in data
    assert len(data["validation_errors"]) > 0


@pytest.mark.asyncio
async def test_pump_toggle_invalid_delta(client: AsyncClient):
    # deltaActive must be an integer
    response = await client.post("/api/v1/infrastructure/INF-PUMP-01/pump-toggle", json={"deltaActive": "not_an_int"})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
