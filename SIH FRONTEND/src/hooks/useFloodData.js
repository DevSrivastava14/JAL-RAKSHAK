// JALRAKSHAK Custom Hooks for state management & live simulated polling
import { useState, useEffect, useCallback } from 'react';
import { floodService } from '../services/floodService';

export function useCityOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const data = await floodService.getCityOverview();
      setOverview(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load overview');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    // Simulate real-time 30-sec refresh
    const interval = setInterval(fetchOverview, 30000);
    return () => clearInterval(interval);
  }, [fetchOverview]);

  return { overview, loading, error, refresh: fetchOverview };
}

export function useWards() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [riskFilter, setRiskFilter] = useState('ALL');

  const fetchWards = useCallback(async () => {
    try {
      setLoading(true);
      const data = await floodService.getWards();
      setWards(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  const filteredWards = wards.filter(ward => {
    if (riskFilter === 'ALL') return true;
    return ward.riskLevel === riskFilter;
  });

  const selectedWard = wards.find(w => w.id === selectedWardId) || wards[0] || null;

  return {
    wards: filteredWards,
    allWards: wards,
    loading,
    selectedWard,
    selectedWardId,
    setSelectedWardId,
    riskFilter,
    setRiskFilter,
    refresh: fetchWards
  };
}

export function useSensors() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  const fetchSensors = useCallback(async () => {
    try {
      const data = await floodService.getSensors();
      setSensors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSensors();
    // Live sensor telemetry stream jitter every 5 seconds
    const interval = setInterval(fetchSensors, 5000);
    return () => clearInterval(interval);
  }, [fetchSensors]);

  const filteredSensors = sensors.filter(sensor => {
    if (filterType === 'ALL') return true;
    return sensor.type === filterType || sensor.status === filterType;
  });

  return {
    sensors: filteredSensors,
    allSensors: sensors,
    loading,
    filterType,
    setFilterType,
    refresh: fetchSensors
  };
}

export function useNowcastForecast() {
  const [timeline, setTimeline] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await floodService.getNowcastTimeline();
        setTimeline(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentStep = timeline[activeIndex] || null;

  return {
    timeline,
    activeIndex,
    setActiveIndex,
    currentStep,
    loading
  };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await floodService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const dispatchAlert = async (alertData) => {
    const newAlert = await floodService.dispatchAlert(alertData);
    setAlerts(prev => [newAlert, ...prev]);
    return newAlert;
  };

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  return {
    alerts: filteredAlerts,
    allAlerts: alerts,
    loading,
    severityFilter,
    setSeverityFilter,
    dispatchAlert,
    refresh: fetchAlerts
  };
}

export function useInfrastructure() {
  const [infra, setInfra] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInfra = useCallback(async () => {
    try {
      setLoading(true);
      const data = await floodService.getInfrastructure();
      setInfra(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfra();
  }, [fetchInfra]);

  const togglePump = async (id, delta) => {
    const updated = await floodService.togglePumpStatus(id, delta);
    setInfra(prev => prev.map(item => item.id === id ? updated : item));
  };

  return {
    infra,
    loading,
    togglePump,
    refresh: fetchInfra
  };
}

export function useSimulation() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('scen-heavy');
  const [customParams, setCustomParams] = useState({
    rainfallMmHr: 70,
    highTideM: 3.6,
    drainageBlockagePct: 30,
    pumpsOnlinePct: 90
  });
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    async function loadPresets() {
      const list = await floodService.getSimulationScenarios();
      setScenarios(list);
      const initial = list.find(s => s.id === 'scen-heavy') || list[0];
      if (initial) {
        setCustomParams({
          rainfallMmHr: initial.rainfallMmHr,
          highTideM: initial.highTideM,
          drainageBlockagePct: initial.drainageBlockagePct,
          pumpsOnlinePct: initial.pumpsOnlinePct
        });
      }
    }
    loadPresets();
  }, []);

  const runSimulation = useCallback(async (paramsToUse) => {
    setIsSimulating(true);
    try {
      const res = await floodService.runCustomSimulation(paramsToUse || customParams);
      setSimulationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  }, [customParams]);

  useEffect(() => {
    // Run initial simulation on load
    runSimulation(customParams);
  }, []); // Run once on mount

  const selectScenario = (scenId) => {
    setSelectedScenarioId(scenId);
    const scen = scenarios.find(s => s.id === scenId);
    if (scen) {
      const newParams = {
        rainfallMmHr: scen.rainfallMmHr,
        highTideM: scen.highTideM,
        drainageBlockagePct: scen.drainageBlockagePct,
        pumpsOnlinePct: scen.pumpsOnlinePct
      };
      setCustomParams(newParams);
      runSimulation(newParams);
    }
  };

  const updateParam = (key, value) => {
    setSelectedScenarioId('custom');
    setCustomParams(prev => ({ ...prev, [key]: Number(value) }));
  };

  return {
    scenarios,
    selectedScenarioId,
    selectScenario,
    customParams,
    updateParam,
    simulationResult,
    isSimulating,
    runSimulation
  };
}
