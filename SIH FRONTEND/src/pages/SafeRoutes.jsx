import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  ArrowRight,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Waves,
  CheckCircle2,
  Compass,
  Zap,
  Activity,
  Sliders,
  RotateCcw,
  Sparkles,
  Hospital,
  Flame,
  Radio,
  Share2,
  PhoneCall,
  Send,
  Eye,
  Info
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import {
  MUMBAI_LOCATIONS,
  WARNING_HAZARDS,
  EMERGENCY_FACILITIES,
  getSafeRoutes
} from '../mock/routesData';
import { apiClient } from '../services/apiClient';

export function SafeRoutes() {
  // Route Selection Inputs
  const [fromLocation, setFromLocation] = useState('Kurla');
  const [toLocation, setToLocation] = useState('Dadar');

  // Locations list from API
  const [locationsList, setLocationsList] = useState(MUMBAI_LOCATIONS);

  // Emergency Mode Toggle
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // Route Results & Selected Active Route
  const [routes, setRoutes] = useState(() => getSafeRoutes('Kurla', 'Dadar', false));
  const [selectedRouteId, setSelectedRouteId] = useState('RT-REC-01');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadLocations() {
      try {
        const locs = await apiClient.getRoutingLocations('mumbai');
        if (isMounted && Array.isArray(locs) && locs.length > 0) {
          setLocationsList(locs);
        }
      } catch (err) {
        // Keep MUMBAI_LOCATIONS
      }
    }
    loadLocations();
    return () => { isMounted = false; };
  }, []);

  // Initial Route Fetch
  useEffect(() => {
    handleComputeRoutes(fromLocation, toLocation, isEmergencyMode);
  }, []);

  const handleComputeRoutes = async (from, to, emgMode) => {
    setIsCalculating(true);
    try {
      const res = await apiClient.computeSafeRoutes(from, to, emgMode);
      if (res && res.recommended_route) {
        const allRoutes = res.all_routes || [res.recommended_route, ...(res.alternative_routes || [])];
        setRoutes(allRoutes);
        const recommended = allRoutes.find(r => r.isRecommended) || allRoutes[0];
        setSelectedRouteId(recommended ? recommended.id : null);
        setIsCalculating(false);
        return;
      }
    } catch (err) {
      console.warn('Backend API /routes/safe unavailable, using local route calculator:', err.message);
    }

    // Local fallback
    setTimeout(() => {
      const calculated = getSafeRoutes(from, to, emgMode);
      setRoutes(calculated);
      const recommended = calculated.find(r => r.isRecommended) || calculated[0];
      setSelectedRouteId(recommended ? recommended.id : null);
      setIsCalculating(false);
    }, 150);
  };

  const handleSwapLocations = () => {
    const prevFrom = fromLocation;
    setFromLocation(toLocation);
    setToLocation(prevFrom);
    handleComputeRoutes(toLocation, prevFrom, isEmergencyMode);
  };

  const handleEmergencyModeToggle = () => {
    const nextMode = !isEmergencyMode;
    setIsEmergencyMode(nextMode);
    handleComputeRoutes(fromLocation, toLocation, nextMode);
  };

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const getSafetyScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 60) return '#ffaa00';
    return '#ff334b';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Safe Routes & Emergency Navigation</h2>
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
              FLOOD-AWARE ROUTING ACTIVE
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Finding lower-risk routes using current flood conditions and predicted inundation.
          </p>
        </div>

        {/* Emergency Response Mode Toggle */}
        <button
          onClick={handleEmergencyModeToggle}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            background: isEmergencyMode
              ? 'linear-gradient(135deg, #e63946 0%, #ba181b 100%)'
              : 'rgba(255, 255, 255, 0.05)',
            border: isEmergencyMode ? '1px solid #ff4d5a' : '1px solid var(--border-subtle)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.88rem',
            transition: 'all var(--transition-fast)',
            boxShadow: isEmergencyMode ? '0 0 20px rgba(230, 57, 70, 0.45)' : 'none'
          }}
        >
          <Shield size={18} color={isEmergencyMode ? '#ffffff' : 'var(--color-primary-light)'} />
          <span>Emergency Response Mode</span>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: 4,
            background: isEmergencyMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 180, 216, 0.2)',
            color: '#fff',
            fontFamily: 'var(--font-mono)'
          }}>
            {isEmergencyMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Emergency Mode Banner (if active) */}
      {isEmergencyMode && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 51, 75, 0.1)',
          border: '1px solid var(--color-critical-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Hospital size={16} color="var(--color-critical)" />
            <span style={{ color: '#fff', fontWeight: 600 }}>
              EMERGENCY-SAFE CORRIDORS ACTIVE: Prioritizing trauma hospitals, fire stations, and NDRF bases with high-clearance routes.
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-safe)', fontWeight: 700 }}>
            GREEN CORRIDOR DEDICATED
          </span>
        </div>
      )}

      {/* 2. Route Planner Control Bar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', flex: 1 }}>
          {/* From Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>FROM:</span>
            <select
              value={fromLocation}
              onChange={e => setFromLocation(e.target.value)}
              className="tactical-input"
              style={{ background: '#0d1728', fontWeight: 600 }}
            >
              {locationsList.map(loc => (
                <option key={loc.id} value={loc.shortName}>
                  {loc.name} ({loc.risk} Risk)
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapLocations}
            className="tactical-btn tactical-btn-ghost tactical-btn-sm"
            title="Swap Origin & Destination"
            style={{ padding: '8px 12px' }}
          >
            <RotateCcw size={14} />
          </button>

          {/* To Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>TO:</span>
            <select
              value={toLocation}
              onChange={e => setToLocation(e.target.value)}
              className="tactical-input"
              style={{ background: '#0d1728', fontWeight: 600 }}
            >
              {locationsList.map(loc => (
                <option key={loc.id} value={loc.shortName}>
                  {loc.name} ({loc.risk} Risk)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Find Safest Route Action Button */}
        <button
          onClick={() => handleComputeRoutes(fromLocation, toLocation, isEmergencyMode)}
          disabled={isCalculating}
          className="tactical-btn tactical-btn-primary"
          style={{ padding: '11px 26px', fontSize: '0.92rem', fontWeight: 800 }}
        >
          <Navigation size={16} className={isCalculating ? 'animate-spin' : ''} />
          <span>{isCalculating ? 'Computing Safe Corridors...' : 'Find Safest Route'}</span>
        </button>
      </div>

      {/* 3. Main Split: Route Results (Left) + Flood-Risk Visual Map & Intelligence (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '420px 1fr',
        gap: 20,
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Route Alternatives Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Calculated Route Alternatives ({routes.length}):
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              SELECT TO INSPECT CORRIDOR
            </span>
          </div>

          {routes.map(route => {
            const isSelected = selectedRouteId === route.id;
            const isRecommended = route.isRecommended;

            return (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`glass-panel ${isRecommended ? 'highlight-safe' : (route.status === 'Avoid' ? 'highlight-critical' : '')}`}
                style={{
                  padding: 16,
                  cursor: 'pointer',
                  border: isSelected
                    ? '2px solid var(--color-primary)'
                    : (isRecommended ? '1px solid var(--color-safe-border)' : '1px solid var(--border-subtle)'),
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.18) 0%, rgba(13, 23, 40, 0.9) 100%)'
                    : 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Header Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    background: isRecommended ? 'rgba(16, 185, 129, 0.2)' : (route.status === 'Avoid' ? 'rgba(255, 51, 75, 0.2)' : 'rgba(255, 170, 0, 0.2)'),
                    color: isRecommended ? '#34d399' : (route.status === 'Avoid' ? '#ff5e72' : '#ffbb33'),
                    border: `1px solid ${isRecommended ? 'var(--color-safe-border)' : (route.status === 'Avoid' ? 'var(--color-critical-border)' : 'var(--color-warning-border)')}`
                  }}>
                    {route.statusBadge}
                  </span>

                  <span className="mono-text" style={{
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    color: getSafetyScoreColor(route.safetyScore)
                  }}>
                    {route.safetyScore}/100 Safety
                  </span>
                </div>

                {/* Route Title */}
                <div>
                  <strong style={{ fontSize: '0.98rem', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                    {route.name}
                  </strong>
                </div>

                {/* Primary Metrics Strip */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'rgba(255, 255, 255, 0.03)',
                  fontSize: '0.78rem'
                }}>
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>Travel Time</div>
                    <div className="mono-text" style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                      {route.travelTime}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>Distance</div>
                    <div className="mono-text" style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {route.distance}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>Flood Risk</div>
                    <StatusBadge status={route.floodRisk} size="sm" />
                  </div>
                </div>

                {/* Affected Segments & Water Depth warning */}
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>
                    🌊 <strong>Exposure:</strong> {route.affectedSegments}
                  </div>
                  <div>
                    💧 <strong>Water Depth:</strong> <span style={{ color: route.status === 'Avoid' ? 'var(--color-critical)' : '#fff', fontWeight: 600 }}>{route.waterDepth}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Visual Flood-Risk Map & Route Intelligence Deck */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* 5. VISUAL FLOOD-RISK MAP CANVAS (Tactical Command View) */}
          <div className="glass-panel" style={{
            padding: 0,
            overflow: 'hidden',
            position: 'relative',
            background: 'radial-gradient(circle at 50% 50%, #0d1b2a 0%, #070d19 100%)',
            border: '1px solid var(--border-medium)',
            minHeight: 380
          }}>
            {/* Map Canvas Header Overlay */}
            <div style={{
              position: 'absolute',
              top: 14,
              left: 16,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(13, 23, 40, 0.88)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem'
            }}>
              <Compass size={16} color="var(--color-primary)" />
              <span style={{ color: '#fff', fontWeight: 700 }}>
                {fromLocation} ➔ {toLocation} Tactical Corridor Vector
              </span>
              <span style={{ color: 'var(--text-dim)' }}>|</span>
              <span style={{ color: 'var(--color-primary-light)', fontFamily: 'var(--font-mono)' }}>
                {activeRoute?.name}
              </span>
            </div>

            {/* Tactical SVG Map Artwork */}
            <svg
              viewBox="0 0 100 100"
              style={{ width: '100%', height: '380px', background: '#091322' }}
            >
              <defs>
                {/* Grid Pattern */}
                <pattern id="tacticalGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(72, 202, 228, 0.06)" strokeWidth="0.5" />
                </pattern>
                {/* Glowing Filter */}
                <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Background */}
              <rect width="100" height="100" fill="url(#tacticalGrid)" />

              {/* Simulated Coastline / Mahim Bay water body */}
              <path
                d="M 10 0 Q 22 25 18 50 T 26 100 L 0 100 L 0 0 Z"
                fill="rgba(0, 119, 182, 0.15)"
                stroke="rgba(0, 180, 216, 0.3)"
                strokeWidth="0.6"
              />

              {/* Mithi River Channel */}
              <path
                d="M 65 0 Q 55 30 45 42 T 24 52"
                fill="none"
                stroke="rgba(255, 51, 75, 0.5)"
                strokeWidth="3.5"
                strokeDasharray="2,1"
              />
              <text x="46" y="32" fill="#ff7082" fontSize="2.8" fontFamily="var(--font-mono)">
                Mithi River Channel (Overflowing)
              </text>

              {/* Hazard Zones Shading */}
              <circle cx="42" cy="38" r="8" fill="rgba(255, 51, 75, 0.25)" stroke="#ff334b" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
              <circle cx="22" cy="30" r="6" fill="rgba(255, 51, 75, 0.25)" stroke="#ff334b" strokeWidth="0.8" />
              <circle cx="36" cy="72" r="7" fill="rgba(255, 170, 0, 0.22)" stroke="#ffaa00" strokeWidth="0.8" />

              {/* Alternative / Avoid Routes (Dashed Red/Orange lines) */}
              <path
                d="M 52 34 L 42 38 L 32 52 L 35 75"
                fill="none"
                stroke="#ff334b"
                strokeWidth="1.4"
                strokeDasharray="2,2"
                opacity="0.75"
              />
              <path
                d="M 52 34 L 44 44 L 40 58 L 35 75"
                fill="none"
                stroke="#ffaa00"
                strokeWidth="1.6"
                strokeDasharray="3,1.5"
                opacity="0.85"
              />

              {/* Active Recommended Safe Route Path (Glowing Thick Cyan/Green line) */}
              {activeRoute && (
                <path
                  d="M 52 34 Q 48 44 44 54 T 35 75"
                  fill="none"
                  stroke={activeRoute.status === 'Avoid' ? '#ff334b' : (activeRoute.status === 'Caution' ? '#ffaa00' : '#00b4d8')}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  filter={activeRoute.status === 'Avoid' ? 'url(#glowRed)' : 'url(#glowCyan)'}
                />
              )}

              {/* Emergency Facilities Markers */}
              {EMERGENCY_FACILITIES.map(fac => (
                <g key={fac.id} transform={`translate(${fac.x}, ${fac.y})`}>
                  <circle cx="0" cy="0" r="3" fill="#0d1728" stroke="#10b981" strokeWidth="0.8" />
                  <text x="0" y="1" fontSize="2.8" textAnchor="middle">{fac.symbol}</text>
                  <text x="4" y="1" fill="#34d399" fontSize="2.4" fontFamily="var(--font-heading)" fontWeight="bold">
                    {fac.name}
                  </text>
                </g>
              ))}

              {/* Warning Hazard Pins */}
              {WARNING_HAZARDS.map(haz => (
                <g key={haz.id} transform={`translate(${haz.x}, ${haz.y})`}>
                  <circle cx="0" cy="0" r="2.8" fill="#ff334b" stroke="#ffffff" strokeWidth="0.6" />
                  <text x="0" y="1" fill="#ffffff" fontSize="2.4" textAnchor="middle" fontWeight="bold">!</text>
                  <text x="4" y="0" fill="#ff7082" fontSize="2.2" fontFamily="var(--font-mono)">
                    {haz.name} ({haz.depth})
                  </text>
                </g>
              ))}

              {/* Origin Marker */}
              <g transform="translate(52, 34)">
                <circle cx="0" cy="0" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                <text x="0" y="-6" fill="#10b981" fontSize="3.5" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-heading)">
                  ORIGIN: {fromLocation}
                </text>
              </g>

              {/* Destination Marker */}
              <g transform="translate(35, 75)">
                <circle cx="0" cy="0" r="4" fill="#00b4d8" stroke="#ffffff" strokeWidth="1" />
                <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                <text x="0" y="9" fill="#48cae4" fontSize="3.5" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-heading)">
                  DESTINATION: {toLocation}
                </text>
              </g>
            </svg>

            {/* Bottom Legend Bar on Map */}
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 14,
              zIndex: 10,
              background: 'rgba(13, 23, 40, 0.9)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 14, height: 3, background: '#00b4d8', display: 'inline-block' }} />
                <span>Safe Corridor</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 14, height: 3, background: '#ffaa00', display: 'inline-block' }} />
                <span>Surface Caution</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 14, height: 3, background: '#ff334b', display: 'inline-block' }} />
                <span>Submerged Road</span>
              </span>
            </div>
          </div>

          {/* 4. ROUTE INTELLIGENCE PANEL (Selected Route Deep Dive) */}
          {activeRoute && (
            <div className="glass-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              background: 'linear-gradient(135deg, rgba(13, 23, 40, 0.95) 0%, rgba(19, 34, 56, 0.9) 100%)',
              border: activeRoute.isRecommended ? '1px solid var(--color-safe-border)' : '1px solid var(--border-medium)'
            }}>
              <div className="glass-panel-header" style={{ marginBottom: 0 }}>
                <div className="glass-panel-title">
                  <Sparkles size={18} color="var(--color-primary)" />
                  <span>Route Intelligence & Safety Telemetry</span>
                </div>
                <StatusBadge status={activeRoute.floodRisk} label={`RISK: ${activeRoute.floodRisk}`} />
              </div>

              {/* 4 Visual Metric Indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {/* Metric 1: Flood Exposure */}
                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>🌊 Flood Exposure</span>
                    <span className="mono-text" style={{ fontWeight: 800, color: activeRoute.floodExposure < 20 ? 'var(--color-safe)' : 'var(--color-critical)' }}>
                      {activeRoute.floodExposure}%
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${activeRoute.floodExposure}%`, height: '100%', background: activeRoute.floodExposure < 20 ? '#10b981' : '#ff334b' }} />
                  </div>
                </div>

                {/* Metric 2: Road Accessibility */}
                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>🚗 Road Accessibility</span>
                    <span className="mono-text" style={{ fontWeight: 800, color: activeRoute.roadAccessibility > 75 ? 'var(--color-safe)' : 'var(--color-warning)' }}>
                      {activeRoute.roadAccessibility}% Clear
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${activeRoute.roadAccessibility}%`, height: '100%', background: activeRoute.roadAccessibility > 75 ? '#10b981' : '#ffaa00' }} />
                  </div>
                </div>

                {/* Metric 3: Estimated Delay */}
                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>⏱️ Estimated Delay</div>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: activeRoute.estimatedDelay.includes('+4') ? 'var(--color-safe)' : 'var(--color-warning)' }}>
                    {activeRoute.estimatedDelay}
                  </div>
                </div>

                {/* Metric 4: Risky Segments */}
                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>⚠️ Risky Segments</div>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: activeRoute.riskySegmentsCount === 0 ? 'var(--color-safe)' : 'var(--color-critical)' }}>
                    {activeRoute.riskySegmentsCount} Chokepoints
                  </div>
                </div>
              </div>

              {/* Dynamic Narrative Explanation */}
              <div style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                lineHeight: 1.5
              }}>
                💡 <strong>Route Analysis:</strong> {activeRoute.explanation}
              </div>

              {/* Nearby Emergency Hubs & Transit Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Nearby Lifelines:</span>
                  {activeRoute.nearbyEmergencyHubs?.map((hub, idx) => (
                    <span key={idx} style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(72, 202, 228, 0.1)', color: 'var(--color-primary-light)' }}>
                      {hub}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => alert(`Safe Route Navigation dispatched to Emergency Responders via Mobile Dispatch Link: ${activeRoute.name}`)}
                    className="tactical-btn tactical-btn-primary tactical-btn-sm"
                  >
                    <Share2 size={13} /> Export Corridor to GPS
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
