import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_resources_list_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/resources")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_temporal_timeline_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/temporal/resource/RES_CALC_001/timeline")
    assert response.status_code == 200
    data = response.json()
    assert "timeline" in data

@pytest.mark.asyncio
async def test_spatial_nearby_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/spatial/nearby?latitude=13.0102&longitude=80.2354&radiusMeters=1000")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data

@pytest.mark.asyncio
async def test_graph_subject_recommendation_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/v1/graph/recommendations/subject/SUB_DBMS_501")
    assert response.status_code == 200
    data = response.json()
    assert "cypherQuery" in data

@pytest.mark.asyncio
async def test_eca_trigger_simulation_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/eca/trigger-demo?resourceId=RES_CALC_001&newStatus=available")
    assert response.status_code == 200
    data = response.json()
    assert "actionExecuted" in data

@pytest.mark.asyncio
async def test_ai_search_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/ai/search?query=Need calculator for engineering mathematics")
    assert response.status_code == 200
    data = response.json()
    assert "parsedIntent" in data
