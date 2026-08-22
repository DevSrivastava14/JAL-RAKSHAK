import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Waves,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Server,
  CloudRain,
  Building2,
  Hospital,
  Train,
  Zap,
  Home,
  Truck,
  Users,
  Activity,
  Compass,
  CheckCircle2,
  Radio,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { INDIAN_CITIES } from '../mock/citiesData';

export function Cities() {
  // Selected City State (Default: Mumbai)
  const [selectedCityId, setSelectedCityId] = useState('mumbai');

  const selectedCity = INDIAN_CITIES.find(c => c.id === selectedCityId) || INDIAN_CITIES[0];

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'warning';
      case 'MODERATE': return 'warning';
      default: return 'safe';
    }
  };

  const getReadinessColor = (pct) => {
    if (pct >= 80) return '#10b981';
    if (pct >= 70) return '#ffaa00';
    return '#ff334b';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* 1. Header */}
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
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Multi-City Flood Intelligence</h2>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: '0.72rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              background: 'rgba(0, 180, 216, 0.18)',
              color: 'var(--color-primary-light)',
              border: '1px solid var(--border-medium)',
              letterSpacing: '0.04em'
            }}>
              <span className="pulse-dot" style={{ color: 'var(--color-primary)' }} />
              NATIONAL FLOOD MONITORING ACTIVE
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Compare flood conditions, infrastructure impact, and emergency readiness across major Indian cities.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Monitoring Network:</span>
          <span style={{
            fontSize: '0.88rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)'
          }}>
            10 METRO CENTRES ACTIVE
          </span>
        </div>
      </div>

      {/* 2. City Selector Bar */}
      <div className="glass-panel" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
            Select City:
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap' }}>
            {INDIAN_CITIES.map(city => {
              const isSelected = selectedCityId === city.id;
              const isCritical = city.floodRisk === 'CRITICAL';

              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? '1px solid var(--color-primary)'
                      : (isCritical ? '1px dashed rgba(255, 51, 75, 0.5)' : '1px solid var(--border-subtle)'),
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.28) 0%, rgba(0, 180, 216, 0.08) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: isSelected ? 800 : 600,
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? '0 0 12px rgba(0, 180, 216, 0.3)' : 'none'
                  }}
                >
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: 9999,
                    background: city.riskColor,
                    display: 'inline-block'
                  }} />
                  <span>{city.name}</span>
                  <span className="mono-text" style={{
                    fontSize: '0.72rem',
                    color: isSelected ? 'var(--color-primary-light)' : 'var(--text-dim)'
                  }}>
                    {city.rainfall}mm
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. City Overview 6 KPI Cards for Selected City */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14
      }}>
        <MetricCard
          title="Flood Risk"
          value={selectedCity.floodRisk}
          subtitle={`${selectedCity.name} Met Region`}
          icon={AlertTriangle}
          colorVariant={getRiskBadgeColor(selectedCity.floodRisk)}
          status={selectedCity.floodRisk}
        />
        <MetricCard
          title="Active Alerts"
          value={selectedCity.activeAlerts}
          unit="issued"
          subtitle="CAP Disaster Warnings"
          icon={Radio}
          colorVariant="primary"
          status="LIVE"
        />
        <MetricCard
          title="Affected Zones"
          value={selectedCity.affectedZones}
          unit="wards"
          subtitle="Lowland Inundation Areas"
          icon={MapPin}
          colorVariant="warning"
        />
        <MetricCard
          title="Infrastructure at Risk"
          value={selectedCity.infrastructureRisk}
          unit="assets"
          subtitle="Transit, Sump, Health Facilities"
          icon={Server}
          colorVariant="critical"
        />
        <MetricCard
          title="Emergency Readiness"
          value={selectedCity.readiness}
          unit="%"
          subtitle="Mobilization Score"
          icon={ShieldCheck}
          colorVariant="safe"
          status="PREPARED"
        />
        <MetricCard
          title="Rainfall Intensity"
          value={selectedCity.rainfallStr}
          subtitle={selectedCity.trend}
          icon={CloudRain}
          colorVariant={selectedCity.rainfall >= 60 ? 'critical' : 'warning'}
        />
      </div>

      {/* 4. National Flood Visualization (India Map) + Selected City Intelligence */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '460px 1fr',
        gap: 18,
        alignItems: 'start'
      }}>
        {/* LEFT: National Flood Visualization (Stylized India Command Map) */}
        <div className="glass-panel" style={{
          padding: 0,
          overflow: 'hidden',
          position: 'relative',
          background: 'radial-gradient(circle at 50% 50%, #0d1b2a 0%, #070d19 100%)',
          border: '1px solid var(--border-medium)',
          minHeight: 520
        }}>
          {/* Map Title Overlay */}
          <div style={{
            position: 'absolute',
            top: 14,
            left: 16,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(13, 23, 40, 0.88)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.76rem'
          }}>
            <Globe size={15} color="var(--color-primary)" />
            <span style={{ color: '#fff', fontWeight: 700 }}>National Flood Radar Matrix</span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span style={{ color: 'var(--color-primary-light)', fontFamily: 'var(--font-mono)' }}>10 Urban Hubs</span>
          </div>

          {/* SVG Tactical India Map Canvas */}
          <svg
            viewBox="0 0 100 100"
            style={{ width: '100%', height: '520px', background: '#091322' }}
          >
            <defs>
              {/* Tactical Grid Pattern */}
              <pattern id="nationalGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(72, 202, 228, 0.05)" strokeWidth="0.5" />
              </pattern>
              {/* Glow Filter */}
              <filter id="cityGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="100" height="100" fill="url(#nationalGrid)" />

            {/* Stylized India Geography Vector Outline */}
            <path
              d="M 32 10 
                 L 44 8 
                 L 46 16 
                 L 58 22 
                 L 72 26 
                 L 88 28 
                 L 94 36 
                 L 86 42 
                 L 75 42 
                 L 72 52 
                 L 54 78 
                 L 48 88 
                 L 40 82 
                 L 30 68 
                 L 22 52 
                 L 18 38 
                 L 24 24 
                 Z"
              fill="rgba(0, 180, 216, 0.05)"
              stroke="rgba(0, 180, 216, 0.25)"
              strokeWidth="0.8"
            />

            {/* Stylized Major River Systems */}
            <path d="M 36 28 Q 50 32 62 36 T 74 48" fill="none" stroke="rgba(0, 180, 216, 0.22)" strokeWidth="1.2" />
            <path d="M 72 26 Q 84 28 92 34" fill="none" stroke="rgba(0, 180, 216, 0.22)" strokeWidth="1.4" />
            <path d="M 28 56 Q 40 60 52 64" fill="none" stroke="rgba(0, 180, 216, 0.2)" strokeWidth="1.2" />

            {/* City Markers */}
            {INDIAN_CITIES.map(city => {
              const isSelected = selectedCityId === city.id;
              const isCritical = city.floodRisk === 'CRITICAL';

              return (
                <g
                  key={city.id}
                  transform={`translate(${city.coordinates.x}, ${city.coordinates.y})`}
                  onClick={() => setSelectedCityId(city.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="6.5"
                      fill="none"
                      stroke="#00b4d8"
                      strokeWidth="1.2"
                      strokeDasharray="2,1"
                      filter="url(#cityGlow)"
                    />
                  )}

                  {/* Pulsing Ring for Critical Cities */}
                  {isCritical && (
                    <circle
                      cx="0"
                      cy="0"
                      r="4.8"
                      fill="none"
                      stroke="#ff334b"
                      strokeWidth="0.8"
                      opacity="0.75"
                    />
                  )}

                  {/* Core Pin Dot */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? "3.2" : "2.4"}
                    fill={city.riskColor}
                    stroke="#ffffff"
                    strokeWidth="0.6"
                  />

                  {/* City Name Label */}
                  <text
                    x="4"
                    y="1.2"
                    fill={isSelected ? "#ffffff" : "var(--text-main)"}
                    fontSize={isSelected ? "3.4" : "2.8"}
                    fontFamily="var(--font-heading)"
                    fontWeight={isSelected ? "bold" : "600"}
                  >
                    {city.name}
                  </text>

                  {/* Rainfall Tag */}
                  <text
                    x="4"
                    y="4.2"
                    fill={city.riskColor}
                    fontSize="2.1"
                    fontFamily="var(--font-mono)"
                    fontWeight="bold"
                  >
                    {city.rainfall}mm • {city.floodRisk}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Footer Legend */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            right: 14,
            zIndex: 10,
            background: 'rgba(13, 23, 40, 0.92)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.7rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8
          }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#ff334b', display: 'inline-block' }} />
                <span>Critical</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#ff7700', display: 'inline-block' }} />
                <span>High</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#ffaa00', display: 'inline-block' }} />
                <span>Moderate</span>
              </span>
            </div>
            <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              CLICK MARKER TO INSPECT CITY
            </span>
          </div>
        </div>

        {/* RIGHT: SELECTED CITY DETAILED INTELLIGENCE PANELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Selected City Header Banner */}
          <div className="glass-panel" style={{
            background: 'linear-gradient(135deg, rgba(13, 23, 40, 0.95) 0%, rgba(19, 34, 56, 0.92) 100%)',
            border: selectedCity.floodRisk === 'CRITICAL' ? '1px solid var(--color-critical-border)' : '1px solid var(--border-medium)',
            padding: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {selectedCity.region} • {selectedCity.state}
                </span>
                <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginTop: 2 }}>
                  {selectedCity.name} Metropolitan Intelligence
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  🌊 Catchment: <strong style={{ color: 'var(--text-main)' }}>{selectedCity.riverCatchment}</strong>
                </div>
              </div>

              <StatusBadge status={selectedCity.floodRisk} label={`RISK: ${selectedCity.floodRisk}`} />
            </div>

            {/* 7. City-Specific Explanation */}
            <div style={{
              marginTop: 12,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-main)',
              lineHeight: 1.45
            }}>
              💡 <strong>Hydrological Rationale:</strong> {selectedCity.explanation}
            </div>
          </div>

          {/* Panel 1: Flood Intelligence & Hydrology */}
          <div className="glass-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Waves size={16} color="var(--color-primary)" />
              <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Flood Intelligence & Hydrological Threat</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
              <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Predicted Inundation</div>
                <div className="mono-text" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                  {selectedCity.inundation.toFixed(2)}m
                </div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Precipitation Rate</div>
                <div className="mono-text" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  {selectedCity.rainfallStr}
                </div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Flood Trend</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-warning)', marginTop: 2 }}>
                  {selectedCity.trend}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong>Waterlogging Severity:</strong> {selectedCity.waterloggingSeverity}
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Flood-Prone Catchment Zones in {selectedCity.name}:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedCity.floodProneZones.map((zone, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: '0.72rem',
                      background: 'rgba(0, 180, 216, 0.1)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--color-primary-light)'
                    }}
                  >
                    📍 {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 2: Infrastructure Impact */}
          <div className="glass-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Server size={16} color="var(--color-warning)" />
              <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Infrastructure Impact & Disruption Assessment</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
              <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 51, 75, 0.08)', border: '1px solid var(--color-critical-border)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Roads Affected</div>
                <div className="mono-text" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-critical)' }}>
                  {selectedCity.roadsAffected} Arterials
                </div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 170, 0, 0.08)', border: '1px solid var(--color-warning-border)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Hospitals at Risk</div>
                <div className="mono-text" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                  {selectedCity.hospitalsAtRisk} Facilities
                </div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'rgba(0, 180, 216, 0.08)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Emergency Shelters</div>
                <div className="mono-text" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                  {selectedCity.sheltersActive} / {selectedCity.shelters} Camps
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Train size={14} color="var(--text-dim)" />
                <span><strong>Railway / Metro:</strong> {selectedCity.transportImpact}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={14} color="var(--text-dim)" />
                <span><strong>Power Infrastructure:</strong> {selectedCity.powerRisk}</span>
              </div>
            </div>
          </div>

          {/* Panel 3: Emergency Readiness */}
          <div className="glass-panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={16} color="var(--color-safe)" />
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Emergency Readiness & Response Capacity</strong>
              </div>
              <span className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 900, color: getReadinessColor(selectedCity.readiness) }}>
                {selectedCity.readiness}% Ready
              </span>
            </div>

            {/* Readiness Bar */}
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
              <div style={{
                width: `${selectedCity.readiness}%`,
                height: '100%',
                background: getReadinessColor(selectedCity.readiness)
              }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, fontSize: '0.78rem' }}>
              <div>
                <div style={{ color: 'var(--text-dim)' }}>Emergency Vehicles:</div>
                <div className="mono-text" style={{ fontWeight: 800, color: '#fff' }}>
                  {selectedCity.emergencyVehicles} Units
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)' }}>Available Shelters:</div>
                <div className="mono-text" style={{ fontWeight: 800, color: 'var(--color-safe)' }}>
                  {selectedCity.shelters} Sites
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)' }}>Response Teams:</div>
                <div className="mono-text" style={{ fontWeight: 800, color: 'var(--color-primary-light)' }}>
                  {selectedCity.responseTeams} Battalions
                </div>
              </div>
            </div>

            <div style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 51, 75, 0.08)',
              border: '1px solid var(--color-critical-border)',
              fontSize: '0.76rem',
              color: '#fff'
            }}>
              🚨 <strong>Critical Warning:</strong> {selectedCity.criticalWarnings}
            </div>
          </div>
        </div>
      </div>

      {/* 5. CITY RISK COMPARISON TABLE */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={18} color="var(--color-primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
              CITY RISK COMPARISON (All 10 Monitored Urban Metros)
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            CLICK ANY ROW TO SWITCH CITY CONTEXT
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '12px 14px' }}>City & Region</th>
                <th style={{ padding: '12px 14px' }}>Flood Risk</th>
                <th style={{ padding: '12px 14px' }}>Rainfall</th>
                <th style={{ padding: '12px 14px' }}>Active Alerts</th>
                <th style={{ padding: '12px 14px' }}>Affected Zones</th>
                <th style={{ padding: '12px 14px' }}>Infrastructure Risk</th>
                <th style={{ padding: '12px 14px' }}>Readiness Score</th>
              </tr>
            </thead>
            <tbody>
              {INDIAN_CITIES.map(city => {
                const isSelected = selectedCityId === city.id;
                const isCritical = city.floodRisk === 'CRITICAL';
                const isHigh = city.floodRisk === 'HIGH';

                return (
                  <tr
                    key={city.id}
                    onClick={() => setSelectedCityId(city.id)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isSelected
                        ? 'linear-gradient(90deg, rgba(0, 180, 216, 0.22) 0%, rgba(0, 180, 216, 0.05) 100%)'
                        : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--color-primary)' : '4px solid transparent',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    {/* City Name */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: isSelected ? 800 : 600, color: isSelected ? '#ffffff' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{city.name}</span>
                        {isSelected && <span style={{ fontSize: '0.68rem', padding: '1px 5px', borderRadius: 3, background: 'var(--color-primary)', color: '#000', fontWeight: 800 }}>ACTIVE</span>}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {city.state} • {city.region}
                      </div>
                    </td>

                    {/* Flood Risk */}
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={city.floodRisk} size="sm" />
                    </td>

                    {/* Rainfall */}
                    <td style={{ padding: '12px 14px' }}>
                      <span className="mono-text" style={{
                        fontWeight: 700,
                        color: isCritical ? 'var(--color-critical)' : (isHigh ? 'var(--color-warning)' : 'var(--text-main)')
                      }}>
                        {city.rainfallStr}
                      </span>
                    </td>

                    {/* Active Alerts */}
                    <td style={{ padding: '12px 14px' }}>
                      <span className="mono-text" style={{ fontWeight: 800, color: city.activeAlerts >= 10 ? 'var(--color-critical)' : 'var(--text-main)' }}>
                        {city.activeAlerts} Alerts
                      </span>
                    </td>

                    {/* Affected Zones */}
                    <td style={{ padding: '12px 14px' }}>
                      <span className="mono-text" style={{ color: 'var(--text-main)' }}>
                        {city.affectedZones} Wards
                      </span>
                    </td>

                    {/* Infrastructure Risk */}
                    <td style={{ padding: '12px 14px' }}>
                      <span className="mono-text" style={{ fontWeight: 700, color: city.infrastructureRisk >= 7 ? 'var(--color-critical)' : 'var(--color-warning)' }}>
                        {city.infrastructureRisk} Assets
                      </span>
                    </td>

                    {/* Readiness Score */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="mono-text" style={{
                          fontWeight: 800,
                          color: getReadinessColor(city.readiness)
                        }}>
                          {city.readiness}%
                        </span>
                        <div style={{ width: 45, height: 5, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                          <div style={{
                            width: `${city.readiness}%`,
                            height: '100%',
                            background: getReadinessColor(city.readiness)
                          }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
