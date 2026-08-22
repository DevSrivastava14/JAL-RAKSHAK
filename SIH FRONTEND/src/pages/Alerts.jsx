import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  Radio,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Bell,
  Filter,
  Search,
  Check,
  Eye,
  X,
  Waves,
  CloudRain,
  Activity,
  Percent,
  Cpu,
  Mountain,
  Droplets,
  Building2,
  History,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { InundationBar } from '../components/common/InundationBar';
import { AlertModal } from '../components/common/AlertModal';
import { INITIAL_ALERTS_DATA } from '../mock/alertsData';

export function Alerts() {
  // Local Mutable State for Alerts (Frontend only)
  const [alertsList, setAlertsList] = useState(INITIAL_ALERTS_DATA);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Alert for Detail Drawer / Modal
  const [selectedAlert, setSelectedAlert] = useState(null);

  // New Broadcast Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastInitialWard, setBroadcastInitialWard] = useState('Kurla West');

  // Summary Metrics
  const activeAlertsCount = alertsList.filter(a => a.status === 'Active' || a.status === 'Dispatched').length;
  const criticalCount = alertsList.filter(a => a.severity === 'CRITICAL').length;
  const highRiskCount = alertsList.filter(a => a.severity === 'HIGH').length;
  const monitoringCount = alertsList.filter(a => a.status === 'Monitoring' || a.status === 'Acknowledged').length;

  // Filter Logic
  const filteredAlerts = alertsList.filter(alert => {
    // Severity Filter
    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) {
      return false;
    }
    // Status Filter
    if (statusFilter !== 'ALL' && alert.status !== statusFilter) {
      return false;
    }
    // Search Query (Location, Title, or Ward)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchLoc = alert.location.toLowerCase().includes(q);
      const matchTitle = alert.title.toLowerCase().includes(q);
      const matchWard = alert.wardCode.toLowerCase().includes(q);
      const matchType = alert.alertType.toLowerCase().includes(q);
      if (!matchLoc && !matchTitle && !matchWard && !matchType) {
        return false;
      }
    }
    return true;
  });

  // Action: Update Alert Status (Acknowledge / Monitoring)
  const handleUpdateStatus = (alertId, newStatus, e) => {
    if (e) e.stopPropagation();
    setAlertsList(prev => prev.map(item => {
      if (item.id === alertId) {
        const updated = { ...item, status: newStatus };
        if (selectedAlert && selectedAlert.id === alertId) {
          setSelectedAlert(updated);
        }
        return updated;
      }
      return item;
    }));
  };

  // Action: Add new broadcast alert from Modal
  const handleDispatchNewAlert = (newAlertData) => {
    const newAlert = {
      id: `ALT-MUM-${Math.floor(10 + Math.random() * 90)}`,
      capCode: `CAP-IN-MH-MUM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newAlertData.title,
      location: newAlertData.ward,
      wardCode: "Metropolitan Zone",
      alertType: newAlertData.category || "Emergency Flood Alert",
      severity: newAlertData.severity || "CRITICAL",
      status: "Dispatched",
      rainfallMmHr: 65.0,
      rainfallStr: "65.0 mm/h",
      floodProbability: 94,
      expectedImpactTime: newAlertData.leadTime || "T+15m",
      leadTimeToPeak: "30 mins",
      waterDepthM: 1.20,
      dangerThresholdM: 0.80,
      aiConfidence: 96,
      affectedPopulation: newAlertData.affectedPopEstimate || 45000,
      timestamp: "Just now",
      reportedAt: "Today, Just now",
      source: "Command Center Emergency Dispatch",
      description: newAlertData.description,
      triggerFactors: [
        {
          id: "fac-rain-custom",
          name: "Rainfall Intensity",
          measuredValue: "65.0 mm/h",
          contributionPct: 35,
          severity: "CRITICAL",
          statusColor: "#ff334b",
          explanation: "Emergency precipitation rate triggered by manual dispatcher."
        },
        {
          id: "fac-elevation-custom",
          name: "Elevation & Topography",
          measuredValue: "Urban Catchment",
          contributionPct: 25,
          severity: "HIGH",
          statusColor: "#ff7700",
          explanation: "Low-lying settlement topography creates rapid runoff accumulation."
        },
        {
          id: "fac-drain-custom",
          name: "Drainage Capacity",
          measuredValue: "High Duty Sump",
          contributionPct: 20,
          severity: "WARNING",
          statusColor: "#ffaa00",
          explanation: "Stormwater outfall conduits running at maximum design volume."
        },
        {
          id: "fac-history-custom",
          name: "Historical Flood Tendency",
          measuredValue: "Prior Flood Vulnerability",
          contributionPct: 20,
          severity: "MODERATE",
          statusColor: "#ffcc00",
          explanation: "Historical spatial flood risk weights applied."
        }
      ],
      recommendedActions: newAlertData.actionItems || [
        "Deploy emergency dewatering pumps",
        "Broadcast siren & SMS alerts",
        "Divert arterial traffic"
      ]
    };

    setAlertsList([newAlert, ...alertsList]);
  };

  const getFactorIcon = (name) => {
    if (name.toLowerCase().includes('rain')) return <CloudRain size={16} color="#ff334b" />;
    if (name.toLowerCase().includes('tide') || name.toLowerCase().includes('river')) return <Waves size={16} color="#00b4d8" />;
    if (name.toLowerCase().includes('drain') || name.toLowerCase().includes('block')) return <Droplets size={16} color="#ffaa00" />;
    if (name.toLowerCase().includes('elevation')) return <Mountain size={16} color="#ff7700" />;
    return <History size={16} color="#10b981" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* 1. Header */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(255, 51, 75, 0.12) 0%, rgba(13, 23, 40, 0.92) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Flood Alerts & Early Warning</h2>
            <StatusBadge status="CRITICAL" label={`${activeAlertsCount} ACTIVE ALERTS`} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Multi-hazard Common Alerting Protocol (CAP v1.2) emergency dispatch and real-time catchment threat tracking.
          </p>
        </div>

        <button
          onClick={() => {
            setBroadcastInitialWard('Kurla West');
            setIsBroadcastModalOpen(true);
          }}
          className="tactical-btn tactical-btn-danger"
          style={{ padding: '11px 24px', fontSize: '0.92rem', fontWeight: 700 }}
        >
          <Send size={16} />
          <span>Broadcast Emergency Alert</span>
        </button>
      </div>

      {/* 2. Summary Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        <MetricCard
          title="Active Alerts"
          value={activeAlertsCount}
          subtitle="Currently Active in City"
          icon={AlertTriangle}
          colorVariant="primary"
          status="LIVE_FEED"
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalCount}
          subtitle="Immediate Life & Property Threat"
          icon={ShieldAlert}
          colorVariant="critical"
          status="RED_ALERT"
        />
        <MetricCard
          title="High Risk Alerts"
          value={highRiskCount}
          subtitle="Subway & Track Waterlogging"
          icon={Activity}
          colorVariant="warning"
          status="ORANGE_ALERT"
        />
        <MetricCard
          title="Monitoring / Acknowledged"
          value={monitoringCount}
          subtitle="Under Observation"
          icon={CheckCircle2}
          colorVariant="safe"
          status="SUPERVISED"
        />
      </div>

      {/* 3. Filter Bar & Search Controls */}
      <div className="glass-panel" style={{
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14
      }}>
        {/* Severity Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>
            Severity:
          </span>
          {[
            { id: 'ALL', label: 'All Severities' },
            { id: 'CRITICAL', label: '🔴 Critical' },
            { id: 'HIGH', label: '🟠 High' },
            { id: 'MODERATE', label: '🟡 Moderate' },
            { id: 'ADVISORY', label: '🟢 Advisory' }
          ].map(tab => {
            const isActive = severityFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSeverityFilter(tab.id)}
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

        {/* Status Filter & Location Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="tactical-input"
              style={{
                width: 140,
                padding: '6px 10px',
                fontSize: '0.78rem',
                background: '#0d1728',
                height: 34
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Acknowledged">Acknowledged</option>
            </select>
          </div>

          {/* Location / Search Box */}
          <div style={{ position: 'relative', width: 220 }}>
            <input
              type="text"
              placeholder="Search Location or Alert..."
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
      </div>

      {/* 4. Alerts List / Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color="var(--color-primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
              Real-Time Emergency Alerts Feed ({filteredAlerts.length} Matching)
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            CLICK ANY ALERT TO OPEN FULL XAI DOSSIER
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '12px 14px' }}>Severity</th>
                <th style={{ padding: '12px 14px' }}>Location / Catchment</th>
                <th style={{ padding: '12px 14px' }}>Alert Type</th>
                <th style={{ padding: '12px 14px' }}>Rainfall</th>
                <th style={{ padding: '12px 14px' }}>Flood Probability</th>
                <th style={{ padding: '12px 14px' }}>Expected Impact Time</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => {
                  const isCritical = alert.severity === 'CRITICAL';
                  const isHigh = alert.severity === 'HIGH';
                  const isSelected = selectedAlert?.id === alert.id;

                  return (
                    <tr
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        background: isSelected
                          ? 'linear-gradient(90deg, rgba(0, 180, 216, 0.2) 0%, rgba(0, 180, 216, 0.04) 100%)'
                          : 'transparent',
                        borderLeft: isSelected ? '4px solid var(--color-primary)' : '4px solid transparent',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                    >
                      {/* Severity */}
                      <td style={{ padding: '12px 14px' }}>
                        <StatusBadge status={alert.severity} size="sm" />
                      </td>

                      {/* Location & Title */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: isSelected ? 800 : 700, color: '#ffffff' }}>
                          {alert.location}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {alert.title}
                        </div>
                      </td>

                      {/* Alert Type */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(72, 202, 228, 0.1)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.75rem',
                          color: 'var(--color-primary-light)',
                          fontWeight: 600
                        }}>
                          {alert.alertType}
                        </span>
                      </td>

                      {/* Rainfall */}
                      <td style={{ padding: '12px 14px' }}>
                        <span className="mono-text" style={{
                          fontWeight: 700,
                          color: isCritical ? 'var(--color-critical)' : (isHigh ? 'var(--color-warning)' : 'var(--text-main)')
                        }}>
                          {alert.rainfallStr}
                        </span>
                      </td>

                      {/* Flood Probability */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="mono-text" style={{
                            fontWeight: 900,
                            color: alert.floodProbability >= 80 ? 'var(--color-critical)' : (alert.floodProbability >= 50 ? 'var(--color-warning)' : 'var(--color-safe)')
                          }}>
                            {alert.floodProbability}%
                          </span>
                          <div style={{ width: 45, height: 5, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                            <div style={{
                              width: `${alert.floodProbability}%`,
                              height: '100%',
                              background: alert.floodProbability >= 80 ? 'var(--color-critical)' : (alert.floodProbability >= 50 ? 'var(--color-warning)' : 'var(--color-safe)')
                            }} />
                          </div>
                        </div>
                      </td>

                      {/* Expected Impact Time */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: alert.expectedImpactTime.includes('Immediate') || alert.expectedImpactTime.includes('Active')
                            ? 'var(--color-critical)'
                            : 'var(--color-warning)'
                        }}>
                          {alert.expectedImpactTime}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 9999,
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          background: alert.status === 'Active'
                            ? 'var(--color-critical-bg)'
                            : (alert.status === 'Dispatched' ? 'rgba(0, 180, 216, 0.18)' : 'rgba(255, 255, 255, 0.06)'),
                          color: alert.status === 'Active'
                            ? '#ff5e72'
                            : (alert.status === 'Dispatched' ? 'var(--color-primary-light)' : 'var(--text-muted)'),
                          border: `1px solid ${alert.status === 'Active' ? 'var(--color-critical-border)' : 'var(--border-subtle)'}`
                        }}>
                          {alert.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          {alert.status !== 'Acknowledged' && (
                            <button
                              onClick={(e) => handleUpdateStatus(alert.id, 'Acknowledged', e)}
                              className="tactical-btn tactical-btn-ghost tactical-btn-sm"
                              title="Mark as Acknowledged"
                              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            >
                              <Check size={12} /> Ack
                            </button>
                          )}
                          {alert.status !== 'Monitoring' && (
                            <button
                              onClick={(e) => handleUpdateStatus(alert.id, 'Monitoring', e)}
                              className="tactical-btn tactical-btn-ghost tactical-btn-sm"
                              title="Set to Monitoring"
                              style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                            >
                              <Eye size={12} /> Mon
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAlert(alert);
                            }}
                            className="tactical-btn tactical-btn-primary tactical-btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    No flood alerts matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Interactive Detail Modal / Drawer for Selected Alert */}
      {selectedAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div className="glass-panel animate-slide-down" style={{
            maxWidth: 720,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: selectedAlert.severity === 'CRITICAL' ? '1px solid var(--color-critical-border)' : '1px solid var(--border-medium)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 180, 216, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <StatusBadge status={selectedAlert.severity} />
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {selectedAlert.capCode}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {selectedAlert.reportedAt} ({selectedAlert.timestamp})
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                  {selectedAlert.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-accent)', marginTop: 4 }}>
                  📍 {selectedAlert.location} ({selectedAlert.wardCode})
                </div>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 6
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* 4 Key Telemetry Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 51, 75, 0.08)', border: '1px solid var(--color-critical-border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Flood Probability</div>
                <div className="mono-text" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-critical)' }}>
                  {selectedAlert.floodProbability}%
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>AI Prediction</div>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 170, 0, 0.08)', border: '1px solid var(--color-warning-border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Rainfall Intensity</div>
                <div className="mono-text" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-warning)' }}>
                  {selectedAlert.rainfallStr}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Radar Gauge Stream</div>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(0, 180, 216, 0.08)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Surface Water Depth</div>
                <div className="mono-text" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-primary-light)' }}>
                  {selectedAlert.waterDepthM}m
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Danger: {selectedAlert.dangerThresholdM}m</div>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--color-safe-border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>AI Confidence</div>
                <div className="mono-text" style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-safe)' }}>
                  {selectedAlert.aiConfidence}%
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Ensemble ST-GNN</div>
              </div>
            </div>

            {/* Description & Situation Note */}
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Situational Briefing:
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5, background: 'rgba(0, 0, 0, 0.25)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                {selectedAlert.description}
              </p>
            </div>

            {/* "WHY THIS ALERT WAS TRIGGERED" - Explainable AI Factors */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Cpu size={18} color="var(--color-primary)" />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff' }}>
                  Why this alert was triggered (Explainable AI Attribution):
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedAlert.triggerFactors.map(factor => (
                  <div
                    key={factor.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {getFactorIcon(factor.name)}
                        <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{factor.name}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          ({factor.measuredValue || factor.value})
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="mono-text" style={{ fontSize: '0.92rem', fontWeight: 800, color: factor.statusColor }}>
                          {factor.contributionPct}% Weight
                        </span>
                        <StatusBadge status={factor.severity} size="sm" />
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${factor.contributionPct * 2.5}%`,
                        maxWidth: '100%',
                        height: '100%',
                        background: factor.statusColor
                      }} />
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      💡 {factor.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Response Actions */}
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
                Mandatory Standard Operating Procedures (SOP):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedAlert.recommendedActions.map((action, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                      color: 'var(--text-main)'
                    }}
                  >
                    <CheckCircle2 size={15} color="var(--color-safe)" style={{ flexShrink: 0 }} />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 14
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedAlert.status !== 'Acknowledged' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAlert.id, 'Acknowledged')}
                    className="tactical-btn tactical-btn-ghost"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <Check size={14} /> Mark Acknowledged
                  </button>
                )}
                {selectedAlert.status !== 'Monitoring' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAlert.id, 'Monitoring')}
                    className="tactical-btn tactical-btn-ghost"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <Eye size={14} /> Set to Monitoring
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setBroadcastInitialWard(selectedAlert.location);
                  setIsBroadcastModalOpen(true);
                }}
                className="tactical-btn tactical-btn-danger"
                style={{ fontSize: '0.85rem' }}
              >
                <Send size={15} /> Broadcast Escalation Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Broadcast Modal */}
      <AlertModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onDispatch={handleDispatchNewAlert}
        initialWard={broadcastInitialWard}
      />
    </div>
  );
}
