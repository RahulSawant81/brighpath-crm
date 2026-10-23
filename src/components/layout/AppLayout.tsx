import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { checkSupabaseHealth, HealthCheckResult } from '../../services/healthService';
import { ConnectionDiagnosticsModal } from '../diagnostics/ConnectionDiagnosticsModal';
import { SetupBanner } from '../diagnostics/SetupBanner';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [health, setHealth] = useState<HealthCheckResult>({
    status: 'checking',
    latencyMs: null,
    message: 'Initializing connection diagnostics...',
    checkedAt: new Date(),
  });

  const runHealthCheck = useCallback(async () => {
    setIsChecking(true);
    const result = await checkSupabaseHealth();
    setHealth(result);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    runHealthCheck();

    // Listen to browser network changes
    const handleOnline = () => runHealthCheck();
    const handleOffline = () => {
      setHealth({
        status: 'offline',
        latencyMs: null,
        message: 'Your browser is currently offline.',
        checkedAt: new Date(),
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [runHealthCheck]);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          health={health}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          isChecking={isChecking}
        />
        <main className="content-area">
          {/* Setup Alert Banner shown if Supabase is unconfigured */}
          <SetupBanner
            status={health.status}
            onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          />
          <Outlet />
        </main>
      </div>

      {/* Diagnostics & Setup Modal with spring animations */}
      <ConnectionDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        health={health}
        onRefresh={runHealthCheck}
        isChecking={isChecking}
      />
    </div>
  );
};
