import React from 'react';
import { HealthStatus } from '../../services/healthService';
import { RefreshCw } from 'lucide-react';

interface ConnectionStatusBadgeProps {
  status: HealthStatus;
  latencyMs: number | null;
  onOpenDiagnostics: () => void;
  isChecking?: boolean;
}

export const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({
  status,
  latencyMs,
  onOpenDiagnostics,
  isChecking = false,
}) => {
  const getBadgeContent = () => {
    if (isChecking) {
      return (
        <>
          <RefreshCw size={13} style={{ animation: 'spinSmooth 1s linear infinite', color: '#2563eb' }} />
          <span>Testing DB...</span>
        </>
      );
    }

    switch (status) {
      case 'connected':
        return (
          <>
            <span className="status-dot-pulse-green" />
            <span>Supabase Connected</span>
            {latencyMs !== null && (
              <span style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 600, background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                {latencyMs}ms
              </span>
            )}
          </>
        );

      case 'unconfigured':
        return (
          <>
            <span className="status-dot-pulse-amber" />
            <span>Supabase Setup Needed</span>
          </>
        );

      case 'offline':
        return (
          <>
            <span className="status-dot-red" />
            <span>Browser Offline</span>
          </>
        );

      case 'error':
      default:
        return (
          <>
            <span className="status-dot-red" />
            <span>Connection Error</span>
          </>
        );
    }
  };

  return (
    <button
      onClick={onOpenDiagnostics}
      className="status-indicator-interactive"
      title="Click to view database connection diagnostics and setup guide"
      type="button"
    >
      {getBadgeContent()}
    </button>
  );
};
