import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { LeadsPage } from '../pages/LeadsPage';
import { LeadDetailPage } from '../pages/LeadDetailPage';
import { FollowUpsPage } from '../pages/FollowUpsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AuthPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Standalone Auth Screen */}
      <Route path="/login" element={<AuthPage />} />

      {/* Main CRM Application Layout with Sidebar and Header */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/:id" element={<LeadDetailPage />} />
        <Route path="follow-ups" element={<FollowUpsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
