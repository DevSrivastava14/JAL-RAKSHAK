import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CarFront,
  ChevronDown,
  CloudRain,
  Droplets,
  Eye,
  Factory,
  HeartPulse,
  Hospital,
  Landmark,
  MapPin,
  Megaphone,
  Navigation,
  PackageOpen,
  Radio,
  Route,
  School,
  ShieldAlert,
  Siren,
    TrafficCone,
  Wrench,
  Zap
} from 'lucide-react';
import { CircleMarker, MapContainer, Polygon, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { StatusBadge } from '../components/common/StatusBadge';
import { FLOOD_RISK_ZONES } from '../mock/gisData';
import { runModularSimulation } from '../services/simulationEngine';

const HOTSPOTS = [
  {
    id: 'hindmata', name: 'Hindmata', zone: 'Dadar', risk: 'HIGH', onset: '42 min', depth: '40–60 cm', priority: 'P1 — Immediate', status: 'Action Required', center: [19.0178, 72.8478], zoneId: 'ZONE-HIN-02',
    factors: ['Heavy Rainfall', 'Low-Lying Terrain', 'Drainage Capacity Constraint', 'Predicted Water Accumulation'], impact: { hospitals: 2, schools: 4, roads: 6, residential: 8 }
  },
  {
    id: 'sion', name: 'Sion', zone: 'Central Corridor', risk: 'HIGH', onset: '30 min', depth: '30–50 cm', priority: 'P1 — Immediate', status: 'Prepare Resources', center: [19.0400, 72.8600], zoneId: 'ZONE-SIO-04',
    factors: ['Heavy Rainfall', 'Arterial Road Sump', 'Drainage Capacity Constraint', 'Rail Corridor Exposure'], impact: { hospitals: 1, schools: 3, roads: 5, residential: 7 }
  },
  {
    id: 'mahim', name: 'Mahim Causeway', zone: 'Western Edge', risk: 'MODERATE', onset: '58 min', depth: '20–35 cm', priority: 'P2 — Prepare', status: 'Monitor Closely', center: [19.0426, 72.8397], zoneId: 'ZONE-MIL-03',
    factors: ['Heavy Rainfall', 'Tidal Backflow Potential', 'Constricted Outfall', 'Predicted Water Accumulation'], impact: { hospitals: 1, schools: 2, roads: 3, residential: 5 }
  },
  {
    id: 'dadar-west', name: 'Dadar Station', zone: 'West', risk: 'HIGH', onset: '35 min', depth: '35–55 cm', priority: 'P1 — Immediate', status: 'Action Required', center: [19.0195, 72.8423], zoneId: 'ZONE-HIN-02',
    factors: ['Heavy Rainfall', 'Low-Lying Terrain', 'Transit Node Exposure', 'Predicted Water Accumulation'], impact: { hospitals: 2, schools: 3, roads: 6, residential: 6 }
  }
];

const AUTHORITY_ACTIONS = [
  { title: 'Drainage Inspection', priority: 'HIGH', detail: 'Inspect nearby storm-water drainage bottlenecks before predicted inundation.', icon: Wrench, why: 'Jal-Rakshak identifies a combination of intense rainfall, low-lying terrain and drainage constraints that may increase local water accumulation.' },
  { title: 'Traffic Management', priority: 'HIGH', detail: 'Prepare diversion for road segments inside the predicted inundation zone.', icon: TrafficCone, why: 'The predicted inundation zone overlaps with road segments that may become unsafe.' },
  { title: 'Pump Deployment', priority: 'HIGH', detail: 'Prepare available dewatering resources near the predicted hotspot.', icon: Droplets, why: 'Additional pumping capacity can reduce accumulation where drainage throughput is constrained.' },
  { title: 'Critical Infrastructure Watch', priority: 'MEDIUM', detail: 'Monitor access to hospitals, schools and transport nodes in the impact area.', icon: Landmark, why: 'Flooded access routes can disrupt essential services before buildings themselves are affected.' },
  { title: 'Emergency Standby', priority: 'MEDIUM', detail: 'Keep emergency-response teams ready for localized rescue and access support.', icon: Siren, why: 'A short onset window leaves less time to mobilize once water levels rise.' },
  { title: 'Localized Public Warning', priority: 'HIGH', detail: 'Issue a targeted warning to residents and commuters near the hotspot.', icon: Megaphone, why: 'Flood onset is predicted within the operational warning window.' }
];

const CITIZEN_ACTIONS = [
  { text: 'Avoid entering predicted flood zones.', icon: ShieldAlert },
  { text: 'Avoid underpasses and waterlogged roads.', icon: Route },
  { text: 'Do not drive through floodwater.', icon: CarFront },
  { text: 'Move essential belongings to higher levels if flooding threatens your premises.', icon: PackageOpen },
  { text: 'Keep your phone, medicines, documents, water and emergency supplies accessible.', icon: HeartPulse },
  { text: 'Follow official evacuation and traffic instructions.', icon: Radio }
];

const RESPONSE_STATUS = [
  ['Rainfall Monitoring', 'ACTIVE', 'safe'], ['Flood Prediction', 'ACTIVE', 'safe'], ['Risk Assessment', 'COMPLETED', 'safe'],
  ['Traffic Advisory', 'RECOMMENDED', 'warning'], ['Drainage Inspection', 'RECOMMENDED', 'warning'], ['Citizen Alert', 'READY', 'advisory'], ['Infrastructure Monitoring', 'ACTIVE', 'safe']
];

function MapFocus({ center }) {
  const map = useMap();
  React.useEffect(() => { map.flyTo(center, 13.5, { duration: 0.8 }); }, [center, map]);
  return null;
}

function SectionHeader({ eyebrow, title, icon: Icon, aside }) {
  return <div className="glass-panel-header" style={{ marginBottom: 16 }}><div><div style={{ color: 'var(--text-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: 800 }}>{eyebrow}</div><div className="glass-panel-title" style={{ marginTop: 4 }}><Icon size={18} /><span>{title}</span></div></div>{aside}</div>;
}

function ActionCard({ action }) {
  const [open, setOpen] = useState(false);
  const Icon = action.icon;
  return <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'rgba(7, 13, 25, 0.38)', padding: 14 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}><div className="action-icon"><Icon size={18} /></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}><strong style={{ fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{action.title}</strong><StatusBadge status={action.priority} label={action.priority} pulse={false} size="sm" /></div><p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.45, marginTop: 6 }}>{action.detail}</p><div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}><span style={{ fontSize: '0.68rem', color: 'var(--color-warning)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>PENDING AUTHORITY CONFIRMATION</span><button className="why-button" onClick={() => setOpen(!open)} aria-expanded={open}>Why? <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none' }} /></button></div>{open && <div className="why-copy">{action.why}</div>}</div></div>
  </div>;
}

export function ActionCenter() {
  const [selectedId, setSelectedId] = useState('hindmata');
  const [actionTab, setActionTab] = useState('authority');
  const [rainfall, setRainfall] = useState(75);
  const [blockage, setBlockage] = useState(40);
  const [simulation, setSimulation] = useState(() => runModularSimulation({ rainfallIntensity: 75, rainfallDuration: 120, drainageEfficiency: 70, drainageBlockage: 40 }));
  const selected = HOTSPOTS.find(hotspot => hotspot.id === selectedId) || HOTSPOTS[0];
  const zone = FLOOD_RISK_ZONES.find(item => item.id === selected.zoneId);

  const runSimulation = () => setSimulation(runModularSimulation({ rainfallIntensity: rainfall, rainfallDuration: 120, drainageEfficiency: 70, drainageBlockage: blockage }));

  return <div className="action-center" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <section className="glass-panel action-hero">
      <div><div className="eyebrow">JAL-RAKSHAK / OPERATIONAL RESPONSE</div><h1>ACTION CENTER</h1><p>From Flood Prediction to Immediate Action</p><div className="response-flow"><span>PREDICT</span><ArrowRight size={15} /><span>ASSESS</span><ArrowRight size={15} /><span>PRIORITIZE</span><ArrowRight size={15} /><span className="flow-active">ACT</span></div></div>
      <div className="risk-banner"><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="alert-pulse"><AlertCircle size={22} /></span><div><div className="eyebrow">MUMBAI FLOOD RESPONSE STATUS</div><strong>HIGH FLOOD RISK DETECTED</strong></div></div><div className="status-grid"><div><span>FORECAST WINDOW</span><b>Next 15 min – 2 hrs</b></div><div><span>OVERALL CITY RISK</span><b style={{ color: 'var(--color-critical)' }}>HIGH</b></div><div><span>RESPONSE STATUS</span><b>PREPARE & RESPOND</b></div></div></div>
    </section>

    <section className="action-map-grid">
      <div className="glass-panel hotspot-panel"><SectionHeader eyebrow="01 / FLOOD HOTSPOTS" title="Priority locations" icon={MapPin} aside={<span className="demo-label">SIMULATED MODEL OUTPUTS</span>} /><div className="hotspot-list">{HOTSPOTS.map(hotspot => <button key={hotspot.id} className={`hotspot-card ${selectedId === hotspot.id ? 'selected' : ''}`} onClick={() => setSelectedId(hotspot.id)}><div className="hotspot-card-top"><div><strong>{hotspot.name}</strong><span>{hotspot.zone}</span></div><StatusBadge status={hotspot.risk} label={hotspot.risk} /></div><div className="hotspot-metrics"><div><small>ONSET</small><b>{hotspot.onset}</b></div><div><small>DEPTH</small><b>{hotspot.depth}</b></div><div><small>PRIORITY</small><b className="priority-text">{hotspot.priority}</b></div></div><div className="hotspot-status"><span><span className={`pulse-dot ${hotspot.risk === 'MODERATE' ? 'pulse-warning' : ''}`} />{hotspot.status}</span><span>{selectedId === hotspot.id ? 'SELECTED' : 'ASSESS'} <ArrowRight size={13} /></span></div></button>)}</div></div>
      <div className="glass-panel action-map"><SectionHeader eyebrow="LIVE GIS VIEW" title="Mumbai risk zones" icon={MapPin} aside={<span className="map-legend"><i className="legend-dot critical" /> HIGH <i className="legend-dot moderate" /> MODERATE</span>} /><div style={{ height: 420 }}><MapContainer center={selected.center} zoom={12} scrollWheelZoom={false}><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapFocus center={selected.center} />{HOTSPOTS.map(hotspot => <React.Fragment key={hotspot.id}><CircleMarker center={hotspot.center} radius={selectedId === hotspot.id ? 11 : 7} pathOptions={{ color: hotspot.risk === 'MODERATE' ? '#ffcc00' : '#ff334b', fillColor: hotspot.risk === 'MODERATE' ? '#ffcc00' : '#ff334b', fillOpacity: 0.75, weight: selectedId === hotspot.id ? 3 : 1 }}><Tooltip>{hotspot.name} / {hotspot.risk}</Tooltip><Popup><strong>{hotspot.name} — {hotspot.zone}</strong><br />{hotspot.priority}<br />Prototype/model output</Popup></CircleMarker>{hotspot.id === selected.id && zone?.polygonCoords && <Polygon positions={zone.polygonCoords} pathOptions={{ color: '#ff334b', fillColor: '#ff334b', fillOpacity: 0.12, weight: 1, dashArray: '5 5' }} />}</React.Fragment>)}</MapContainer></div></div>
    </section>

    <section className="glass-panel assessment-panel"><SectionHeader eyebrow="02 / LOCATION ASSESSMENT" title={selected.name + ' — ' + selected.zone} icon={Eye} aside={<StatusBadge status={selected.risk} label={`${selected.risk} RISK`} />} /><div className="assessment-grid"><div className="key-metric"><span>FLOOD RISK</span><strong className="critical-value">{selected.risk}</strong></div><div className="key-metric"><span>EXPECTED ONSET</span><strong>{selected.onset === '42 min' ? '42 minutes' : selected.onset}</strong></div><div className="key-metric"><span>EXPECTED WATER DEPTH</span><strong>{selected.depth}</strong></div><div className="key-metric"><span>PRIORITY</span><strong>{selected.priority}</strong></div></div><div className="risk-reason"><div><div className="eyebrow">WHY IS THIS AREA AT RISK?</div><p>Model factors indicate a local accumulation risk. These are representative prototype values and do not claim that the location is currently flooding.</p></div><div className="factor-list">{selected.factors.map(factor => <span key={factor}>{factor}</span>)}</div></div></section>

    <section className="glass-panel"><SectionHeader eyebrow="03 / IMPACT ASSESSMENT" title="What may be affected?" icon={Factory} aside={<span className="demo-label">PROTOTYPE / MODEL OUTPUT</span>} /><div className="impact-grid">{[[Hospital, 'Hospitals at Risk', selected.impact.hospitals], [School, 'Schools at Risk', selected.impact.schools], [CarFront, 'Major Road Segments', selected.impact.roads], [Landmark, 'Residential Zones', selected.impact.residential]].map(([Icon, label, value]) => <div className="impact-card" key={label}><Icon size={20} /><strong>{value}</strong><span>{label}</span></div>)}</div></section>

    <section className="glass-panel"><SectionHeader eyebrow="04 / RECOMMENDED ACTIONS" title="Response playbook" icon={Siren} aside={<div className="tab-switch"><button className={actionTab === 'authority' ? 'active' : ''} onClick={() => setActionTab('authority')}>AUTHORITY ACTIONS</button><button className={actionTab === 'citizen' ? 'active' : ''} onClick={() => setActionTab('citizen')}>CITIZEN SAFETY</button></div>} />{actionTab === 'authority' ? <div className="action-list">{AUTHORITY_ACTIONS.map(action => <ActionCard key={action.title} action={action} />)}</div> : <div className="citizen-panel"><div className="citizen-callout"><ShieldAlert size={27} /><div><strong>IF FLOODING IS EXPECTED IN YOUR AREA:</strong><span>Stay out of waterlogged areas and follow official instructions.</span></div></div><div className="citizen-grid">{CITIZEN_ACTIONS.map(({ text: item, icon: Icon }) => <div className="citizen-item" key={item}><Icon size={23} /><span>{item}</span></div>)}</div></div>}</section>

    <section className="two-column"><div className="glass-panel"><SectionHeader eyebrow="05 / ROAD & TRAVEL ALERT" title="Travel advisory" icon={Navigation} /><div className="avoid-list"><strong><AlertTriangle size={16} /> AVOID</strong>{['Predicted inundation zones', 'Low-lying roads', 'Underpasses', 'Roads with rapidly increasing water levels'].map(item => <span key={item}>• {item}</span>)}</div><div className="safe-routing"><div><Route size={20} /><div><strong>SAFE ROUTING</strong><p>Generate or display an alternate route only when confirmed safe by available flood and road data.</p></div></div><button className="tactical-btn tactical-btn-ghost" onClick={() => window.location.href = '/routes'}>Open Safe Routes <ArrowRight size={15} /></button></div></div><div className="glass-panel"><SectionHeader eyebrow="06 / ACTION PRIORITY" title="Operational priority" icon={Zap} /><div className="priority-stack"><div className="priority-row p1"><b>P1 — IMMEDIATE</b><span>Flood expected soon + severe impact</span><small>Emergency preparedness • Traffic management • Drainage inspection • Public warning</small></div><div className="priority-row p2"><b>P2 — PREPARE</b><span>Flood risk increasing</span><small>Monitor • Prepare resources • Issue precautionary advisory</small></div><div className="priority-row p3"><b>P3 — MONITOR</b><span>Potential risk but no immediate threat</span><small>Continue monitoring • Wait for updated prediction</small></div></div></div></section>

    <section className="two-column"><div className="glass-panel"><SectionHeader eyebrow="07 / LIVE RESPONSE STATUS" title="Command readiness" icon={Activity} /><div className="live-status-list">{RESPONSE_STATUS.map(([label, status, tone]) => <div key={label}><span><i className={`status-dot ${tone}`} />{label}</span><b className={tone}>{status}</b></div>)}</div></div><div className="glass-panel simulation-panel"><SectionHeader eyebrow="08 / WHAT-IF SIMULATION" title="Stress test the response" icon={CloudRain} aside={<span className="demo-label">LOCAL DEMO ENGINE</span>} /><div className="slider-row"><label>Rainfall Intensity <b>{rainfall} mm/h</b></label><input className="tactical-slider" type="range" min="10" max="150" step="5" value={rainfall} onChange={event => setRainfall(Number(event.target.value))} /></div><div className="slider-row"><label>Drainage Blockage <b>{blockage}%</b></label><input className="tactical-slider" type="range" min="0" max="100" step="5" value={blockage} onChange={event => setBlockage(Number(event.target.value))} /></div><button className="tactical-btn tactical-btn-primary" onClick={runSimulation}><Activity size={16} /> RUN SIMULATION</button><div className="simulation-results"><div><span>PREDICTED RISK</span><b>{simulation.riskTier}</b></div><div><span>EXPECTED DEPTH</span><b>{simulation.estimatedWaterDepthM} m</b></div><div><span>TIME TO FLOOD</span><b>{simulation.estimatedTimeToFlooding.replace('T+', '')}</b></div><div><span>AFFECTED AREA</span><b>{simulation.affectedAreaSqKm} km²</b></div></div></div></section>
  </div>;
}
