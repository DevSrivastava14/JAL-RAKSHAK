from typing import List
from fastapi import APIRouter, HTTPException, status
from app.schemas.simulation import (
    SimulationRunRequest,
    SimulationPresetScenario,
    SimulationResponse
)
from app.services.simulation_service import SimulationService

router = APIRouter()


@router.get(
    "/scenarios",
    response_model=List[SimulationPresetScenario],
    summary="Get preset flood simulation scenarios",
    description="Retrieve standardized disaster scenario presets (e.g. moderate rain, intense downpour, cloudburst + tidal surge)."
)
async def list_scenarios():
    scenarios = await SimulationService.get_preset_scenarios()
    return scenarios


@router.post(
    "",
    response_model=SimulationResponse,
    summary="Run what-if hydrodynamic flood simulation",
    description="Simulate urban inundation, submerged roads, affected infrastructure, and action SOPs based on meteorological parameters."
)
async def run_simulation(sim_req: SimulationRunRequest):
    result = await SimulationService.run_simulation(sim_req.model_dump())
    return result


@router.get(
    "/{simulation_id}",
    response_model=SimulationResponse,
    summary="Get simulation results by ID",
    description="Retrieve previously executed simulation run metrics and impact assessments."
)
async def get_simulation(simulation_id: str):
    sim = await SimulationService.get_simulation_by_id(simulation_id)
    if not sim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation run '{simulation_id}' not found."
        )
    return sim
