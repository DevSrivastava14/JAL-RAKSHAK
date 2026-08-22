import React from 'react';
import { StatusBadge } from './StatusBadge';

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = false,
  status,
  statusLabel,
  colorVariant = 'primary', // 'primary', 'critical', 'warning', 'safe'
  footerAction,
  className = ''
}) {
  const getVariantClass = () => {
    switch (colorVariant) {
      case 'critical':
        return 'highlight-critical';
      case 'warning':
        return 'highlight-warning';
      default:
        return '';
    }
  };

  const getIconColor = () => {
    switch (colorVariant) {
      case 'critical':
        return '#ff334b';
      case 'warning':
        return '#ffaa00';
      case 'safe':
        return '#10b981';
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <div className={`glass-panel metric-card ${getVariantClass()} ${className}`} style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {Icon && (
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: `rgba(${colorVariant === 'critical' ? '255, 51, 75' : '0, 180, 216'}, 0.12)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${getIconColor()}`
            }}>
              <Icon size={20} color={getIconColor()} />
            </div>
          )}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
        </div>
        {status && <StatusBadge status={status} label={statusLabel} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
        <span className="mono-text" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '0.95rem', color: 'var(--text-accent)', fontWeight: 600 }}>
            {unit}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
        {subtitle && <span>{subtitle}</span>}
        {trend && (
          <span className="mono-text" style={{
            color: trendPositive ? 'var(--color-safe)' : 'var(--color-critical)',
            fontWeight: 600
          }}>
            {trend}
          </span>
        )}
      </div>

      {footerAction && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
          {footerAction}
        </div>
      )}
    </div>
  );
}
