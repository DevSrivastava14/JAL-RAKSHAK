# JALRAKSHAK Backend & AI/ML Platform

**National Urban Flood Prediction, Nowcasting, Explainable AI, Early Warning, Simulation and Safe-Route Recommendation Platform**  
*Built for the Smart India Hackathon (SIH)*

---

## 🌊 Architecture Overview

JALRAKSHAK implements a closed-loop urban disaster response pipeline:

$$\text{OBSERVE} \longrightarrow \text{PREDICT} \longrightarrow \text{EXPLAIN} \longrightarrow \text{WARN} \longrightarrow \text{SIMULATE} \longrightarrow \text{ASSESS IMPACT} \longrightarrow \text{RECOMMEND SAFE ACTION}$$

```
                          ┌────────────────────────────┐
                          │   React-Leaflet Frontend   │
                          └──────────────┬─────────────┘
                                         │  HTTP / REST (CORS)
                                         ▼
                          ┌────────────────────────────┐
                          │   FastAPI Gateway (/v1)    │
                          └──────────────┬─────────────┘
                                         │
       ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
       ▼                  ▼              ▼              ▼                  ▼
┌──────────────┐   ┌─────────────┐┌─────────────┐┌─────────────┐    ┌─────────────┐
│ Cities/Zones │   │ 0–6h Nowcast││ Explainable ││ Early Warn  │    │ Hydrodynamic│
│ & Telemetry  │   │  ML Engine  ││  AI (XAI)   ││   Alerts    │    │ Simulation  │
└──────┬───────┘   └──────┬──────┘└──────┬──────┘└──────┬──────┘    └──────┬──────┘
       │                  │              │              │                  │
       └──────────────────┴──────────────┼──────────────┴──────────────────┘
                                         ▼
                          ┌────────────────────────────┐
                          │  Safe Route Recommendation │
                          │   (Hazard Penalty Engine)  │
                          └──────────────┬─────────────┘
                                         ▼
                          ┌────────────────────────────┐
                          │ Async Motor MongoDB Driver │
                          │ (In-Memory Fallback Engine)│
                          └────────────────────────────┘
```

---

## 🚀 Key Features

1. **Multi-City Support**: Comprehensive disaster monitoring profiles across 10 Indian cities (**Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Guwahati, Patna**).
2. **0–6 Hour Flood Nowcasting**: Spatial-temporal deep learning architecture with deterministic hydrodynamic fallback modeling rainfall intensity, duration, topography, and drainage limits.
3. **Explainable AI (XAI)**: Feature attribution detailing the exact percentage impact and directional contribution of 7 key environmental risk factors.
4. **Early Warning & Alerting**: CAP-formatted emergency alert engine with automated severity calculation (`CRITICAL`, `HIGH`, `WARNING`, `ADVISORY`, `INFO`).
5. **Interactive Flood Map (GeoJSON)**: Standards-compliant GeoJSON FeatureCollections ready for React-Leaflet GIS layers.
6. **Drainage & Infrastructure Exposure**: Siltation tracking, pump station status, and interactive SCADA pump toggle controls.
7. **What-If Flood Simulation**: Real-time hydrodynamic solver computing inundated surface area, submerged roads, critical asset exposure, and action SOPs.
8. **Safe Route Navigation**: Dynamic routing algorithm penalizing flooded underpasses and high-water corridors to recommend elevated green corridors.

---

## 🛠️ Technology Stack

- **Framework**: Python 3.10+ / FastAPI
- **Data Validation & Modeling**: Pydantic v2 & Pydantic-Settings
- **Database**: MongoDB with Motor (Async Driver) + Resilient In-Memory Fallback
- **Server**: Uvicorn ASGI Server
- **Testing**: Pytest & Pytest-Asyncio with HTTPX

---

## 📂 Project Structure

```
SIH BACKEND/
├── app/
│   ├── main.py                     # FastAPI application setup, CORS, lifespan
│   ├── config.py                   # Pydantic BaseSettings environment config
│   ├── database/
│   │   ├── connection.py           # Async Motor connection + In-Memory Fallback
│   │   └── seed.py                 # Multi-city seed data generator
│   ├── schemas/                    # Pydantic request/response schemas
│   │   ├── city.py
│   │   ├── prediction.py
│   │   ├── alert.py
│   │   ├── flood_map.py
│   │   ├── drainage.py
│   │   ├── infrastructure.py
│   │   ├── simulation.py
│   │   └── route.py
│   ├── ml/                         # Modular ML & XAI Engine
│   │   ├── base.py                 # Abstract base classes
│   │   ├── mock_engine.py          # Deterministic hydrodynamic nowcasting
│   │   └── xai_explainer.py        # 7-factor attribution explainer
│   ├── services/                   # Business logic service layer
│   │   ├── city_service.py
│   │   ├── prediction_service.py
│   │   ├── xai_service.py
│   │   ├── alert_service.py
│   │   ├── map_service.py
│   │   ├── infrastructure_service.py
│   │   ├── simulation_service.py
│   │   └── routing_service.py
│   ├── routes/                     # REST API versioned endpoints (/api/v1)
│   │   ├── cities.py
│   │   ├── predictions.py
│   │   ├── alerts.py
│   │   ├── flood_map.py
│   │   ├── drainage.py
│   │   ├── infrastructure.py
│   │   ├── simulation.py
│   │   └── routes.py
│   └── tests/                      # Automated test suite (29 test cases)
├── .env.example                    # Environment template
├── requirements.txt                # Python package dependencies
├── run.py                          # Server launcher
└── README.md                       # Documentation
```

---

## ⚙️ Installation & Setup

### 1. Create and Activate Virtual Environment

```bash
cd "SIH BACKEND"
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default settings in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=jalrakshak_db
API_V1_PREFIX=/api/v1
ENVIRONMENT=development
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

---

## 🏃 Running the Backend

### Start Server
```bash
python run.py
# or
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Once running:
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 📡 API Endpoints Reference

All endpoints are versioned under `/api/v1/`:

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Cities** | `GET` | `/api/v1/cities` | List all 10 monitored cities |
| | `GET` | `/api/v1/cities/{city_id}` | Get city disaster profile |
| | `GET` | `/api/v1/cities/{city_id}/overview` | Live disaster command overview |
| | `GET` | `/api/v1/cities/{city_id}/zones` | List municipal wards & catchments |
| | `GET` | `/api/v1/cities/{city_id}/zones/{zone_id}` | Get specific zone details |
| **Nowcasting** | `GET` | `/api/v1/predictions` | 0–6h nowcasts for city zones |
| | `GET` | `/api/v1/predictions/{zone_id}` | 0–6h hydrograph curve for zone |
| **Explainable AI** | `GET` | `/api/v1/predictions/{zone_id}/explanation` | 7-factor attribution breakdown |
| **Alerts** | `GET` | `/api/v1/alerts` | List all emergency flood alerts |
| | `GET` | `/api/v1/alerts/active` | Get active alerts & warnings |
| | `GET` | `/api/v1/alerts/{alert_id}` | Get CAP alert by ID |
| | `POST` | `/api/v1/alerts/dispatch` | Broadcast emergency alert |
| **Flood Map** | `GET` | `/api/v1/flood-map/{city_id}` | GeoJSON FeatureCollection overlay |
| **Drainage** | `GET` | `/api/v1/drainage/{city_id}` | Siltation and outfall nodes |
| **Infrastructure**| `GET` | `/api/v1/infrastructure/{city_id}` | Monitored public infrastructure |
| | `GET` | `/api/v1/infrastructure/affected` | Assets above flood threshold |
| | `POST` | `/api/v1/infrastructure/{infra_id}/pump-toggle` | Toggle SCADA pump units |
| **Simulation** | `GET` | `/api/v1/simulation/scenarios` | Disaster scenario presets |
| | `POST` | `/api/v1/simulation` | Run what-if hydrodynamic solver |
| | `GET` | `/api/v1/simulation/{simulation_id}` | Retrieve simulation results |
| **Safe Routes** | `POST` | `/api/v1/routes/safe` | Compute flood-aware safe paths |
| | `GET` | `/api/v1/routes/locations/{city_id}` | Routing landmark nodes |
| | `GET` | `/api/v1/routes/hazards/{city_id}` | Active road flood hazards |

---

## 🧪 Automated Testing

The backend includes a comprehensive Pytest test suite covering all routes, services, XAI attributions, simulation solvers, and validation error handlers:

```bash
"SIH BACKEND/venv/bin/pytest" "SIH BACKEND/app/tests" -v
```

All 29 tests pass with 100% success rate:
```
SIH BACKEND/app/tests/test_alerts.py ................ [PASSED]
SIH BACKEND/app/tests/test_cities.py ................ [PASSED]
SIH BACKEND/app/tests/test_drainage_infra.py ........ [PASSED]
SIH BACKEND/app/tests/test_flood_map.py ............. [PASSED]
SIH BACKEND/app/tests/test_predictions.py .......... [PASSED]
SIH BACKEND/app/tests/test_safe_routes.py .......... [PASSED]
SIH BACKEND/app/tests/test_simulation.py ........... [PASSED]
SIH BACKEND/app/tests/test_validation_errors.py ..... [PASSED]
SIH BACKEND/app/tests/test_xai.py .................. [PASSED]
======================== 29 passed in 2.25s ========================
```

---

## 🌐 Frontend Integration

The frontend inside `SIH FRONTEND/` connects to the backend through a centralized `apiClient.js` service:

- Configure `VITE_API_BASE_URL` in `SIH FRONTEND/.env`:
  ```env
  VITE_API_BASE_URL=http://localhost:8000/api/v1
  ```
- **Zero-Downtime Fallback**: If the backend is disconnected during local development or offline presentations, `floodService.js` automatically falls back to local datasets without crashing UI components.

---

## 🤖 Future ML & Real-Data Integration Roadmap

1. **Replaceable ML Model**: Subclass `BasePredictionEngine` in `app/ml/base.py` to connect trained PyTorch / TensorFlow spatio-temporal graph models (e.g. ST-GNN, TGCN, ConvLSTM) directly to `predict_zone_nowcast()`.
2. **SHAP Explanations**: Subclass `BaseExplainer` in `app/ml/base.py` to compute real-time TreeSHAP values for feature importance.
3. **Live Telemetry & Radar Feeds**: Ingest IMD Doppler Radar NetCDF/HDF5 radar feeds and municipal SCADA ultrasonic water level sensor APIs into MongoDB collections via background workers.
4. **OSRM / GraphHopper**: Plug OSRM or GraphHopper routing engines into `BaseRoutingProvider` in `app/services/routing_service.py` to route on live OpenStreetMap graphs with dynamic flood polygon weight penalties.
