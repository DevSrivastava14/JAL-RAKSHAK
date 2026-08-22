import React from 'react';

export function RadarWidget({ intensityMmHr = 68.4, station = "Santacruz Doppler Radar" }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <div className="radar-sweep-container">
        <div className="radar-ring radar-ring-1" />
        <div className="radar-ring radar-ring-2" />
        <div className="radar-ring radar-ring-3" />
        <div className="radar-crosshair-x" />
        <div className="radar-crosshair-y" />
        <div className="radar-scanner-beam" />
        
        {/* Simulated convective storm echoes */}
        <div style={{
          position: 'absolute',
          top: '32%',
          left: '58%',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ff334b 0%, rgba(255, 51, 75, 0.2) 80%)',
          boxShadow: '0 0 10px #ff334b',
          animation: 'pulseAnimation 1.5s infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '55%',
          left: '42%',
          width: 18,
          height: 12,
          borderRadius: '40%',
          background: 'radial-gradient(circle, #ffaa00 0%, rgba(255, 170, 0, 0.2) 80%)',
          boxShadow: '0 0 8px #ffaa00'
        }} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span className="status-badge critical" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
            RADAR LIVE (S-BAND)
          </span>
        </div>
        <div className="mono-text" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {intensityMmHr} <span style={{ fontSize: '0.85rem', color: 'var(--text-accent)' }}>mm/h</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {station}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--color-critical)', marginTop: 2 }}>
          Convective cloud cluster moving NE
        </div>
      </div>
    </div>
  );
}
