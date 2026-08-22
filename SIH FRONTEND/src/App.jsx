import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { FloodMap } from './pages/FloodMap';
import { Simulation } from './pages/Simulation';
import { Predictions } from './pages/Predictions';
import { Alerts } from './pages/Alerts';
import { Infrastructure } from './pages/Infrastructure';
import { SafeRoutes } from './pages/SafeRoutes';
import { Cities } from './pages/Cities';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<FloodMap />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="routes" element={<SafeRoutes />} />
          <Route path="cities" element={<Cities />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
