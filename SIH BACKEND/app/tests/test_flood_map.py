import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_flood_map_geojson(client: AsyncClient):
    response = await client.get("/api/v1/flood-map/mumbai")
    assert response.status_code == 200
    data = response.json()
    assert data["city_id"] == "mumbai"
    assert "center" in data
    assert "zoom" in data
    assert "risk_colors" in data
    assert "geojson" in data

    geojson = data["geojson"]
    assert geojson["type"] == "FeatureCollection"
    assert "features" in geojson
    assert len(geojson["features"]) > 0

    # Validate feature types: Polygons (Zones), LineStrings (Roads), Points (Drainage/Infra)
    geom_types = {f["geometry"]["type"] for f in geojson["features"]}
    assert "Polygon" in geom_types
    assert "LineString" in geom_types
    assert "Point" in geom_types

    # Validate feature properties
    polygon_feature = next(f for f in geojson["features"] if f["geometry"]["type"] == "Polygon")
    assert "riskLevel" in polygon_feature["properties"]
    assert "floodProbability" in polygon_feature["properties"]
    assert "waterDepthM" in polygon_feature["properties"]
