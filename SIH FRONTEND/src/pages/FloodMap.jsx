import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Radio,
  Server,
  Home,
  AlertTriangle,
  Droplets,
  Eye,
  Info,
  Maximize2,
  Navigation,
  Crosshair,
  Search,
  Building2,
  Shield,
  Activity,
  PhoneCall,
  CheckCircle2,
  X,
  Send,
  Zap,
  Clock,
  Compass,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { InundationBar } from '../components/common/InundationBar';
import { AlertModal } from '../components/common/AlertModal';
import {
  FLOOD_RISK_ZONES,
  ROADS_DATA,
  DRAINAGE_NODES,
  HOSPITALS_DATA,
  SCHOOLS_DATA,
  EMERGENCY_STATIONS_DATA,
  RISK_COLORS,
  RISK_BG_COLORS,
  getFeatureRiskColor,
  getFeatureRiskBg
} from '../mock/gisData';
import { useAlerts } from '../hooks/useFloodData';
import { apiClient } from '../services/apiClient';

// Custom Tactical Leaflet Pin Icons
const createDivIcon = (bgColor, borderColor, textSymbol, shadowColor) => {
  return L.divIcon({
    className: 'tactical-custom-marker',
    html: `<div style="
      background: ${bgColor};
      border: 2px solid ${borderColor};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      box-shadow: 0 0 14px ${shadowColor || borderColor};
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.15s ease;
    ">${textSymbol}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const iconDrainageChoked = createDivIcon('#ff334b', '#ffffff', '🚰', 'rgba(255, 51, 75, 0.7)');
const iconDrainageHigh = createDivIcon('#ff7700', '#ffffff', '🚰', 'rgba(255, 119, 0, 0.7)');
const iconDrainageNormal = createDivIcon('#00b4d8', '#ffffff', '🚰', 'rgba(0, 180, 216, 0.7)');

const iconHospitalCritical = createDivIcon('#ff334b', '#ffffff', '✚', 'rgba(255, 51, 75, 0.7)');
const iconHospitalSafe = createDivIcon('#10b981', '#ffffff', '✚', 'rgba(16, 185, 129, 0.7)');

const iconSchoolShelter = createDivIcon('#8b5cf6', '#ffffff', '🏫', 'rgba(139, 92, 246, 0.7)');
const iconEmergencyStation = createDivIcon('#0284c7', '#ffffff', '🚒', 'rgba(2, 132, 199, 0.7)');

// Helper component to pan/zoom map programmatically
function MapController({ targetCenter, targetZoom }) {
  const map = useMap();
  useEffect(() => {
    if (targetCenter) {
      map.flyTo(targetCenter, targetZoom || 13, { duration: 1.2 });
    }
  }, [targetCenter, targetZoom, map]);
  return null;
}

export function FloodMap() {
  const { dispatchAlert } = useAlerts();

  // Real-time GIS Datasets with fallback
  const [zonesList, setZonesList] = useState(FLOOD_RISK_ZONES);
  const [roadsList, setRoadsList] = useState(ROADS_DATA);
  const [drainageList, setDrainageList] = useState(DRAINAGE_NODES);
  const [hospitalsList, setHospitalsList] = useState(HOSPITALS_DATA);
  const [schoolsList, setSchoolsList] = useState(SCHOOLS_DATA);
  const [emergencyList, setEmergencyList] = useState(EMERGENCY_STATIONS_DATA);
  const [loading, setLoading] = useState(false);

  // Layer Visibility Controls
  const [layers, setLayers] = useState({
    floodZones: true,
    roads: true,
    drainageNodes: true,
    hospitals: true,
    schools: true,
    emergencyStations: true
  });

  // Risk Level Filter
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Feature for Details Panel
  const [selectedFeature, setSelectedFeature] = useState({
    type: 'FLOOD_ZONE',
    data: FLOOD_RISK_ZONES[0] // Default to Kurla West
  });

  // Map Center controller state
  const [mapTarget, setMapTarget] = useState({ center: [19.0688, 72.8600], zoom: 12 });

  // Broadcast Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [modalInitialWard, setModalInitialWard] = useState('Kurla West');

  useEffect(() => {
    let isMounted = true;
    async function loadMapData() {
      try {
        setLoading(true);
        const data = await apiClient.getFloodMap('mumbai');
        if (isMounted && data) {
          if (data.zones && data.zones.length > 0) setZonesList(data.zones);
          if (data.roads && data.roads.length > 0) setRoadsList(data.roads);
          if (data.drainage && data.drainage.length > 0) setDrainageList(data.drainage);
          if (data.hospitals && data.hospitals.length > 0) setHospitalsList(data.hospitals);
          if (data.shelters && data.shelters.length > 0) setSchoolsList(data.shelters);
        }
      } catch (err) {
        console.warn('Backend API /flood-map/mumbai unavailable, using local GIS layers:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadMapData();
    return () => { isMounted = false; };
  }, []);

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Filtered flood zones based on risk filter and search query
  const filteredZones = zonesList.filter(zone => {
    if (riskFilter !== 'ALL' && zone.riskLevel !== riskFilter) return false;
    if (searchQuery.trim() && !zone.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Filtered roads
  const filteredRoads = roadsList.filter(road => {
    if (riskFilter !== 'ALL' && road.riskLevel !== riskFilter) return false;
    if (searchQuery.trim() && !road.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Filtered drainage nodes
  const filteredDrainage = drainageList.filter(drain => {
    if (searchQuery.trim() && !drain.name.toLowerCase().includes(searchQuery.toLowerCase()) && !drain.ward.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Filtered hospitals
  const filteredHospitals = hospitalsList.filter(hosp => {
    if (searchQuery.trim() && !hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) && !hosp.ward.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Filtered schools
  const filteredSchools = schoolsList.filter(school => {
    if (searchQuery.trim() && !school.name.toLowerCase().includes(searchQuery.toLowerCase()) && !school.ward.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Filtered emergency stations
  const filteredEmergency = emergencyList.filter(stn => {
    if (searchQuery.trim() && !stn.name.toLowerCase().includes(searchQuery.toLowerCase()) && !stn.ward.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSelectFeature = (type, data, coords) => {
    setSelectedFeature({ type, data });
    if (coords) {
      setMapTarget({ center: coords, zoom: 14 });
    }
  };

  const openBroadcastForCurrent = () => {
    setModalInitialWard(selectedFeature.data?.name || selectedFeature.data?.ward || 'Kurla West');
    setIsAlertModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100vh - 110px)', minHeight: 650 }}>
      {/* Top Map Toolbar: Layer Toggles & Search */}
      <div className="glass-panel" style={{
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
      }}>
        {/* Left Side: Title & Layer Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 6 }}>
            <Layers size={18} color="var(--color-primary)" />
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '0.02em' }}>
              GIS FLOOD COMMAND MATRIX
            </span>
          </div>

          {/* Layer Toggle Badges */}
          <button
            onClick={() => toggleLayer('floodZones')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              border: layers.floodZones ? '1px solid var(--color-critical)' : '1px solid var(--border-subtle)',
              background: layers.floodZones ? 'rgba(255, 51, 75, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: layers.floodZones ? '#ff7082' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Droplets size={14} /> Flood Zones ({FLOOD_RISK_ZONES.length})
          </button>

          <button
            onClick={() => toggleLayer('roads')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              border: layers.roads ? '1px solid #ffaa00' : '1px solid var(--border-subtle)',
              background: layers.roads ? 'rgba(255, 170, 0, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: layers.roads ? '#ffbb33' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Navigation size={14} /> Roads ({ROADS_DATA.length})
          </button>

          <button
            onClick={() => toggleLayer('drainageNodes')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              border: layers.drainageNodes ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              background: layers.drainageNodes ? 'rgba(0, 180, 216, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: layers.drainageNodes ? 'var(--color-primary-light)' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Radio size={14} /> Drainage Nodes ({DRAINAGE_NODES.length})
          </button>

          <button
            onClick={() => toggleLayer('hospitals')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              border: layers.hospitals ? '1px solid var(--color-safe)' : '1px solid var(--border-subtle)',
              background: layers.hospitals ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: layers.hospitals ? '#34d399' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Activity size={14} /> Hospitals ({HOSPITALS_DATA.length})
          </button>

          <button
            onClick={() => toggleLayer('schools')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              border: layers.schools ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
              background: layers.schools ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: layers.schools ? '#a78bfa' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Building2 size={14} /> Schools / Shelters ({SCHOOLS_DATA.length})
          </button>

          <button
            onClick={() => toggleLayer('emergencyStations')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              border: layers.emergencyStations ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
              background: layers.emergencyStations ? 'rgba(2, 132, 199, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: layers.emergencyStations ? '#38bdf8' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Shield size={14} /> Police & Fire ({EMERGENCY_STATIONS_DATA.length})
          </button>
        </div>

        {/* Right Side: Risk Filter & Live Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Risk Tier Chips */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="tactical-input"
            style={{
              width: 150,
              padding: '6px 10px',
              fontSize: '0.78rem',
              background: '#0d1728',
              height: 34
            }}
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">🔴 Critical Risk</option>
            <option value="HIGH">🟠 High Risk</option>
            <option value="MODERATE">🟡 Moderate Risk</option>
            <option value="LOW">🟢 Low Risk</option>
          </select>

          {/* Search Box */}
          <div style={{ position: 'relative', width: 190 }}>
            <input
              type="text"
              placeholder="Search Ward/Road/Drain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Main Map + Interactive Details Split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 16,
        flex: 1,
        minHeight: 0
      }}>
        {/* Leaflet Map Frame */}
        <div className="glass-panel" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
          <MapContainer
            center={[19.0688, 72.8600]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <MapController targetCenter={mapTarget.center} targetZoom={mapTarget.zoom} />

            {/* OpenStreetMap Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 1. Flood Risk Zones (Polygons) */}
            {layers.floodZones && filteredZones.map(zone => {
              const isSelected = selectedFeature?.data?.id === zone.id;
              const color = getFeatureRiskColor(zone.riskLevel);
              const fillColor = getFeatureRiskBg(zone.riskLevel);

              return (
                <Polygon
                  key={zone.id}
                  positions={zone.polygonCoords}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.6 : 0.38,
                    weight: isSelected ? 3.5 : (zone.riskLevel === 'CRITICAL' ? 2.5 : 1.5),
                    dashArray: zone.riskLevel === 'CRITICAL' ? '6, 6' : null
                  }}
                  eventHandlers={{
                    click: () => handleSelectFeature('FLOOD_ZONE', zone, zone.center)
                  }}
                >
                  <Tooltip direction="center" permanent={zone.riskLevel === 'CRITICAL' || isSelected} opacity={0.92}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.82rem' }}>
                      <span style={{ color }}>●</span> {zone.name}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Depth: {zone.waterDepthM}m ({zone.riskLevel})
                      </div>
                    </div>
                  </Tooltip>
                </Polygon>
              );
            })}

            {/* 2. Major Roads / Arterial Corridors (Polylines) */}
            {layers.roads && filteredRoads.map(road => {
              const isSelected = selectedFeature?.data?.id === road.id;
              const roadColor = road.status === 'SUBMERGED_CLOSED'
                ? '#ff334b'
                : (road.status === 'WATERLOGGED_SLOW' ? '#ffaa00' : '#10b981');

              return (
                <Polyline
                  key={road.id}
                  positions={road.coordinates}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : roadColor,
                    weight: isSelected ? 6 : (road.status === 'SUBMERGED_CLOSED' ? 5 : 4),
                    opacity: 0.9,
                    dashArray: road.status === 'SUBMERGED_CLOSED' ? '8, 8' : null
                  }}
                  eventHandlers={{
                    click: () => handleSelectFeature('ROAD', road, road.coordinates[0])
                  }}
                >
                  <Tooltip direction="top" opacity={0.9}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem' }}>
                      🛣️ {road.name}
                      <div style={{ fontSize: '0.72rem', color: roadColor }}>
                        {road.statusLabel} ({road.waterDepthM}m)
                      </div>
                    </div>
                  </Tooltip>
                </Polyline>
              );
            })}

            {/* 3. Drainage Nodes & Outfalls (Markers) */}
            {layers.drainageNodes && filteredDrainage.map(node => {
              const icon = node.status === 'CHOKED'
                ? iconDrainageChoked
                : (node.status === 'HIGH_LOAD' ? iconDrainageHigh : iconDrainageNormal);

              return (
                <Marker
                  key={node.id}
                  position={[node.lat, node.lng]}
                  icon={icon}
                  eventHandlers={{
                    click: () => handleSelectFeature('DRAINAGE_NODE', node, [node.lat, node.lng])
                  }}
                >
                  <Tooltip direction="top" offset={[0, -16]} opacity={0.9}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem' }}>
                      🚰 {node.name}
                      <div style={{ fontSize: '0.72rem', color: node.status === 'CHOKED' ? '#ff334b' : '#00b4d8' }}>
                        Flow: {node.currentFlowM3s} m³/s | Blockage: {node.blockagePct}%
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}

            {/* 4. Critical Hospitals (Markers) */}
            {layers.hospitals && filteredHospitals.map(hosp => {
              const icon = hosp.riskLevel === 'CRITICAL' ? iconHospitalCritical : iconHospitalSafe;

              return (
                <Marker
                  key={hosp.id}
                  position={[hosp.lat, hosp.lng]}
                  icon={icon}
                  eventHandlers={{
                    click: () => handleSelectFeature('HOSPITAL', hosp, [hosp.lat, hosp.lng])
                  }}
                >
                  <Tooltip direction="top" offset={[0, -16]} opacity={0.9}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem' }}>
                      🏥 {hosp.name}
                      <div style={{ fontSize: '0.72rem', color: '#10b981' }}>
                        ICU Beds: {hosp.icuBedsAvailable} | Access: {hosp.accessRoadStatus}
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}

            {/* 5. Schools & Evacuation Relief Hubs (Markers) */}
            {layers.schools && filteredSchools.map(school => (
              <Marker
                key={school.id}
                position={[school.lat, school.lng]}
                icon={iconSchoolShelter}
                eventHandlers={{
                  click: () => handleSelectFeature('SCHOOL', school, [school.lat, school.lng])
                }}
              >
                <Tooltip direction="top" offset={[0, -16]} opacity={0.9}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem' }}>
                    🏫 {school.name}
                    <div style={{ fontSize: '0.72rem', color: '#a78bfa' }}>
                      Occupancy: {school.currentOccupancy} / {school.shelterCapacity}
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            ))}

            {/* 6. Police & Fire Emergency Stations (Markers) */}
            {layers.emergencyStations && filteredEmergency.map(stn => (
              <Marker
                key={stn.id}
                position={[stn.lat, stn.lng]}
                icon={iconEmergencyStation}
                eventHandlers={{
                  click: () => handleSelectFeature('EMERGENCY_STATION', stn, [stn.lat, stn.lng])
                }}
              >
                <Tooltip direction="top" offset={[0, -16]} opacity={0.9}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem' }}>
                    🚒 {stn.name}
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                      Rescue Teams: {stn.rescueTeamsActive} | Boats: {stn.boatsAvailable}
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </MapContainer>

          {/* Floating Map Legend & Risk Spectrum */}
          <div style={{
            position: 'absolute',
            bottom: 18,
            left: 18,
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(13, 23, 40, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            zIndex: 1000,
            fontSize: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={14} color="var(--color-primary)" />
              <span>GIS Layer Legend & Risk Tiers</span>
            </div>

            {/* Color spectrum */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: RISK_COLORS.CRITICAL, display: 'inline-block' }} />
                <span style={{ color: 'var(--text-main)' }}>Critical Risk (&gt;1.0m)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: RISK_COLORS.HIGH, display: 'inline-block' }} />
                <span style={{ color: 'var(--text-main)' }}>High Risk (0.5-1.0m)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: RISK_COLORS.MODERATE, display: 'inline-block' }} />
                <span style={{ color: 'var(--text-main)' }}>Moderate (0.2-0.5m)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: RISK_COLORS.LOW, display: 'inline-block' }} />
                <span style={{ color: 'var(--text-main)' }}>Low / Safe (&lt;0.2m)</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8, color: 'var(--text-muted)' }}>
              <span>🚰 Drainage Nodes</span>
              <span>•</span>
              <span>🛣️ Roads</span>
              <span>•</span>
              <span>✚ Hospitals</span>
              <span>•</span>
              <span>🏫 Shelters</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Feature Details Panel */}
        <div className="glass-panel" style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 16
        }}>
          {selectedFeature && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header with Type Tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary-light)',
                    letterSpacing: '0.06em'
                  }}>
                    {selectedFeature.type.replace(/_/g, ' ')} DETAILS
                  </span>
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', marginTop: 2 }}>
                    {selectedFeature.data.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 2 }}>
                    {selectedFeature.data.wardCode || selectedFeature.data.ward || 'Metropolitan Catchment'}
                  </div>
                </div>

                <StatusBadge
                  status={selectedFeature.data.riskLevel || selectedFeature.data.status || 'NORMAL'}
                  size="sm"
                />
              </div>

              {/* SPECIFIC VIEW: FLOOD RISK ZONE */}
              {selectedFeature.type === 'FLOOD_ZONE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Gauge Grid: Probability, Onset, Water Depth */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 51, 75, 0.08)',
                      border: '1px solid var(--color-critical-border)'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Flood Probability</div>
                      <div className="mono-text" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-critical)' }}>
                        {selectedFeature.data.floodProbability}%
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>AI Hydro Ensemble</div>
                    </div>

                    <div style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 170, 0, 0.08)',
                      border: '1px solid var(--color-warning-border)'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Expected Onset</div>
                      <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: 4 }}>
                        {selectedFeature.data.expectedOnset}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Lead Time Window</div>
                    </div>
                  </div>

                  {/* Water Depth Progress Bar */}
                  <div style={{
                    padding: 12,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <InundationBar
                      currentDepthM={selectedFeature.data.waterDepthM}
                      dangerDepthM={selectedFeature.data.dangerMarkM || 1.0}
                      maxScaleM={2.0}
                      label="Surface Water Depth"
                    />
                  </div>

                  {/* Drainage Capacity vs Blockage */}
                  <div style={{
                    padding: 12,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Drainage Capacity:</span>
                      <span className="mono-text" style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>
                        {selectedFeature.data.drainageCapacityLPS.toLocaleString()} LPS
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Drainage Blockage:</span>
                      <span className="mono-text" style={{ color: selectedFeature.data.drainageBlockagePct > 50 ? 'var(--color-critical)' : 'var(--color-warning)', fontWeight: 700 }}>
                        {selectedFeature.data.drainageBlockagePct}% Choked
                      </span>
                    </div>

                    {/* Blockage Visual Bar */}
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${selectedFeature.data.drainageBlockagePct}%`,
                        height: '100%',
                        background: selectedFeature.data.drainageBlockagePct > 50 ? 'var(--color-critical)' : 'var(--color-warning)'
                      }} />
                    </div>
                  </div>

                  {/* Description & Recommendations */}
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
                      SITUATION OVERVIEW:
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45, background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 6 }}>
                      {selectedFeature.data.description}
                    </p>
                  </div>

                  {/* Hotspots */}
                  {selectedFeature.data.criticalHotspots && (
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>
                        CRITICAL INUNDATION HOTSPOTS:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {selectedFeature.data.criticalHotspots.map((hotspot, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 4,
                              background: 'rgba(255, 51, 75, 0.1)',
                              border: '1px solid var(--color-critical-border)',
                              fontSize: '0.75rem',
                              color: '#ff7082'
                            }}
                          >
                            ⚠ {hotspot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action */}
                  {selectedFeature.data.recommendedAction && (
                    <div style={{
                      padding: 10,
                      borderRadius: 6,
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid var(--color-safe-border)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <CheckCircle2 size={16} color="var(--color-safe)" style={{ flexShrink: 0 }} />
                      <span>{selectedFeature.data.recommendedAction}</span>
                    </div>
                  )}
                </div>
              )}

              {/* SPECIFIC VIEW: DRAINAGE NODE */}
              {selectedFeature.type === 'DRAINAGE_NODE' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(0, 180, 216, 0.08)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Current Discharge Flow</div>
                      <div className="mono-text" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                        {selectedFeature.data.currentFlowM3s} <span style={{ fontSize: '0.75rem' }}>m³/s</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Cap: {selectedFeature.data.capacityM3s} m³/s</div>
                    </div>

                    <div style={{ padding: 10, borderRadius: 'var(--radius-md)', background: 'rgba(255, 51, 75, 0.08)', border: '1px solid var(--color-critical-border)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Drainage Blockage</div>
                      <div className="mono-text" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-critical)' }}>
                        {selectedFeature.data.blockagePct}%
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Silt: {selectedFeature.data.siltationLevelM}m Depth</div>
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                    <InundationBar
                      currentDepthM={selectedFeature.data.waterLevelM}
                      dangerDepthM={2.5}
                      maxScaleM={4.0}
                      label="Culvert / Sump Water Level"
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
                      NODE DESCRIPTION & TELEMETRY:
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45, background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 6 }}>
                      {selectedFeature.data.description}
                    </p>
                  </div>

                  <div style={{
                    padding: 10,
                    borderRadius: 6,
                    background: 'rgba(255, 170, 0, 0.08)',
                    border: '1px solid var(--color-warning-border)',
                    fontSize: '0.8rem',
                    color: 'var(--text-main)'
                  }}>
                    <strong>Maintenance Directive:</strong> {selectedFeature.data.actionRequired}
                  </div>
                </div>
              )}

              {/* SPECIFIC VIEW: ROAD */}
              {selectedFeature.type === 'ROAD' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'rgba(255, 51, 75, 0.08)', border: '1px solid var(--color-critical-border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Submerged Water Depth</div>
                    <div className="mono-text" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-critical)' }}>
                      {selectedFeature.data.waterDepthM} meters
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Condition: {selectedFeature.data.trafficCondition}</div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'rgba(0, 180, 216, 0.08)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-light)', marginBottom: 4 }}>
                      Mandatory Traffic Diversion:
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#fff' }}>
                      {selectedFeature.data.alternativeRoute}
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC VIEW: HOSPITAL */}
              {selectedFeature.type === 'HOSPITAL' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ padding: 10, borderRadius: 6, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--color-safe-border)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ICU Beds Available</div>
                      <div className="mono-text" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-safe)' }}>
                        {selectedFeature.data.icuBedsAvailable} <span style={{ fontSize: '0.75rem' }}>/ {selectedFeature.data.totalBeds}</span>
                      </div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 6, background: 'rgba(0, 180, 216, 0.08)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Access Road Status</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                        {selectedFeature.data.accessRoadStatus}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 6 }}>
                    <strong>Access Road Notes:</strong> {selectedFeature.data.accessNotes}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Emergency Line:</span>
                    <strong style={{ color: 'var(--text-accent)' }}>{selectedFeature.data.emergencyContact}</strong>
                  </div>
                </div>
              )}

              {/* SPECIFIC VIEW: SCHOOL / SHELTER */}
              {selectedFeature.type === 'SCHOOL' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid #8b5cf6' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Shelter Occupancy</div>
                    <div className="mono-text" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a78bfa' }}>
                      {selectedFeature.data.currentOccupancy} <span style={{ fontSize: '0.85rem' }}>/ {selectedFeature.data.shelterCapacity} Capacity</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Food Supplies: {selectedFeature.data.foodSupplyDays} Days Available
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ padding: '4px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem' }}>
                      ✓ Clean Drinking Water
                    </span>
                    <span style={{ padding: '4px 8px', borderRadius: 4, background: 'rgba(0, 180, 216, 0.15)', color: 'var(--color-primary-light)', fontSize: '0.75rem' }}>
                      ✓ Power Backup
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 6 }}>
                    {selectedFeature.data.notes}
                  </div>
                </div>
              )}

              {/* SPECIFIC VIEW: POLICE / FIRE */}
              {selectedFeature.type === 'EMERGENCY_STATION' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ padding: 10, borderRadius: 6, background: 'rgba(2, 132, 199, 0.1)', border: '1px solid #0284c7' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Rescue Boats</div>
                      <div className="mono-text" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                        {selectedFeature.data.boatsAvailable} Units
                      </div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 6, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-safe-border)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Active Rescue Teams</div>
                      <div className="mono-text" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-safe)' }}>
                        {selectedFeature.data.rescueTeamsActive} Teams
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 6 }}>
                    <strong>Active Missions:</strong> {selectedFeature.data.activeMissions}
                  </div>
                </div>
              )}

              {/* Action Buttons at bottom of details drawer */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, display: 'flex', gap: 10 }}>
                <button
                  onClick={openBroadcastForCurrent}
                  className="tactical-btn tactical-btn-danger"
                  style={{ flex: 1, fontSize: '0.82rem' }}
                >
                  <Send size={15} /> Broadcast CAP Alert
                </button>
              </div>
            </div>
          )}
        </div>
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
