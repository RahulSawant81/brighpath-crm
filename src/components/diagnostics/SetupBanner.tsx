import React from 'react';
import { Database, ArrowRight, X } from 'lucide-react';
import { HealthStatus } from '../../services/healthService';

interface SetupBannerProps {
  status: HealthStatus;
  onOpenDiagnostics: () => void;
}

export const SetupBanner: React.FC<SetupBannerProps> = ({ status, onOpenDiagnostics }) => {
  const [dismissed, setDismissed] = React.useState(false);

  // Only show when unconfigured or connection error
  if (dismissed || (status !== 'unconfigured' && status !== 'error')) {
    return null;
  }

  return (
    <div className="setup-banner" role="alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Database size={20} color="#60a5fa" />
        </div>
        <div>
          <strong style={{ fontSize: '0.875rem', fontWeight: 600 }}>Supabase Connection Needed</strong>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '2px' }}>
            BrightPath CRM operates with real Supabase persistence. Connect your database to start managing live leads.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={onOpenDiagnostics}
          className="btn btn-primary"
          style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
          type="button"
        >
          <span>Setup Supabase</span>
          <ArrowRight size={14} />
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{ color: '#94a3b8', padding: '6px', borderRadius: '4px' }}
          title="Dismiss notification"
          type="button"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
