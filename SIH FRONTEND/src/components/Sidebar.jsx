import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  PlayCircle,
  TrendingUp,
  AlertTriangle,
  Server,
  Navigation,
  Globe,
  Shield,
  Radio,
  Layers,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/map', label: 'Flood Map', icon: MapPin, badge: 'LIVE' },
  { path: '/simulation', label: 'Simulation', icon: PlayCircle, badge: 'AI' },
  { path: '/predictions', label: 'Predictions', icon: TrendingUp, badge: '0-6H' },
  { path: '/routes', label: 'Safe Routes', icon: Navigation, badge: 'GPS', badgeColor: 'primary' },
  { path: '/cities', label: 'Multi-City', icon: Globe, badge: '10 METROS', badgeColor: 'primary' },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle, badge: '3 NEW', badgeColor: 'critical' },
  { path: '/infrastructure', label: 'Infrastructure', icon: Server, badge: '38/42' }
];

export function Sidebar({ collapsed = false }) {
  return (
    <aside style={{
      width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      height: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px',
      zIndex: 100,
      transition: 'width var(--transition-normal)',
      flexShrink: 0
    }}>
      {/* Top Section: Branding */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '4px 8px 20px 8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 20
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 180, 216, 0.4)',
            flexShrink: 0
          }}>
            <Shield size={22} color="#ffffff" />
          </div>

          {!collapsed && (
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                background: 'linear-gradient(90deg, #ffffff 0%, #48cae4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                JALRAKSHAK
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.68rem',
                color: 'var(--text-accent)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-mono)'
              }}>
                <span>SIH26085</span>
                <span>•</span>
                <span>NOWCASTING</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `tactical-nav-link ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'linear-gradient(90deg, rgba(0, 180, 216, 0.22) 0%, rgba(0, 180, 216, 0.05) 100%)' : 'transparent',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all var(--transition-fast)'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={19} style={{ color: 'inherit' }} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 9999,
                    background: item.badgeColor === 'critical' ? 'var(--color-critical-bg)' : 'rgba(72, 202, 228, 0.15)',
                    color: item.badgeColor === 'critical' ? '#ff5e72' : 'var(--color-primary-light)',
                    border: `1px solid ${item.badgeColor === 'critical' ? 'var(--color-critical-border)' : 'var(--border-subtle)'}`
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Command Telemetry Status */}
      {!collapsed && (
        <div style={{
          padding: 14,
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              SCADA Telemetry
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--color-safe)', fontFamily: 'var(--font-mono)' }}>
              <span className="pulse-dot" /> LIVE
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: 4 }}>
            Mumbai Met Catchment
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            <span>Sensors: 142/148</span>
            <span>Latency: 28ms</span>
          </div>
        </div>
      )}
    </aside>
  );
}
