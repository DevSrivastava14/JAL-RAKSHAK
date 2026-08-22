import React from 'react';

export function InundationBar({ currentDepthM = 0, dangerDepthM = 2.0, maxScaleM = 3.0, label = "Water Depth" }) {
  const percentage = Math.min(100, Math.max(0, (currentDepthM / maxScaleM) * 100));
  const dangerPct = (dangerDepthM / maxScaleM) * 100;

  const isDanger = currentDepthM >= dangerDepthM;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className="mono-text" style={{ fontWeight: 700, color: isDanger ? 'var(--color-critical)' : 'var(--text-main)' }}>
          {currentDepthM.toFixed(2)}m <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>/ {dangerDepthM}m danger</span>
        </span>
      </div>

      <div style={{
        position: 'relative',
        height: 10,
        borderRadius: 6,
        background: 'rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Progress fill */}
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          borderRadius: 6,
          background: isDanger
            ? 'linear-gradient(90deg, #ffaa00 0%, #ff334b 100%)'
            : 'linear-gradient(90deg, #00b4d8 0%, #48cae4 100%)',
          boxShadow: isDanger ? '0 0 10px rgba(255, 51, 75, 0.6)' : 'none',
          transition: 'width 0.4s ease'
        }} />

        {/* Danger marker notch */}
        <div style={{
          position: 'absolute',
          left: `${dangerPct}%`,
          top: 0,
          bottom: 0,
          width: 2,
          background: 'rgba(255, 255, 255, 0.8)',
          zIndex: 2
        }} />
      </div>
    </div>
  );
}
