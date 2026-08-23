import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  CloudRain,
  Activity,
  Cpu,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Waves,
  Percent,
  CheckCircle2,
  Send,
  Sliders,
  HelpCircle,
  BarChart3,
  MapPin,
  Flame,
  Droplets,
  Building,
  History,
  Mountain,
  Compass
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { InundationBar } from '../components/common/InundationBar';
import { AlertModal } from '../components/common/AlertModal';
import {
  AI_MODEL_METADATA,
  ZONES_PREDICTIONS
} from '../mock/predictionsData';
import { useAlerts } from '../hooks/useFloodData';
import { apiClient } from '../services/apiClient';

export function Predictions() {
  const { dispatchAlert } = useAlerts();

  // Predictions list and metadata from backend API with fallback
  const [predictionsList, setPredictionsList] = useState(ZONES_PREDICTIONS);
  const [modelMetadata, setModelMetadata] = useState(AI_MODEL_METADATA);
  const [loading, setLoading] = useState(false);
  const [predictionsLoaded, setPredictionsLoaded] = useState(false);

  // Selected Zone State
  const [selectedZoneId, setSelectedZoneId] = useState(ZONES_PREDICTIONS[0].id || 'ZONE-KUR-01');
  const [xaiData, setXaiData] = useState(null);

  // Selected Timeline Point State
  const [timelineIndex, setTimelineIndex] = useState(0);

  // Broadcast Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // 1. Fetch all zone predictions and model metadata on mount
  useEffect(() => {
    let isMounted = true;
    async function loadPredictions() {
      try {
        setLoading(true);
        const data = await apiClient.getPredictions('mumbai');
        if (isMounted && data) {
          if (Array.isArray(data.predictions) && data.predictions.length > 0) {
            // Map predictions to conform with UI format
            const mapped = data.predictions.map(p => ({
              ...p,
              id: p.zone_id || p.id,
              name: p.zoneName || p.name || p.zone_id,
              zoneName: p.zoneName || p.name || p.zone_id,
              hourlyNowcast: p.hourlyNowcast || []
            }));
            setPredictionsList(mapped);
            setSelectedZoneId(mapped[0].zone_id || mapped[0].id);
          }
          if (data.model_metadata) {
            setModelMetadata(data.model_metadata);
          }
        }
      } catch (err) {
        console.warn('Backend API /predictions unavailable, using local mock predictions:', err.message);
      } finally {
        if (isMounted) setPredictionsLoaded(true);
        if (isMounted) setLoading(false);
      }
    }
    loadPredictions();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch specific XAI explanation when selected zone changes
  useEffect(() => {
    let isMounted = true;
    async function loadExplanation() {
      if (!predictionsLoaded) return;

      const activeZone = predictionsList.find(z => z.id === selectedZoneId || z.zone_id === selectedZoneId);
      const zoneKey = activeZone?.zone_id || selectedZoneId;
      if (!zoneKey) return;

      try {
        const explanation = await apiClient.getZoneExplanation(zoneKey);
        if (isMounted && explanation) {
          setXaiData(explanation);
        }
      } catch (err) {
        // Fall back to zone's existing xaiFactors
      }
    }
    loadExplanation();
    return () => { isMounted = false; };
  }, [selectedZoneId, predictionsList, predictionsLoaded]);

  // Active Zone Object
  const selectedZone = predictionsList.find(z => z.id === selectedZoneId || z.zone_id === selectedZoneId) || predictionsList[0] || ZONES_PREDICTIONS[0];
  const activeNowcastPoint = (selectedZone.hourlyNowcast && selectedZone.hourlyNowcast[timelineIndex]) || (selectedZone.hourlyNowcast && selectedZone.hourlyNowcast[0]) || { timeOffset: '+0h', status: 'Active', waterDepthM: 1.2, floodProbability: 80 };

  // Use dynamically loaded XAI factors if available
  const displayXaiFactors = xaiData?.xai_factors || selectedZone.xaiFactors || [];

  const getFactorIcon = (factorId) => {
    switch (factorId) {
      case 'factor-rain-intensity': return <CloudRain size={16} color="#ff334b" />;
      case 'factor-rain-duration': return <Clock size={16} color="#ff7700" />;
      case 'factor-drain-capacity': return <Waves size={16} color="#ffaa00" />;
      case 'factor-drain-blockage': return <Droplets size={16} color="#ff334b" />;
      case 'factor-elevation': return <Mountain size={16} color="#00b4d8" />;
      case 'factor-impervious': return <Building size={16} color="#ffcc00" />;
      case 'factor-history': return <History size={16} color="#10b981" />;
      default: return <Activity size={16} color="var(--color-primary)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header: AI Model Specs & Metadata */}
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
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>0–6 Hour AI Flood Nowcast & Explainable AI (XAI)</h2>
            <StatusBadge status="ACTIVE" label="ST-GNN v2.4 ENSEMBLE" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            High-resolution spatial-temporal deep learning model fusing radar reflectivity, IoT water gauges, and hydrodynamic elevation grids.
          </p>
        </div>

        {/* Live Model Metadata Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(0, 180, 216, 0.1)', border: '1px solid var(--border-subtle)' }}>
            Model Confidence: <strong style={{ color: 'var(--color-safe)' }}>{modelMetadata.confidenceEnsemble}%</strong>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)' }}>
            Latency: <strong style={{ color: 'var(--color-primary-light)' }}>{modelMetadata.inferenceLatencyMs}ms</strong>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)' }}>
            Radar Feed: <strong style={{ color: '#fff' }}>S-Band (100m Grid)</strong>
          </div>
        </div>
      </div>

      {/* SECTION 1: Urban Zones Selection Matrix Table / Grid */}
      <div className="glass-panel">
        <div className="glass-panel-header">
          <div className="glass-panel-title">
            <MapPin size={18} />
            <span>Urban Catchment Zones (0–6h Nowcast Matrix)</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Click any zone below to inspect Explainable AI factors
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '12px 10px' }}>Urban Zone / Catchment</th>
                <th style={{ padding: '12px 10px' }}>Current Rainfall</th>
                <th style={{ padding: '12px 10px' }}>Flood Probability</th>
                <th style={{ padding: '12px 10px' }}>Expected Time to Flooding</th>
                <th style={{ padding: '12px 10px' }}>Est. Water Depth</th>
                <th style={{ padding: '12px 10px' }}>Severity</th>
                <th style={{ padding: '12px 10px' }}>AI Confidence</th>
              </tr>
            </thead>
            <tbody>
              {predictionsList.map(zone => {
              const isSelected = selectedZoneId === zone.id || selectedZoneId === zone.zone_id;
                const isCritical = zone.severity === 'CRITICAL';
                const isHigh = zone.severity === 'HIGH';

                return (
                  <tr
                    key={zone.id}
                    onClick={() => {
                      setSelectedZoneId(zone.id);
                      setTimelineIndex(0);
                    }}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isSelected
                        ? 'linear-gradient(90deg, rgba(0, 180, 216, 0.22) 0%, rgba(0, 180, 216, 0.06) 100%)'
                        : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--color-primary)' : '4px solid transparent',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: isSelected ? 800 : 600, color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                        {zone.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {zone.wardCode} • {zone.zoneCategory}
                      </div>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <span className="mono-text" style={{ fontWeight: 700, color: isCritical ? 'var(--color-critical)' : (isHigh ? 'var(--color-warning)' : 'var(--text-main)') }}>
                        {zone.currentRainfallStr}
                      </span>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="mono-text" style={{
                          fontWeight: 900,
                          fontSize: '1rem',
                          color: zone.floodProbability >= 80 ? 'var(--color-critical)' : (zone.floodProbability >= 50 ? 'var(--color-warning)' : 'var(--color-safe)')
                        }}>
                          {zone.floodProbability}%
                        </span>
                        <div style={{ width: 45, height: 5, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                          <div style={{
                            width: `${zone.floodProbability}%`,
                            height: '100%',
                            background: zone.floodProbability >= 80 ? 'var(--color-critical)' : (zone.floodProbability >= 50 ? 'var(--color-warning)' : 'var(--color-safe)')
                          }} />
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: zone.expectedTimeToFlooding.includes('Immediate') ? 'var(--color-critical)' : (zone.expectedTimeToFlooding.includes('mins') ? 'var(--color-warning)' : 'var(--color-safe)')
                      }}>
                        {zone.expectedTimeToFlooding}
                      </span>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <span className="mono-text" style={{ fontWeight: 800, color: zone.estimatedWaterDepthM >= zone.dangerThresholdM ? 'var(--color-critical)' : 'var(--text-main)' }}>
                        {zone.estimatedWaterDepthM.toFixed(2)}m
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: 4 }}>
                        / {zone.dangerThresholdM}m
                      </span>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <StatusBadge status={zone.severity} size="sm" />
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <span className="mono-text" style={{ color: 'var(--color-safe)', fontWeight: 700 }}>
                        {zone.predictionConfidence}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Deep Dive for Selected Zone & 0-6 Hour Scrubber */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        <MetricCard
          title="Selected Zone Risk"
          value={selectedZone.name.split(' ')[0]}
          unit={selectedZone.wardCode}
          subtitle={selectedZone.zoneCategory}
          icon={AlertTriangle}
          colorVariant={selectedZone.severity === 'CRITICAL' ? 'critical' : 'warning'}
          status={selectedZone.severity}
        />
        <MetricCard
          title="Peak Flood Arrival"
          value={selectedZone.peakFloodArrival}
          subtitle={`Lead Time: ${selectedZone.leadTimeToPeak}`}
          icon={Clock}
          colorVariant="critical"
        />
        <MetricCard
          title="Max Surface Depth"
          value={selectedZone.estimatedWaterDepthM}
          unit="meters"
          subtitle={`Danger Mark: ${selectedZone.dangerThresholdM}m`}
          icon={Waves}
          colorVariant={selectedZone.estimatedWaterDepthM >= selectedZone.dangerThresholdM ? 'critical' : 'primary'}
        />
        <MetricCard
          title="Prediction Confidence"
          value={selectedZone.predictionConfidence}
          unit="%"
          subtitle="Bayesian Spatial Ensemble"
          icon={Percent}
          colorVariant="safe"
          status="HIGH_CONFIDENCE"
        />
      </div>

      {/* SECTION 3: 0-6 Hour Timeline Scrubber for Selected Zone */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="var(--color-primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
              0–6 Hour Nowcasting Timeline for <strong style={{ color: 'var(--color-primary-light)' }}>{selectedZone.name}</strong>
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-accent)', fontFamily: 'var(--font-mono)' }}>
            Scrub timeline to inspect hour-by-hour flood evolution
          </span>
        </div>

        {/* Timeline Step Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
          gap: 8,
          marginBottom: 16
        }}>
          {selectedZone.hourlyNowcast.map((step, idx) => {
            const isActive = timelineIndex === idx;
            const isPeak = step.timeLabel.includes('Peak');
            return (
              <button
                key={idx}
                onClick={() => setTimelineIndex(idx)}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.3) 0%, rgba(0, 180, 216, 0.1) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isActive
                    ? '1px solid var(--color-primary)'
                    : (isPeak ? '1px dashed var(--color-critical)' : '1px solid var(--border-subtle)'),
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: isActive ? 'var(--color-primary-light)' : (isPeak ? 'var(--color-critical)' : 'var(--text-main)'),
                  marginBottom: 3
                }}>
                  {step.timeLabel}
                </div>
                <div className="mono-text" style={{ fontSize: '0.72rem', color: '#fff' }}>
                  {step.rainfallMmHr} mm/h
                </div>
                <div className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Depth: {step.waterLevelM}m
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Timeline Point Metric Bar */}
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: '0.82rem'
        }}>
          <div>Forecast Step: <strong style={{ color: 'var(--text-accent)' }}>{activeNowcastPoint.timeLabel}</strong></div>
          <div>Precipitation: <strong className="mono-text" style={{ color: '#fff' }}>{activeNowcastPoint.rainfallMmHr} mm/h</strong></div>
          <div>Predicted Water Level: <strong className="mono-text" style={{ color: activeNowcastPoint.waterLevelM >= selectedZone.dangerThresholdM ? 'var(--color-critical)' : 'var(--color-primary-light)' }}>{activeNowcastPoint.waterLevelM}m</strong></div>
          <div>Flood Probability: <strong className="mono-text" style={{ color: activeNowcastPoint.floodProbPct >= 80 ? 'var(--color-critical)' : 'var(--color-warning)' }}>{activeNowcastPoint.floodProbPct}%</strong></div>
        </div>
      </div>

      {/* SECTION 4: EXPLAINABLE AI (XAI) FEATURE IMPORTANCE PANEL */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(13, 23, 40, 0.95) 0%, rgba(19, 34, 56, 0.9) 100%)',
        border: '1px solid var(--border-medium)'
      }}>
        <div className="glass-panel-header">
          <div className="glass-panel-title">
            <Cpu size={18} />
            <span>Explainable AI (XAI) Feature Importance for {selectedZone.name}</span>
          </div>
          <StatusBadge status={selectedZone.severity} label={`RISK: ${selectedZone.severity}`} />
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
          The machine learning model decomposes the flood probability ({selectedZone.floodProbability}%) into <strong>7 key physical and environmental factors</strong>. Below is the exact relative attribution weight and reasoning for this catchment.
        </p>

        {/* 7 Factors Breakdown Grid / Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {displayXaiFactors.map((factor, idx) => (
            <div
              key={factor.id}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                transition: 'border-color var(--transition-fast)'
              }}
            >
              {/* Factor Title Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {getFactorIcon(factor.id)}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#ffffff' }}>
                      {factor.name}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 8 }}>
                      (Measured: <strong style={{ color: 'var(--text-main)' }}>{factor.value}</strong>)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="mono-text" style={{
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    color: factor.statusColor
                  }}>
                    {factor.contributionPct}% Contribution
                  </span>
                  <StatusBadge status={factor.severity} size="sm" />
                </div>
              </div>

              {/* Visual Attribution Progress Bar */}
              <div style={{
                height: 7,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.08)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${factor.contributionPct * 2.8}%`, // Scaled for visual prominence
                  maxWidth: '100%',
                  height: '100%',
                  borderRadius: 4,
                  background: factor.statusColor,
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {/* Explainable AI Narrative Reasoning */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: 2 }}>
                💡 <strong>Model Rationale:</strong> {factor.explanation}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom SOP Action Bar */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
              Targeted SOP Directive:
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {selectedZone.description}
            </div>
          </div>

          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="tactical-btn tactical-btn-danger"
            style={{ fontSize: '0.85rem', padding: '10px 20px' }}
          >
            <Send size={16} /> Broadcast Warning for {selectedZone.name.split(' ')[0]}
          </button>
        </div>
      </div>

      {/* Emergency Broadcast Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onDispatch={(data) => dispatchAlert(data)}
        initialWard={selectedZone.name}
      />
    </div>
  );
}
