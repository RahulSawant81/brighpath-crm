import React from 'react';
import { Menu, Bell, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ConnectionStatusBadge } from '../common/ConnectionStatusBadge';
import { HealthCheckResult } from '../../services/healthService';

interface HeaderProps {
  onToggleSidebar: () => void;
  health: HealthCheckResult;
  onOpenDiagnostics: () => void;
  isChecking: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  health,
  onOpenDiagnostics,
  isChecking,
}) => {
  const location = useLocation();

  const getBreadcrumbTitle = (pathname: string): string => {
    if (pathname === '/') return 'Dashboard Overview';
    if (pathname.startsWith('/leads/')) return 'Lead Detail';
    if (pathname === '/leads') return 'Leads & Enquiries';
    if (pathname === '/follow-ups') return 'Scheduled Follow-ups';
    if (pathname === '/reports') return 'Analytics & Reports';
    if (pathname === '/settings') return 'Account & Settings';
    if (pathname === '/login') return 'Authentication';
    return 'CRM';
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <span>BrightPath</span>
          <span>/</span>
          <span className="breadcrumbs-current">{getBreadcrumbTitle(location.pathname)}</span>
        </nav>
      </div>

      <div className="header-right">
        {/* Real-time Interactive Connection Status Badge */}
        <ConnectionStatusBadge
          status={health.status}
          latencyMs={health.latencyMs}
          onOpenDiagnostics={onOpenDiagnostics}
          isChecking={isChecking}
        />

        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
          <ShieldCheck size={15} color="#2563eb" />
          <span>Role: Counsellor</span>
        </button>

        <button
          aria-label="Notifications"
          style={{
            padding: '8px',
            borderRadius: '8px',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
};
