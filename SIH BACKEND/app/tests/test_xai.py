import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_zone_xai_explanation(client: AsyncClient):
    response = await client.get("/api/v1/predictions/ZONE-KUR-01/explanation")
    assert response.status_code == 200
    data = response.json()
    assert data["zone_id"] == "ZONE-KUR-01"
    assert "factors" in data
    assert "xai_factors" in data
    assert len(data["xai_factors"]) >= 5
    
    # Check 7 key factor keys
    factors = data["factors"]
    assert "rainfall_intensity" in factors
    assert "rainfall_duration" in factors
    assert "drainage_capacity" in factors
    assert "drainage_blockage" in factors
    assert "elevation" in factors
    assert "impervious_surface" in factors
    assert "historical_flood_tendency" in factors

    # Check XAI cards structure
    first_factor = data["xai_factors"][0]
    assert "name" in first_factor
    assert "contributionPct" in first_factor
    assert "impactDirection" in first_factor
    assert "explanation" in first_factor
    assert "summary_explanation" in data
