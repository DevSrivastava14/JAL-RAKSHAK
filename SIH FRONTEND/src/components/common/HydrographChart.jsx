import React, { useState } from 'react';

export function HydrographChart({
  timeline = [],
  dangerLevel = 3.00,
  warningLevel = 2.70,
  locationName = "Kurla West Catchment",
  height = 240
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No hydrograph data available
      </div>
    );
  }

  // Calculate scales
  const maxWaterLevel = Math.max(...timeline.map(t => t.waterLevelKurlaM), dangerLevel + 0.5);
  const minWaterLevel = Math.min(...timeline.map(t => t.waterLevelKurlaM), 1.0);
  const range = maxWaterLevel - minWaterLevel || 1;

  const chartWidth = 700;
  const chartHeight = 180;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };

  const usableWidth = chartWidth - padding.left - padding.right;
  const usableHeight = chartHeight - padding.top - padding.bottom;

  // Convert points to SVG coordinates
  const points = timeline.map((item, index) => {
    const x = padding.left + (index / (timeline.length - 1)) * usableWidth;
    const y = padding.top + usableHeight - ((item.waterLevelKurlaM - minWaterLevel) / range) * usableHeight;
    return { x, y, data: item };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`;

  // Danger and Warning line Y
  const dangerY = padding.top + usableHeight - ((dangerLevel - minWaterLevel) / range) * usableHeight;
  const warningY = padding.top + usableHeight - ((warningLevel - minWaterLevel) / range) * usableHeight;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Station: <strong style={{ color: 'var(--text-main)' }}>{locationName}</strong></span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 2, background: 'var(--color-critical)', display: 'inline-block' }} />
            <span style={{ color: 'var(--color-critical)', fontSize: '0.75rem', fontWeight: 600 }}>Danger ({dangerLevel}m)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 2, background: 'var(--color-warning)', display: 'inline-block' }} />
            <span style={{ color: 'var(--color-warning)', fontSize: '0.75rem', fontWeight: 600 }}>Warning ({warningLevel}m)</span>
          </div>
        </div>
        <span className="status-badge critical" style={{ fontSize: '0.7rem' }}>
          AI 0-6H ENSEMBLE
        </span>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id="hydroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 51, 75, 0.45)" />
            <stop offset="50%" stopColor="rgba(0, 180, 216, 0.25)" />
            <stop offset="100%" stopColor="rgba(0, 180, 216, 0.02)" />
          </linearGradient>
          <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00b4d8" />
            <stop offset="40%" stopColor="#ffaa00" />
            <stop offset="60%" stopColor="#ff334b" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const yVal = padding.top + usableHeight * ratio;
          const labelVal = (maxWaterLevel - ratio * range).toFixed(1);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={yVal}
                x2={chartWidth - padding.right}
                y2={yVal}
                stroke="rgba(255, 255, 255, 0.07)"
                strokeDasharray="4,4"
              />
              <text
                x={padding.left - 8}
                y={yVal + 3}
                fill="var(--text-dim)"
                fontSize="10"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                {labelVal}m
              </text>
            </g>
          );
        })}

        {/* Danger Level Line */}
        <line
          x1={padding.left}
          y1={dangerY}
          x2={chartWidth - padding.right}
          y2={dangerY}
          stroke="var(--color-critical)"
          strokeWidth="1.5"
          strokeDasharray="6,4"
        />

        {/* Warning Level Line */}
        <line
          x1={padding.left}
          y1={warningY}
          x2={chartWidth - padding.right}
          y2={warningY}
          stroke="var(--color-warning)"
          strokeWidth="1.5"
          strokeDasharray="6,4"
        />

        {/* Area fill */}
        <path d={areaD} fill="url(#hydroGradient)" />

        {/* Main curve line */}
        <path d={pathD} fill="none" stroke="url(#lineStroke)" strokeWidth="3" strokeLinecap="round" />

        {/* Data points */}
        {points.map((pt, idx) => {
          const isBreached = pt.data.waterLevelKurlaM >= dangerLevel;
          const isHovered = hoveredIndex === idx;

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 7 : (isBreached ? 5 : 4)}
                fill={isBreached ? 'var(--color-critical)' : 'var(--color-primary)'}
                stroke="#070d19"
                strokeWidth="2"
              />
              {/* X Axis Time Labels */}
              <text
                x={pt.x}
                y={chartHeight - padding.bottom + 18}
                fill={isHovered ? 'var(--text-accent)' : 'var(--text-muted)'}
                fontSize="10"
                fontFamily="var(--font-mono)"
                fontWeight={isHovered ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {pt.data.timeLabel.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* Hover inspection line & tooltip */}
        {hoveredIndex !== null && (
          <g>
            <line
              x1={points[hoveredIndex].x}
              y1={padding.top}
              x2={points[hoveredIndex].x}
              y2={chartHeight - padding.bottom}
              stroke="rgba(72, 202, 228, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          </g>
        )}
      </svg>

      {/* Dynamic Hover Card */}
      {hoveredIndex !== null && (
        <div style={{
          marginTop: 8,
          padding: '8px 14px',
          background: 'rgba(13, 23, 40, 0.95)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <div>Time: <strong style={{ color: 'var(--text-accent)' }}>{timeline[hoveredIndex].timeLabel}</strong></div>
          <div>Water Level: <strong style={{ color: timeline[hoveredIndex].waterLevelKurlaM >= dangerLevel ? 'var(--color-critical)' : 'var(--color-primary)' }}>{timeline[hoveredIndex].waterLevelKurlaM}m</strong></div>
          <div>Precipitation: <strong style={{ color: '#fff' }}>{timeline[hoveredIndex].rainfallIntensityMmHr} mm/h</strong></div>
          <div>Confidence: <strong style={{ color: 'var(--color-safe)' }}>{timeline[hoveredIndex].confidencePct}%</strong></div>
        </div>
      )}
    </div>
  );
}
