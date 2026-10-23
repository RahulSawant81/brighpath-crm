import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Database,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { HealthCheckResult } from '../../services/healthService';
import { getSupabaseConfigStatus } from '../../lib/supabaseClient';

interface ConnectionDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthCheckResult;
  onRefresh: () => Promise<void>;
  isChecking: boolean;
}

export const ConnectionDiagnosticsModal: React.FC<ConnectionDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  health,
  onRefresh,
  isChecking,
}) => {
  const [copied, setCopied] = useState(false);
  const config = getSupabaseConfigStatus();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sampleEnvContent = `# Project Root: .env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-client-anon-key`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="var(--color-brand-blue)" />
              <h3>Supabase Diagnostics</h3>
            </div>
            <p>Database connection status, credentials validation, and setup guide</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {/* Security Alert if service_role key was entered */}
        {config.isServiceRoleKey && (
          <div className="diagnostic-item danger" style={{ marginBottom: '16px' }}>
            <ShieldAlert size={22} color="#dc2626" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#dc2626', fontSize: '0.875rem' }}>Security Warning: Service-Role Key Detected!</strong>
              <p style={{ fontSize: '0.8125rem', color: '#991b1b', marginTop: '2px' }}>
                You have entered a secret service-role key in frontend configuration. Service keys bypass Row Level Security. Replace it immediately with your public anon key!
              </p>
            </div>
          </div>
        )}

        {/* Diagnostics Checklist */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '10px' }}>
            Configuration Checklist
          </h4>

          {/* Item 1: VITE_SUPABASE_URL */}
          <div className={`diagnostic-item ${config.url && !config.isPlaceholder ? 'success' : 'warning'}`}>
            {config.url && !config.isPlaceholder ? (
              <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>VITE_SUPABASE_URL</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: config.url && !config.isPlaceholder ? '#16a34a' : '#d97706' }}>
                  {config.url && !config.isPlaceholder ? 'Configured' : 'Missing / Placeholder'}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', wordBreak: 'break-all' }}>
                {config.url || 'Not set in .env'}
              </p>
            </div>
          </div>

          {/* Item 2: VITE_SUPABASE_ANON_KEY */}
          <div className={`diagnostic-item ${config.hasKey && !config.isPlaceholder ? 'success' : 'warning'}`}>
            {config.hasKey && !config.isPlaceholder ? (
              <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>VITE_SUPABASE_ANON_KEY</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: config.hasKey && !config.isPlaceholder ? '#16a34a' : '#d97706' }}>
                  {config.hasKey && !config.isPlaceholder ? 'Valid Client Key' : 'Missing / Placeholder'}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {config.hasKey && !config.isPlaceholder ? 'Client anon key format validated' : 'Not provided in .env'}
              </p>
            </div>
          </div>

          {/* Item 3: REST API Connectivity & Latency */}
          <div className={`diagnostic-item ${health.status === 'connected' ? 'success' : health.status === 'error' ? 'danger' : 'warning'}`}>
            {health.status === 'connected' ? (
              <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : health.status === 'error' ? (
              <XCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>REST Endpoint Status</span>
                {health.latencyMs !== null && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a' }}>
                    {health.latencyMs} ms
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {health.message}
              </p>
            </div>
          </div>
        </div>

        {/* Setup Instructions for Students & Developers */}
        <div style={{ backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>How to Connect Your Supabase Project:</span>
            <button
              onClick={handleCopyEnv}
              className="btn btn-secondary"
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              type="button"
            >
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy .env snippet'}</span>
            </button>
          </div>
          <ol style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '8px', paddingLeft: '20px', lineHeight: 1.6 }}>
            <li>Go to your Supabase project dashboard at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: 'var(--color-brand-blue)', textDecoration: 'underline' }}>supabase.com <ExternalLink size={11} style={{ display: 'inline' }} /></a>.</li>
            <li>Navigate to <strong>Project Settings</strong> &rarr; <strong>API</strong>.</li>
            <li>Create a file named <code>.env</code> in the project root with the keys below:</li>
          </ol>
          <div className="code-box">
            {sampleEnvContent}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => onRefresh()}
            disabled={isChecking}
            className="btn btn-primary"
            type="button"
          >
            <RefreshCw size={15} style={isChecking ? { animation: 'spinSmooth 1s linear infinite' } : {}} />
            <span>{isChecking ? 'Pinging Database...' : 'Re-test Connection'}</span>
          </button>
          <button onClick={onClose} className="btn btn-secondary" type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
