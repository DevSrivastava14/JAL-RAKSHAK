import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useCityOverview } from '../hooks/useFloodData';
import { AlertCircle, Radio } from 'lucide-react';

export function DashboardLayout() {
  const { overview, refresh, loading } = useCityOverview();

  return (
    <div className="app-shell">
      {/* Tactical Sidebar */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="main-viewport">
        {/* Top Command Navbar */}
        <Navbar onRefresh={refresh} isRefreshing={loading} />

        {/* Dynamic Page Content */}
        <main className="content-container">
          <Outlet context={{ overview, refreshOverview: refresh }} />
        </main>

        {/* Global Bottom Status Ticker */}
        <footer style={{
          height: 36,
          backgroundColor: '#0a1220',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          zIndex: 80,
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-critical)', fontWeight: 600 }}>
              <AlertCircle size={14} /> ACTIVE CRITICAL ADVISORY:
            </span>
            <span style={{ color: 'var(--text-main)' }}>
              Mithi River Level at 3.42m (Danger: 3.00m) • High Tide Peak 4.54m at 14:45 IST
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-dim)' }}>SIH26085 AI Urban Nowcasting Engine</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-safe)' }}>
              <Radio size={12} className="pulse-dot" /> SCADA TELEMETRY SYNCED
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
