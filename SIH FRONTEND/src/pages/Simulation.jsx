import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  Sliders,
  RotateCcw,
  AlertTriangle,
  Waves,
  CloudRain,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Activity,
  Layers,
  Clock,
  Navigation,
  Building2,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Send,
  AlertOctagon,
  Percent,
  SlidersHorizontal
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { InundationBar } from '../components/common/InundationBar';
import { AlertModal } from '../components/common/AlertModal';
import {
  BASELINE_CONDITIONS,
  PRESET_SCENARIOS,
  runModularSimulation
} from '../services/simulationEngine';
import { useAlerts } from '../hooks/useFloodData';

export function Simulation() {
  const { dispatchAlert } = useAlerts();

  // Parameter State
  const [params, setParams] = useState({
    rainfallIntensity: 75,
    rainfallDuration: 120,
    drainageEfficiency: 70,
    drainageBlockage: 40
  });

  const [activePresetId, setActivePresetId] = useState('scen-moderate-downpour');
  const [isComputing, setIsComputing] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Broadcast Alert Modal
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Initial calculation on mount
  useEffect(() => {
    const res = runModularSimulation(params);
    setSimulationResult(res);
  }, []);

  const handleSimulate = (overrideParams) => {
    const targetParams = overrideParams || params;
    setIsComputing(true);
    setTimeout(() => {
      const res = runModularSimulation(targetParams);
      setSimulationResult(res);
      setIsComputing(false);
    }, 280); // Realistic slight solver delay
  };

  const handlePresetSelect = (preset) => {
    setActivePresetId(preset.id);
    setParams(preset.params);
    handleSimulate(preset.params);
  };

  const handleParamChange = (key, value) => {
    setActivePresetId('custom');
    const updated = { ...params, [key]: Number(value) };
    setParams(updated);
    // Instant recalculation
    const res = runModularSimulation(updated);
    setSimulationResult(res);
  };

  const handleResetToBaseline = () => {
    setActivePresetId('custom');
    setParams(BASELINE_CONDITIONS);
    handleSimulate(BASELINE_CONDITIONS);
  };

  const formatDuration = (mins) => {
    if (mins < 60) return `${mins} mins`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs} hours`;
  };

  const res = simulationResult;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner: What-If Simulator Header */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.14) 0%, rgba(13, 23, 40, 0.92) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>What-If Urban Flood Simulator</h2>
            <StatusBadge status="DYNAMIC_SOLVER" label="HYDRO-DYNAMIC ENGINE" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Simulate convective precipitation, storm duration, and drainage bottlenecks to compute real-time urban inundation and road submergence.
          </p>
        </div>

        {/* Big Prominent Simulate Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleResetToBaseline}
            className="tactical-btn tactical-btn-ghost"
            style={{ fontSize: '0.82rem' }}
          >
            <RotateCcw size={15} />
            <span>Reset Baseline</span>
          </button>
          <button
            onClick={() => handleSimulate()}
            disabled={isComputing}
            className="tactical-btn tactical-btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              boxShadow: '0 0 20px rgba(0, 180, 216, 0.5)'
            }}
          >
            <PlayCircle size={20} className={isComputing ? 'animate-spin' : ''} />
            <span>{isComputing ? 'COMPUTING HYDRODYNAMICS...' : 'SIMULATE SCENARIO'}</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Selector Bar */}
      <div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
          Quick Scenario Presets:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {PRESET_SCENARIOS.map(preset => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(0, 180, 216, 0.18)' : 'var(--bg-card)',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: isSelected ? 'var(--color-primary-light)' : 'var(--text-dim)',
                    textTransform: 'uppercase'
                  }}>
                    {preset.category}
                  </span>
                  {isSelected && <span className="pulse-dot" style={{ color: 'var(--color-primary)' }} />}
                </div>
                <strong style={{ fontSize: '0.95rem', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                  {preset.name}
                </strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Parameter Controls Deck vs Real-Time Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24, alignItems: 'start' }}>
        {/* LEFT COLUMN: Parametric Controls Deck */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="glass-panel-header" style={{ marginBottom: 0 }}>
            <div className="glass-panel-title">
              <Sliders size={18} />
              <span>Simulation Controls</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-accent)', fontFamily: 'var(--font-mono)' }}>
              WHAT-IF INPUTS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Control 1: Rainfall Intensity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Rainfall Intensity
                </span>
                <span className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                  {params.rainfallIntensity} <span style={{ fontSize: '0.75rem' }}>mm/h</span>
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={params.rainfallIntensity}
                onChange={e => handleParamChange('rainfallIntensity', e.target.value)}
                className="tactical-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
                <span>10 mm/h (Drizzle)</span>
                <span>60 mm/h (Heavy)</span>
                <span>150 mm/h (Cloudburst)</span>
              </div>
            </div>

            {/* Control 2: Rainfall Duration */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Storm Duration
                </span>
                <span className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                  {formatDuration(params.rainfallDuration)}
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="360"
                step="15"
                value={params.rainfallDuration}
                onChange={e => handleParamChange('rainfallDuration', e.target.value)}
                className="tactical-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
                <span>15 mins (Flash)</span>
                <span>2 hours (Sustained)</span>
                <span>6 hours (Prolonged)</span>
              </div>
            </div>

            {/* Control 3: Drainage Efficiency */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Drainage Efficiency
                </span>
                <span className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-safe)' }}>
                  {params.drainageEfficiency}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={params.drainageEfficiency}
                onChange={e => handleParamChange('drainageEfficiency', e.target.value)}
                className="tactical-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
                <span>10% (Pumps Down)</span>
                <span>60% (Partial SCADA)</span>
                <span>100% (Full Capacity)</span>
              </div>
            </div>

            {/* Control 4: Drainage Blockage */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Drainage Blockage & Siltation
                </span>
                <span className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 800, color: params.drainageBlockage > 50 ? 'var(--color-critical)' : 'var(--color-warning)' }}>
                  {params.drainageBlockage}% Choked
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={params.drainageBlockage}
                onChange={e => handleParamChange('drainageBlockage', e.target.value)}
                className="tactical-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
                <span>0% (Desilted Drains)</span>
                <span>50% (Silted)</span>
                <span>100% (Fully Clogged)</span>
              </div>
            </div>

            {/* Main Simulate Trigger Button */}
            <button
              onClick={() => handleSimulate()}
              disabled={isComputing}
              className="tactical-btn tactical-btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                marginTop: 6
              }}
            >
              <PlayCircle size={18} className={isComputing ? 'animate-spin' : ''} />
              <span>{isComputing ? 'Calculating Hydrodynamics...' : 'RE-RUN SIMULATION'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Dynamic Simulation Results */}
        {res && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Top 4 Calculated KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              <MetricCard
                title="Flood Probability"
                value={res.floodProbability}
                unit="%"
                subtitle="Calculated AI Ensemble"
                icon={Percent}
                colorVariant={res.floodProbability >= 75 ? 'critical' : (res.floodProbability >= 50 ? 'warning' : 'safe')}
                status={res.riskTier}
              />
              <MetricCard
                title="Est. Water Depth"
                value={res.estimatedWaterDepthM}
                unit="meters"
                subtitle="Max Surface Inundation"
                icon={Waves}
                colorVariant={res.estimatedWaterDepthM >= 1.0 ? 'critical' : 'warning'}
              />
              <MetricCard
                title="Submerged Area"
                value={res.affectedAreaSqKm}
                unit="sq km"
                subtitle={`${res.totalRainfallMm}mm Storm Volume`}
                icon={Layers}
                colorVariant="primary"
              />
              <MetricCard
                title="Time to Flooding"
                value={res.estimatedTimeToFlooding.split(' ')[0]}
                unit={res.estimatedTimeToFlooding.split(' ')[1] || ''}
                subtitle="Estimated Onset Window"
                icon={Clock}
                colorVariant={res.estimatedTimeToFlooding.includes('Immediate') ? 'critical' : 'warning'}
              />
            </div>

            {/* BEFORE / AFTER COMPARISON CARD */}
            <div className="glass-panel" style={{
              background: 'linear-gradient(135deg, rgba(13, 23, 40, 0.95) 0%, rgba(19, 34, 56, 0.85) 100%)',
              border: '1px solid var(--border-medium)'
            }}>
              <div className="glass-panel-header">
                <div className="glass-panel-title">
                  <Activity size={18} />
                  <span>Before vs After Scenario Comparison (Baseline Diff)</span>
                </div>
                <StatusBadge status={res.riskTier} label={`SIMULATED: ${res.riskTier}`} />
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>Metric</th>
                      <th style={{ padding: '10px' }}>Baseline (Routine Monsoon)</th>
                      <th style={{ padding: '10px' }}>Simulated What-If Scenario</th>
                      <th style={{ padding: '10px' }}>Net Impact (Delta)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '10px', fontWeight: 600, color: '#fff' }}>Flood Risk Tier</td>
                      <td style={{ padding: '10px' }}><StatusBadge status="LOW" size="sm" /></td>
                      <td style={{ padding: '10px' }}><StatusBadge status={res.riskTier} size="sm" /></td>
                      <td style={{ padding: '10px', color: res.riskTier === 'CRITICAL' ? 'var(--color-critical)' : 'var(--text-accent)', fontWeight: 700 }}>
                        {res.riskTier === 'CRITICAL' ? '⚡ Surge to Severe Life Threat' : 'Elevated Risk'}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '10px', fontWeight: 600, color: '#fff' }}>Flood Probability</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{res.comparison.baseline.floodProbability}%</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#fff' }}>{res.floodProbability}%</td>
                      <td style={{ padding: '10px', color: 'var(--color-critical)', fontWeight: 700 }}>
                        +{res.comparison.deltas.probDelta}% increase
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '10px', fontWeight: 600, color: '#fff' }}>Surface Water Depth</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{res.comparison.baseline.estimatedWaterDepthM}m</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#fff' }}>{res.estimatedWaterDepthM}m</td>
                      <td style={{ padding: '10px', color: 'var(--color-critical)', fontWeight: 700 }}>
                        +{res.comparison.deltas.depthDelta}m (+{Math.round((res.comparison.deltas.depthDelta / res.comparison.baseline.estimatedWaterDepthM) * 100)}%)
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '10px', fontWeight: 600, color: '#fff' }}>Submerged Urban Area</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{res.comparison.baseline.affectedAreaSqKm} sq km</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#fff' }}>{res.affectedAreaSqKm} sq km</td>
                      <td style={{ padding: '10px', color: 'var(--color-warning)', fontWeight: 700 }}>
                        +{res.comparison.deltas.areaDelta} sq km
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px', fontWeight: 600, color: '#fff' }}>Impacted Road Corridors</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>0 Closed</td>
                      <td style={{ padding: '10px', fontWeight: 700, color: '#fff' }}>
                        {res.affectedRoads.filter(r => r.status !== 'CLEAR_OPEN').length} Submerged / Slow
                      </td>
                      <td style={{ padding: '10px', color: 'var(--color-critical)', fontWeight: 700 }}>
                        +{res.comparison.deltas.roadsDelta} Arteries Impacted
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* EXPLAINABLE AI: RISK FACTOR ATTRIBUTION */}
            <div className="glass-panel">
              <div className="glass-panel-header">
                <div className="glass-panel-title">
                  <TrendingUp size={18} />
                  <span>Explainable AI: Key Factors Contributing to Increased Flood Risk</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Hydro Feature Attribution
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {res.factorAttribution.map((factor, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: factor.color }} />
                        <strong style={{ color: '#fff' }}>{factor.factorName}</strong>
                      </div>
                      <span className="mono-text" style={{ fontWeight: 800, color: factor.color, fontSize: '0.95rem' }}>
                        {factor.contributionPct}% Contribution
                      </span>
                    </div>

                    {/* Attribution Progress Bar */}
                    <div style={{
                      height: 8,
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${factor.contributionPct}%`,
                        height: '100%',
                        borderRadius: 4,
                        background: factor.color,
                        transition: 'width 0.4s ease'
                      }} />
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {factor.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AFFECTED ROADS & CRITICAL INFRASTRUCTURE SPLIT */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
              {/* Affected Roads Card */}
              <div className="glass-panel">
                <div className="glass-panel-header">
                  <div className="glass-panel-title">
                    <Navigation size={18} />
                    <span>Projected Affected Roads ({res.affectedRoads.length})</span>
                  </div>
                  <StatusBadge status="ROADS_MATRIX" label="TRAFFIC IMPACT" size="sm" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                  {res.affectedRoads.map(road => (
                    <div
                      key={road.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: road.status === 'SUBMERGED_CLOSED' ? 'rgba(255, 51, 75, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: road.status === 'SUBMERGED_CLOSED' ? '1px solid var(--color-critical-border)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{road.name}</strong>
                        <StatusBadge status={road.status} label={road.statusLabel} size="sm" />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Depth: <strong className="mono-text" style={{ color: road.status === 'SUBMERGED_CLOSED' ? 'var(--color-critical)' : '#fff' }}>{road.currentDepthM}m</strong></span>
                        <span>Speed: <strong style={{ color: 'var(--text-accent)' }}>{road.currentSpeedKmh} km/h</strong></span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: 4 }}>
                        Detour: {road.detourRoute}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Infrastructure at Risk */}
              <div className="glass-panel">
                <div className="glass-panel-header">
                  <div className="glass-panel-title">
                    <Building2 size={18} />
                    <span>Critical Infrastructure Assets at Risk</span>
                  </div>
                  <span className="status-badge critical" style={{ fontSize: '0.7rem' }}>
                    {res.criticalInfraAtRisk.filter(i => i.isAtRisk).length} ASSETS THREATENED
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                  {res.criticalInfraAtRisk.map(infra => (
                    <div
                      key={infra.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: infra.isAtRisk ? 'rgba(255, 119, 0, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: infra.isAtRisk ? '1px solid var(--color-warning-border)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{infra.name}</strong>
                        <StatusBadge status={infra.severityTier} size="sm" />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Surrounding Inundation: <strong className="mono-text" style={{ color: '#fff' }}>{infra.waterDepthAroundAssetM}m</strong> (Safe Limit: {infra.thresholdDepthM}m)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: infra.isAtRisk ? 'var(--color-warning)' : 'var(--text-dim)' }}>
                        {infra.vulnerabilityNote}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTIONABLE EMERGENCY SOPS & BROADCAST TRIGGER */}
            <div className="glass-panel" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16
            }}>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  Automated Emergency Dispatch SOPs for Simulated Scenario:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {res.actionableRecommendations.map((sop, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                      <CheckCircle2 size={14} color="var(--color-safe)" style={{ flexShrink: 0 }} />
                      <span>{sop}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="tactical-btn tactical-btn-danger"
                style={{ padding: '10px 22px' }}
              >
                <Send size={16} /> Broadcast Warning For Scenario
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Broadcast Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onDispatch={(data) => dispatchAlert(data)}
        initialWard="Metropolitan Simulation Catchment"
      />
    </div>
  );
}
