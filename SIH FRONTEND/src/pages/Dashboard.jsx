import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CloudRain,
  Activity,
  Layers,
  MapPin,
  Server,
  PlayCircle,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Compass,
  Radio
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { HydrographChart } from '../components/common/HydrographChart';
import { RadarWidget } from '../components/common/RadarWidget';
import { InundationBar } from '../components/common/InundationBar';
import { useWards, useSensors, useNowcastForecast } from '../hooks/useFloodData';

export function Dashboard() {
  const navigate = useNavigate();
  const { allWards, loading: wardsLoading } = useWards();
  const { allSensors, loading: sensorsLoading } = useSensors();
  const { timeline } = useNowcastForecast();

  // Top critical wards sorted by risk score
  const criticalWards = [...allWards].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner: Emergency Status Header */}
      <div className="glass-panel highlight-warning" style={{
        background: 'linear-gradient(90deg, rgba(255, 170, 0, 0.1) 0%, rgba(13, 23, 40, 0.9) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={28} color="var(--color-warning)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: '1.35rem', color: '#fff' }}>Mumbai Flood Nowcasting Command Center</h2>
              <StatusBadge status="ORANGE_ALERT" label="ORANGE ALERT" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Heavy convective precipitation in progress. High tide peak (4.54m) expected at <strong>14:45 IST</strong>. 
              Lead time to peak flood arrival in Kurla: <strong>42 minutes</strong>.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/simulation')}
            className="tactical-btn tactical-btn-primary"
          >
            <PlayCircle size={17} />
            <span>Launch Simulation</span>
          </button>
          <button
            onClick={() => navigate('/map')}
            className="tactical-btn tactical-btn-ghost"
          >
            <MapPin size={17} />
            <span>Live Flood Map</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        <MetricCard
          title="City Flood Risk Index"
          value="78"
          unit="/ 100"
          subtitle="High Vulnerability"
          icon={AlertTriangle}
          colorVariant="critical"
          status="CRITICAL"
          trend="+12% in last 1hr"
          trendPositive={false}
        />
        <MetricCard
          title="Avg Rainfall Intensity"
          value="48.5"
          unit="mm/h"
          subtitle="Peak: 71.0 mm/h (Santacruz)"
          icon={CloudRain}
          colorVariant="warning"
          status="WARNING"
          trend="+8.2 mm/h"
          trendPositive={false}
        />
        <MetricCard
          title="Max Inundation Depth"
          value="1.40"
          unit="meters"
          subtitle="Hindmata Lowland Junction"
          icon={Activity}
          colorVariant="critical"
          status="CRITICAL"
          trend="Rising (+0.18m/h)"
          trendPositive={false}
        />
        <MetricCard
          title="IoT Sensors Online"
          value="142"
          unit="/ 148"
          subtitle="Radar, Ultrasonic, AWS"
          icon={Radio}
          colorVariant="safe"
          status="NORMAL"
          trend="96.0% operational"
          trendPositive={true}
        />
        <MetricCard
          title="Storm Dewatering Pumps"
          value="38"
          unit="/ 42"
          subtitle="Discharging 184,000 LPS"
          icon={Server}
          colorVariant="primary"
          status="OPERATIONAL"
          trend="4 standby ready"
          trendPositive={true}
        />
      </div>

      {/* Middle Section: Live Radar & Hydrograph Prediction */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 20
      }}>
        {/* Hydrograph Forecast */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="glass-panel-header">
            <div className="glass-panel-title">
              <TrendingUp size={20} />
              <span>AI 0-6 Hour Catchment Water Level Nowcast</span>
            </div>
            <button
              onClick={() => navigate('/predictions')}
              className="tactical-btn tactical-btn-ghost tactical-btn-sm"
            >
              Full Forecast <ArrowUpRight size={14} />
            </button>
          </div>
          <HydrographChart
            timeline={timeline}
            dangerLevel={3.00}
            warningLevel={2.70}
            locationName="Kurla West (Mithi River Basin)"
          />
        </div>

        {/* Doppler Weather Radar & Sluice Lock */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="glass-panel-header">
            <div className="glass-panel-title">
              <Compass size={20} />
              <span>Real-Time Weather Radar & Tidal Lock Matrix</span>
            </div>
            <StatusBadge status="ACTIVE_SCAN" label="LIVE DOPPLER" />
          </div>

          <div style={{ padding: '10px 0' }}>
            <RadarWidget intensityMmHr={68.4} station="Santacruz Doppler Radar (IMD)" />
          </div>

          <div style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 170, 0, 0.08)',
            border: '1px solid var(--color-warning-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-warning)' }}>
                TIDAL BACKPRESSURE WARNING
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Current Coastal Tide: <strong>3.82m CD</strong> (Locks gravity outfalls)
              </div>
            </div>
            <div className="mono-text" style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-main)' }}>
              Peak High Tide: <strong style={{ color: 'var(--color-critical)' }}>4.54m</strong><br />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>ETA: 14:45 IST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: High Vulnerability Wards & Live Sensor Stream */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: 20
      }}>
        {/* Vulnerable Wards List */}
        <div className="glass-panel">
          <div className="glass-panel-header">
            <div className="glass-panel-title">
              <AlertTriangle size={20} />
              <span>Priority Catchment Vulnerability Matrix</span>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="tactical-btn tactical-btn-ghost tactical-btn-sm"
            >
              View on Map <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {criticalWards.map(ward => (
              <div
                key={ward.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{ward.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 8 }}>({ward.code})</span>
                  </div>
                  <StatusBadge status={ward.riskLevel} />
                </div>

                <InundationBar
                  currentDepthM={ward.inundationDepthM}
                  dangerDepthM={1.0}
                  maxScaleM={2.0}
                  label="Inundation Depth"
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Pop at Risk: <strong style={{ color: '#fff' }}>{ward.populationAtRisk.toLocaleString()}</strong></span>
                  <span>Pumps Active: <strong style={{ color: 'var(--color-primary-light)' }}>{ward.pumpsOperating}</strong></span>
                  <span>Rain Rate: <strong className="mono-text" style={{ color: '#fff' }}>{ward.rainfallRateMmHr} mm/h</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live IoT Sensor Stream */}
        <div className="glass-panel">
          <div className="glass-panel-header">
            <div className="glass-panel-title">
              <Radio size={20} />
              <span>Real-Time IoT Telemetry Stream (Live Jitter)</span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--color-safe)', fontFamily: 'var(--font-mono)' }}>
              <span className="pulse-dot" /> 5s TICK
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>Sensor / Station</th>
                  <th style={{ padding: '8px 10px' }}>Type</th>
                  <th style={{ padding: '8px 10px' }}>Telemetry</th>
                  <th style={{ padding: '8px 10px' }}>Trend</th>
                  <th style={{ padding: '8px 10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allSensors.slice(0, 6).map(sensor => (
                  <tr
                    key={sensor.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s'
                    }}
                  >
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sensor.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{sensor.ward} • {sensor.category}</div>
                    </td>
                    <td style={{ padding: '10px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {sensor.type.replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span className="mono-text" style={{ fontWeight: 700, color: sensor.status === 'CRITICAL' ? 'var(--color-critical)' : 'var(--text-main)', fontSize: '0.9rem' }}>
                        {sensor.jitterNumeric || sensor.rawNumeric} {sensor.unit}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontSize: '0.75rem', color: 'var(--text-accent)' }}>
                      {sensor.trend}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <StatusBadge status={sensor.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
