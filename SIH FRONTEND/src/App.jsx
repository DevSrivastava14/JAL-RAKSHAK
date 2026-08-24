import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';

import { Dashboard } from './pages/Dashboard';
import { FloodMap } from './pages/FloodMap';
import { Simulation } from './pages/Simulation';
import { Predictions } from './pages/Predictions';
import { Alerts } from './pages/Alerts';
import { Infrastructure } from './pages/Infrastructure';
import { SafeRoutes } from './pages/SafeRoutes';
import { Cities } from './pages/Cities';
import { ActionCenter } from './pages/ActionCenter';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard / Application */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<FloodMap />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="routes" element={<SafeRoutes />} />
          <Route path="cities" element={<Cities />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="action-center" element={<ActionCenter />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}