import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database.connection import DatabaseManager
from app.database.seed import seed_all
from app.routes import api_v1_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("jalrakshak.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB and ensure seed data is present
    logger.info("Starting up JALRAKSHAK Backend...")
    await DatabaseManager.connect()
    await seed_all()
    yield
    # Shutdown: Close connections
    logger.info("Shutting down JALRAKSHAK Backend...")
    await DatabaseManager.disconnect()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    ## JALRAKSHAK Urban Flood Prediction, Monitoring, Simulation, Alerting and Safe-Route Platform
    
    ### Core Capabilities:
    * **Cities & Zones**: Multi-city comparative disaster readiness and municipal ward monitoring.
    * **0–6 Hour Nowcasting**: Spatial-temporal deep learning and hydrodynamic flood nowcasting curves.
    * **Explainable AI (XAI)**: Feature attribution detailing why catchments are classified at risk.
    * **Early Warning Alerts**: CAP-compliant alerts with automated severity tier calculation.
    * **Interactive Flood Map**: GeoJSON layers for React-Leaflet GIS visualization.
    * **Drainage & Infrastructure**: Real-time asset exposure and pumping station SCADA controls.
    * **What-If Simulation**: Dynamic meteorological and hydraulic parametric solver.
    * **Safe Route Navigation**: Dynamic route recommendation avoiding submerged corridors.
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": request.url.path,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        errors.append({
            "field": " -> ".join(str(x) for x in err.get("loc", [])),
            "message": err.get("msg"),
            "type": err.get("type")
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "validation_errors": errors,
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "path": request.url.path,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "An internal server error occurred.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "path": request.url.path,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


# Root & Health Check Endpoints
@app.get("/", tags=["System"])
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/docs",
        "api_v1": f"{settings.API_V1_PREFIX}",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/health", tags=["System"])
async def health_check():
    db = DatabaseManager.get_db()
    db_status = "in_memory_fallback" if DatabaseManager.is_fallback else "mongodb_connected"
    return {
        "status": "healthy",
        "database": db_status,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# Include API v1 Router
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)
