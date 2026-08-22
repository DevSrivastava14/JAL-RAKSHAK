import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  CloudRain,
  ShieldAlert,
  RefreshCw,
  Send,
  Radio,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { StatusBadge } from './common/StatusBadge';
import { AlertModal } from './common/AlertModal';
import { useAlerts } from '../hooks/useFloodData';

export function Navbar({ onRefresh, isRefreshing = false }) {
  const [timeStr, setTimeStr] = useState('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const { dispatchAlert } = useAlerts();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setTimeStr(new Intl.DateTimeFormat('en-GB', options).format(now) + ' IST');
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBroadcast = (alertData) => {
    dispatchAlert(alertData);
  };

  return (
    <>
      <header style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 90,
        flexShrink: 0
      }}>
        {/* Left Side: Threat Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 14px',
            background: 'var(--color-critical-bg)',
            border: '1px solid var(--color-critical-border)',
            borderRadius: 'var(--radius-md)'
          }}>
            <ShieldAlert size={18} color="var(--color-critical)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-critical)', letterSpacing: '0.04em' }}>
                THREAT LEVEL: ORANGE
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>|</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 500 }}>
                High Inundation Risk in Kurla & Hindmata Catchments
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Live Metrics, Clock, and Emergency Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Weather / Rain Rate */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem'
          }}>
            <CloudRain size={16} color="var(--color-primary-light)" />
            <span style={{ color: 'var(--text-muted)' }}>City Rain:</span>
            <span className="mono-text" style={{ color: 'var(--text-main)', fontWeight: 700 }}>48.5 mm/h</span>
          </div>

          {/* Real-time Clock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem'
          }}>
            <Clock size={16} color="var(--text-accent)" />
            <span className="mono-text" style={{ color: 'var(--text-accent)', fontWeight: 700 }}>
              {timeStr || '14:32:10 IST'}
            </span>
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="tactical-btn tactical-btn-ghost tactical-btn-sm"
              title="Refresh SCADA telemetry stream"
              disabled={isRefreshing}
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          )}

          {/* Emergency Alert Trigger */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="tactical-btn tactical-btn-danger"
            style={{ fontSize: '0.82rem', padding: '7px 14px' }}
          >
            <Send size={15} />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </header>

      {/* Broadcast Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onDispatch={handleBroadcast}
      />
    </>
  );
}
