import React, { useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polygon, TileLayer, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Check,
  Droplets,
  Gauge,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Waves,
  Zap
} from 'lucide-react';

const SYNTHETIC_ZONES = [
  { id: 'Z01', name: 'Kurla Low-Lying Zone', type: 'low', center: [19.0728, 72.8826], floodRisk: 88, drainageCapacity: 32, rainfall: 68, storageCapacity: 5000, pumpCapacity: 20 },
  { id: 'Z02', name: 'Sion Drainage Catchment', type: 'low', center: [19.0400, 72.8600], floodRisk: 81, drainageCapacity: 36, rainfall: 62, storageCapacity: 4200, pumpCapacity: 18 },
  { id: 'Z03', name: 'Dadar Surface Basin', type: 'low', center: [19.0178, 72.8478], floodRisk: 85, drainageCapacity: 34, rainfall: 65, storageCapacity: 4600, pumpCapacity: 19 },
  { id: 'Z04', name: 'Andheri Elevated Catchment', type: 'high', center: [19.1197, 72.8464], floodRisk: 42, drainageCapacity: 58, rainfall: 54, storageCapacity: 2600, pumpCapacity: 10 },
  { id: 'Z05', name: 'Malabar Hill Higher Zone', type: 'high', center: [18.9557, 72.8055], floodRisk: 24, drainageCapacity: 72, rainfall: 48, storageCapacity: 1800, pumpCapacity: 6 },
  { id: 'Z06', name: 'Powai Higher Ground Zone', type: 'high', center: [19.1176, 72.9060], floodRisk: 31, drainageCapacity: 64, rainfall: 57, storageCapacity: 2200, pumpCapacity: 8 }
];

const zonePolygon = (center, spread = 0.008) => [
  [center[0] + spread, center[1] - spread],
  [center[0] + spread * 0.85, center[1] + spread * 1.1],
  [center[0] - spread * 0.85, center[1] + spread],
  [center[0] - spread, center[1] - spread * 0.75]
];

function FocusSelectedZone({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, 11.5, { duration: 0.6 });
  }, [center, map]);
  return null;
}

const panelStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
};

const labelStyle = { color: 'var(--text-accent)', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' };

function Metric({ label, value, tone = 'var(--text-main)' }) {
  return <div style={{ padding: '13px 14px', background: 'rgba(7, 13, 25, 0.42)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}><div style={labelStyle}>{label}</div><strong style={{ display: 'block', color: tone, fontSize: 21, marginTop: 7 }}>{value}</strong></div>;
}

export function DrainageMitigation() {
  const [selectedId, setSelectedId] = useState('Z01');
  const [pumpingEnabled, setPumpingEnabled] = useState(false);
  const [storageEnabled, setStorageEnabled] = useState(false);
  const [mapZoom, setMapZoom] = useState(11);
  const selected = SYNTHETIC_ZONES.find(zone => zone.id === selectedId) || SYNTHETIC_ZONES[0];

  const result = useMemo(() => {
    const pumpReduction = pumpingEnabled ? 18 : 0;
    const storageReduction = storageEnabled ? 14 : 0;
    const probability = Math.max(4, selected.floodRisk - pumpReduction - storageReduction);
    const baseDepth = Math.max(8, (selected.rainfall - selected.drainageCapacity) * 1.15);
    const depth = Math.max(4, baseDepth * (pumpingEnabled ? 0.72 : 1) * (storageEnabled ? 0.78 : 1));
    const runoff = Math.max(0, (selected.rainfall - selected.drainageCapacity) * 150);
    const remaining = Math.max(0, runoff - (pumpingEnabled ? selected.pumpCapacity * 55 : 0) - (storageEnabled ? selected.storageCapacity * 0.55 : 0));
    return { probability, depth: Math.round(depth), remaining: Math.round(remaining) };
  }, [pumpingEnabled, selected, storageEnabled]);

  const recommendation = pumpingEnabled && storageEnabled
    ? 'Combined pumping and underground storage provides the strongest simulated reduction in flood impact.'
    : pumpingEnabled
      ? 'Temporary pumping can reduce accumulated surface water in this vulnerable catchment.'
      : storageEnabled
        ? 'Underground storage can temporarily retain part of the incoming runoff.'
        : selected.type === 'low'
          ? 'This is a high-risk catchment. Try a mitigation option to simulate its effect.'
          : 'This higher-lying area has comparatively lower intervention priority; continue monitoring.';

  const toggleStyle = enabled => ({ border: `1px solid ${enabled ? 'var(--color-safe)' : 'var(--border-subtle)'}`, background: enabled ? 'var(--color-safe-bg)' : 'rgba(7, 13, 25, 0.32)', borderRadius: 'var(--radius-md)', padding: 15, textAlign: 'left', cursor: 'pointer', width: '100%', color: 'var(--text-main)' });

  return <div style={{ minHeight: '100%', background: 'var(--bg-primary)', margin: -24, padding: 24, color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>
    <div style={{ maxWidth: 1500, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div><div style={{ color: 'var(--text-accent)', fontSize: 12, fontWeight: 800, letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}>JAL-RAKSHAK / WATER SYSTEMS</div><h1 style={{ color: 'var(--text-main)', fontSize: 30, margin: '7px 0 4px' }}>Rainfall–Drainage Mitigation Simulator</h1><p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>Explore two focused interventions for catchments where rainfall can exceed effective drainage capacity.</p></div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(350px, 0.8fr)', gap: 20, alignItems: 'start' }}>
        <section style={{ ...panelStyle, overflow: 'hidden' }}>
          <div style={{ padding: '17px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid var(--border-subtle)' }}><div><h2 style={{ fontSize: 17, margin: 0 }}>Mumbai Drainage Zones</h2><p style={{ color: 'var(--text-muted)', margin: '5px 0 0', fontSize: 12 }}>Select a zone to inspect its demonstration inputs.</p></div><div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}><span><i style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: 'var(--color-critical)', marginRight: 5 }} />Low-lying / high risk</span><span><i style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: 'var(--color-warning)', marginRight: 5 }} />Higher-lying / lower risk</span></div></div>
          <div style={{ height: 610, position: 'relative' }}><MapContainer center={[19.0760, 72.8777]} zoom={mapZoom} scrollWheelZoom><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><FocusSelectedZone center={selected.center} />{SYNTHETIC_ZONES.map(zone => { const active = zone.id === selected.id; const color = zone.type === 'low' ? '#d9485f' : '#e0aa20'; return <React.Fragment key={zone.id}><Polygon positions={zonePolygon(zone.center, zone.type === 'low' ? 0.009 : 0.008)} pathOptions={{ color, fillColor: color, fillOpacity: active ? 0.42 : 0.22, weight: active ? 3 : 1.5 }} eventHandlers={{ click: () => setSelectedId(zone.id) }}><Tooltip sticky>{zone.name} · {zone.floodRisk}% synthetic risk</Tooltip></Polygon><CircleMarker center={zone.center} radius={active ? 8 : 5} pathOptions={{ color: '#ffffff', weight: 2, fillColor: color, fillOpacity: 1 }} eventHandlers={{ click: () => setSelectedId(zone.id) }} /></React.Fragment>; })}</MapContainer><div style={{ position: 'absolute', left: 14, bottom: 14, zIndex: 500, ...panelStyle, padding: 10, fontSize: 11, color: '#61758a' }}><strong style={{ display: 'block', color: '#17324d', marginBottom: 5 }}>Map legend</strong><div><i style={{ display: 'inline-block', width: 11, height: 11, background: '#d9485f', marginRight: 6, verticalAlign: -1 }} />Low-lying / High Flood Risk</div><div style={{ marginTop: 4 }}><i style={{ display: 'inline-block', width: 11, height: 11, background: '#e0aa20', marginRight: 6, verticalAlign: -1 }} />Higher-lying / Lower Flood Risk</div></div><div style={{ position: 'absolute', right: 14, top: 14, zIndex: 500, display: 'flex', flexDirection: 'column', gap: 4 }}><button aria-label="Zoom in" onClick={() => setMapZoom(value => Math.min(15, value + 1))} style={{ border: 0, background: '#fff', padding: 7, cursor: 'pointer', boxShadow: '0 1px 5px #999' }}><Plus size={15} /></button><button aria-label="Zoom out" onClick={() => setMapZoom(value => Math.max(9, value - 1))} style={{ border: 0, background: '#fff', padding: 7, cursor: 'pointer', boxShadow: '0 1px 5px #999' }}><Minus size={15} /></button></div></div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <section style={{ ...panelStyle, padding: 18 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary-light)', ...labelStyle }}><MapPin size={15} /> SELECTED CATCHMENT</div><h2 style={{ color: 'var(--text-main)', fontSize: 21, margin: '8px 0 15px' }}>{selected.name}</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 9 }}><Metric label="Rainfall" value={`${selected.rainfall} mm/hr`} tone="var(--color-primary-light)" /><Metric label="Drainage capacity" value={`${selected.drainageCapacity} mm/hr`} /><Metric label="Flood probability" value={`${selected.floodRisk}%`} tone={selected.type === 'low' ? 'var(--color-critical)' : 'var(--color-warning)'} /><Metric label="Priority" value={selected.type === 'low' ? 'Higher' : 'Lower'} tone={selected.type === 'low' ? 'var(--color-critical)' : 'var(--color-safe)'} /></div><div style={{ marginTop: 13, padding: 10, color: 'var(--color-warning)', background: 'var(--color-warning-bg)', borderRadius: 'var(--radius-sm)', fontSize: 11, lineHeight: 1.45 }}>Synthetic values for demonstration only. These are not official BMC measurements or drain-by-drain hydraulic data.</div></section>

          <section style={{ ...panelStyle, padding: 18 }}><div style={labelStyle}>MITIGATION INTERVENTIONS</div><div style={{ display: 'grid', gap: 10, marginTop: 12 }}><button onClick={() => setPumpingEnabled(value => !value)} style={toggleStyle(pumpingEnabled)}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}><span style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 800 }}><Waves size={19} color="#087ea4" /> Temporary Pumping</span><span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', border: `1px solid ${pumpingEnabled ? '#218c74' : '#b7c5d2'}`, color: '#218c74' }}>{pumpingEnabled && <Check size={14} />}</span></div><p style={{ color: '#61758a', fontSize: 12, lineHeight: 1.45, margin: '9px 0 0' }}>Simulates temporary dewatering to remove accumulated surface water from a vulnerable catchment.</p></button><button onClick={() => setStorageEnabled(value => !value)} style={toggleStyle(storageEnabled)}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}><span style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 800 }}><Droplets size={19} color="#087ea4" /> Rainwater Harvesting / Underground Storage</span><span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', border: `1px solid ${storageEnabled ? '#218c74' : '#b7c5d2'}`, color: '#218c74' }}>{storageEnabled && <Check size={14} />}</span></div><p style={{ color: '#61758a', fontSize: 12, lineHeight: 1.45, margin: '9px 0 0' }}>Simulates temporary underground storage of excess rainfall/runoff before it enters the drainage system.</p></button></div></section>

          <section style={{ ...panelStyle, padding: 18, borderTop: '3px solid var(--color-safe)' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={labelStyle}>SIMULATED IMPACT</div><Zap size={17} color="var(--color-safe)" /></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}><Metric label="Flood probability" value={`${result.probability}%`} tone="var(--color-safe)" /><Metric label="Water depth" value={`${result.depth} cm`} tone="var(--color-safe)" /><Metric label="Excess water" value={`${result.remaining.toLocaleString()} m³`} tone="var(--color-safe)" /></div><div style={{ marginTop: 15, paddingTop: 13, borderTop: '1px solid var(--border-subtle)' }}><div style={labelStyle}>JAL-RAKSHAK RECOMMENDATION</div><p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5, margin: '7px 0 0' }}>{recommendation}</p></div><button onClick={() => { setPumpingEnabled(false); setStorageEnabled(false); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 13, border: 0, background: 'transparent', color: 'var(--color-primary-light)', padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><RotateCcw size={14} /> Reset interventions</button></section>
        </aside>
      </div>
      <p style={{ color: '#7b8c9d', fontSize: 11, textAlign: 'right', margin: '12px 0 0' }}>Prototype / Synthetic Data — For Demonstration Only</p>
    </div>
  </div>;
}
