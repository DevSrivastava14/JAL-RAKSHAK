import React, { useState, useEffect } from 'react';
import {
  Server,
  Building2,
  AlertTriangle,
  Activity,
  Zap,
  Waves,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Navigation,
  Train,
  Hospital,
  Flame,
  Home,
  Droplets,
  Radio,
  Sliders,
  Send,
  X,
  PhoneCall,
  ExternalLink,
  Percent,
  Check
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { InundationBar } from '../components/common/InundationBar';
import { AlertModal } from '../components/common/AlertModal';
import {
  INFRASTRUCTURE_ASSETS,
  INFRA_SUMMARY_METRICS
} from '../mock/infrastructureData';
import { useAlerts } from '../hooks/useFloodData';
import { apiClient } from '../services/apiClient';

export function Infrastructure() {
  const { dispatchAlert } = useAlerts();

  // State for assets list from API with fallback
  const [assetsList, setAssetsList] = useState(INFRASTRUCTURE_ASSETS);
  const [loading, setLoading] = useState(false);

  // Filter & Search State
  const [filterType, setFilterType] = useState('ALL'); // ALL, CRITICAL, HIGH, OPERATIONAL, AFFECTED
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Asset for Right-Side Detail Panel
  const [selectedAssetId, setSelectedAssetId] = useState(INFRASTRUCTURE_ASSETS[0].id);

  // Broadcast Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [modalInitialWard, setModalInitialWard] = useState('Kurla West');

  useEffect(() => {
    let isMounted = true;
    async function loadInfra() {
      try {
        setLoading(true);
        const data = await apiClient.getInfrastructure('mumbai');
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAssetsList(data);
        }
      } catch (err) {
        console.warn('Backend API /infrastructure/mumbai unavailable, using local mock infrastructure:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInfra();
    return () => { isMounted = false; };
  }, []);

  // Active Selected Asset
  const selectedAsset = assetsList.find(a => a.id === selectedAssetId) || assetsList[0];

  // Dynamic counts
  const totalMonitored = assetsList.length;
  const criticalCount = assetsList.filter(a => a.impactSeverity === 'CRITICAL').length;
  const atRiskCount = assetsList.filter(a => a.currentFloodRisk === 'CRITICAL' || a.currentFloodRisk === 'HIGH').length;
  const affectedDisruptions = assetsList.filter(a => a.operationalStatusType !== 'OPERATIONAL').length;

  // Filter logic
  const filteredAssets = assetsList.filter(asset => {
    // Filter Category
    if (filterType === 'CRITICAL' && asset.impactSeverity !== 'CRITICAL') return false;
    if (filterType === 'HIGH' && asset.currentFloodRisk !== 'HIGH') return false;
    if (filterType === 'OPERATIONAL' && asset.operationalStatusType !== 'OPERATIONAL') return false;
    if (filterType === 'AFFECTED' && asset.operationalStatusType === 'OPERATIONAL') return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = asset.name.toLowerCase().includes(q);
      const matchLoc = asset.location.toLowerCase().includes(q);
      const matchCat = asset.category.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchCat) return false;
    }
    return true;
  });

  const getCategoryIcon = (categoryType) => {
    switch (categoryType) {
      case 'TRANSIT': return <Train size={16} color="#00b4d8" />;
      case 'HEALTHCARE': return <Hospital size={16} color="#ff334b" />;
      case 'ROAD_NETWORK': return <Navigation size={16} color="#ffaa00" />;
      case 'UTILITY': return <Zap size={16} color="#ff7700" />;
      case 'DRAINAGE': return <Droplets size={16} color="#10b981" />;
      case 'SHELTER': return <Home size={16} color="#8b5cf6" />;
      default: return <Server size={16} color="var(--color-primary)" />;
    }
  };

  const getDimensionColor = (score) => {
    if (score >= 75) return '#ff334b';
    if (score >= 50) return '#ff7700';
    if (score >= 25) return '#ffcc00';
    return '#10b981';
  };

  const handleOpenBroadcast = () => {
    setModalInitialWard(selectedAsset.location);
    setIsAlertModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Header */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.12) 0%, rgba(13, 23, 40, 0.92) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Infrastructure Impact Assessment</h2>
            <StatusBadge status="ACTIVE_MONITORING" label="CRITICAL ASSETS SCADA" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Assessing flood exposure across critical urban infrastructure.
          </p>
        </div>

        <button
          onClick={handleOpenBroadcast}
          className="tactical-btn tactical-btn-danger"
          style={{ padding: '10px 22px', fontSize: '0.9rem', fontWeight: 700 }}
        >
          <Send size={16} />
          <span>Dispatch Infrastructure Alert</span>
        </button>
      </div>

      {/* 2. Summary Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        <MetricCard
          title="Assets Monitored"
          value={totalMonitored}
          subtitle="Transit, Power, Health, SWD"
          icon={Server}
          colorVariant="primary"
          status="ONLINE"
        />
        <MetricCard
          title="At Risk"
          value={atRiskCount}
          subtitle="Exposed to Surcharged Runoff"
          icon={AlertTriangle}
          colorVariant="warning"
          status="ELEVATED"
        />
        <MetricCard
          title="Critical"
          value={criticalCount}
          subtitle="Severe Operational Exposure"
          icon={ShieldAlert}
          colorVariant="critical"
          status="CRITICAL"
        />
        <MetricCard
          title="Estimated Disruptions"
          value={affectedDisruptions}
          subtitle="Transit & Road Closures"
          icon={Activity}
          colorVariant="critical"
          status="DISRUPTED"
        />
      </div>

      {/* 3. Filter Bar & Search Controls */}
      <div className="glass-panel" style={{
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>
            Filter:
          </span>
          {[
            { id: 'ALL', label: `All (${totalMonitored})` },
            { id: 'CRITICAL', label: `🔴 Critical (${criticalCount})` },
            { id: 'HIGH', label: `🟠 High Risk (${assetsList.filter(a => a.currentFloodRisk === 'HIGH').length})` },
            { id: 'OPERATIONAL', label: `🟢 Operational (${assetsList.filter(a => a.operationalStatusType === 'OPERATIONAL').length})` },
            { id: 'AFFECTED', label: `⚡ Affected (${affectedDisruptions})` }
          ].map(tab => {
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  background: isActive ? 'rgba(0, 180, 216, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Location / Search Box */}
        <div style={{ position: 'relative', width: 240 }}>
          <input
            type="text"
            placeholder="Search Asset, Category, Ward..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="tactical-input"
            style={{
              padding: '6px 10px 6px 30px',
              fontSize: '0.78rem',
              height: 34
            }}
          />
          <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: 9, top: 10 }} />
        </div>
      </div>

      {/* 4. Main Split: Infrastructure Table (Left) + Detail Panel (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: 18,
        alignItems: 'start'
      }}>
        {/* LEFT: Infrastructure Impact Table */}
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 size={18} color="var(--color-primary)" />
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff' }}>
                Critical Asset Exposure Matrix ({filteredAssets.length} Assets)
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              CLICK ROW TO INSPECT 4-DIMENSION RISK
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '10px 12px' }}>Asset Name</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Location</th>
                  <th style={{ padding: '10px 12px' }}>Current Flood Risk</th>
                  <th style={{ padding: '10px 12px' }}>Est. Water Depth</th>
                  <th style={{ padding: '10px 12px' }}>Operational Status</th>
                  <th style={{ padding: '10px 12px' }}>Impact Severity</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map(asset => {
                    const isSelected = selectedAssetId === asset.id;
                    const isCritical = asset.impactSeverity === 'CRITICAL';
                    const isHigh = asset.impactSeverity === 'HIGH';

                    return (
                      <tr
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
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
                        {/* Asset Name */}
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {getCategoryIcon(asset.categoryType)}
                            <div>
                              <strong style={{ color: isSelected ? '#ffffff' : 'var(--text-main)', fontSize: '0.88rem' }}>
                                {asset.name}
                              </strong>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                                {asset.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {asset.category}
                          </span>
                        </td>

                        {/* Location */}
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#fff' }}>
                            {asset.location}
                          </span>
                        </td>

                        {/* Current Flood Risk */}
                        <td style={{ padding: '12px' }}>
                          <StatusBadge status={asset.currentFloodRisk} size="sm" />
                        </td>

                        {/* Estimated Water Depth */}
                        <td style={{ padding: '12px' }}>
                          <span className="mono-text" style={{
                            fontWeight: 800,
                            color: asset.estimatedWaterDepthM >= asset.safeThresholdM ? 'var(--color-critical)' : 'var(--color-safe)'
                          }}>
                            {asset.estimatedWaterDepthM.toFixed(2)}m
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginLeft: 4 }}>
                            (Safe: {asset.safeThresholdM}m)
                          </span>
                        </td>

                        {/* Operational Status */}
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: asset.operationalStatusType === 'OPERATIONAL'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : (asset.operationalStatusType === 'CLOSED' ? 'rgba(255, 51, 75, 0.18)' : 'rgba(255, 170, 0, 0.15)'),
                            color: asset.operationalStatusType === 'OPERATIONAL'
                              ? '#34d399'
                              : (asset.operationalStatusType === 'CLOSED' ? '#ff5e72' : '#ffbb33'),
                            border: `1px solid ${asset.operationalStatusType === 'OPERATIONAL' ? 'var(--color-safe-border)' : (asset.operationalStatusType === 'CLOSED' ? 'var(--color-critical-border)' : 'var(--color-warning-border)')}`
                          }}>
                            {asset.operationalStatus}
                          </span>
                        </td>

                        {/* Impact Severity */}
                        <td style={{ padding: '12px' }}>
                          <StatusBadge status={asset.impactSeverity} size="sm" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '35px', color: 'var(--text-muted)' }}>
                      No infrastructure assets matching the filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Selected Asset Detail Panel */}
        {selectedAsset && (
          <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'sticky',
            top: 10,
            border: selectedAsset.impactSeverity === 'CRITICAL' ? '1px solid var(--color-critical-border)' : '1px solid var(--border-medium)',
            background: 'linear-gradient(135deg, rgba(13, 23, 40, 0.95) 0%, rgba(19, 34, 56, 0.92) 100%)'
          }}>
            {/* Asset Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {selectedAsset.category} • {selectedAsset.id}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginTop: 2 }}>
                    {selectedAsset.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>
                    📍 {selectedAsset.location}
                  </div>
                </div>

                <StatusBadge status={selectedAsset.impactSeverity} size="sm" />
              </div>

              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 8, marginTop: 8 }}>
                <span>Operator: <strong style={{ color: '#fff' }}>{selectedAsset.operator}</strong></span>
                <span>Affected: <strong style={{ color: 'var(--color-warning)' }}>{selectedAsset.dailyUsersAffected.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Inundation & Operational Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 51, 75, 0.08)', border: '1px solid var(--color-critical-border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Surface Water Depth</div>
                <div className="mono-text" style={{ fontSize: '1.25rem', fontWeight: 900, color: selectedAsset.estimatedWaterDepthM >= selectedAsset.safeThresholdM ? 'var(--color-critical)' : 'var(--color-safe)' }}>
                  {selectedAsset.estimatedWaterDepthM.toFixed(2)}m
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Safe Limit: {selectedAsset.safeThresholdM}m</div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(0, 180, 216, 0.08)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Operational State</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', marginTop: 4, lineHeight: 1.3 }}>
                  {selectedAsset.operationalStatus}
                </div>
              </div>
            </div>

            {/* Nearby Flood Zone Reference */}
            <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Adjacent Catchment Zone: </span>
              <strong style={{ color: 'var(--text-accent)' }}>{selectedAsset.nearbyFloodZone}</strong>
            </div>

            {/* 5. VISUAL RISK INDICATORS FOR THE 4 KEY DIMENSIONS */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={15} color="var(--color-primary)" />
                <span>4-Dimensional Risk Impact Analysis:</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Dimension 1: Access Disruption */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>🚗 Access Disruption</span>
                    <span className="mono-text" style={{ fontWeight: 800, color: getDimensionColor(selectedAsset.riskDimensions.accessDisruption) }}>
                      {selectedAsset.riskDimensions.accessDisruption}% Disrupted
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedAsset.riskDimensions.accessDisruption}%`, height: '100%', background: getDimensionColor(selectedAsset.riskDimensions.accessDisruption) }} />
                  </div>
                </div>

                {/* Dimension 2: Structural Exposure */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>🏗️ Structural Exposure</span>
                    <span className="mono-text" style={{ fontWeight: 800, color: getDimensionColor(selectedAsset.riskDimensions.structuralExposure) }}>
                      {selectedAsset.riskDimensions.structuralExposure}% Submerged
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedAsset.riskDimensions.structuralExposure}%`, height: '100%', background: getDimensionColor(selectedAsset.riskDimensions.structuralExposure) }} />
                  </div>
                </div>

                {/* Dimension 3: Utility Disruption */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>⚡ Utility Disruption</span>
                    <span className="mono-text" style={{ fontWeight: 800, color: getDimensionColor(selectedAsset.riskDimensions.utilityDisruption) }}>
                      {selectedAsset.riskDimensions.utilityDisruption}% Grid Load Strained
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedAsset.riskDimensions.utilityDisruption}%`, height: '100%', background: getDimensionColor(selectedAsset.riskDimensions.utilityDisruption) }} />
                  </div>
                </div>

                {/* Dimension 4: Emergency Importance */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>🚨 Emergency Importance</span>
                    <span className="mono-text" style={{ fontWeight: 800, color: 'var(--color-primary-light)' }}>
                      Tier 1 Priority ({selectedAsset.riskDimensions.emergencyImportance}/100)
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedAsset.riskDimensions.emergencyImportance}%`, height: '100%', background: 'linear-gradient(90deg, #00b4d8 0%, #48cae4 100%)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Disruption Narrative */}
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                Estimated Disruption Impact:
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.45, background: 'rgba(0, 0, 0, 0.25)', padding: 10, borderRadius: 'var(--radius-md)' }}>
                {selectedAsset.estimatedDisruption}
              </p>
            </div>

            {/* Recommended Response SOPs */}
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Recommended Action Protocols:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {selectedAsset.recommendedResponse.map((rec, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.76rem',
                      color: 'var(--text-main)'
                    }}
                  >
                    <CheckCircle2 size={13} color="var(--color-safe)" style={{ flexShrink: 0 }} />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action: Broadcast Warning */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, display: 'flex', gap: 8 }}>
              <button
                onClick={handleOpenBroadcast}
                className="tactical-btn tactical-btn-danger"
                style={{ width: '100%', fontSize: '0.82rem', padding: '9px 14px' }}
              >
                <Send size={14} /> Broadcast Warning For {selectedAsset.name.split(' ')[0]}
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
        initialWard={modalInitialWard}
      />
    </div>
  );
}
