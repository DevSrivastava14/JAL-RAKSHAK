import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database.connection import DatabaseManager
from app.database.seed import seed_all


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_database():
    """Ensure database connection and seed data are initialized for testing."""
    await DatabaseManager.connect()
    await seed_all()
    yield
    await DatabaseManager.disconnect()


@pytest_asyncio.fixture
async def client():
    """Async HTTP test client for FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
