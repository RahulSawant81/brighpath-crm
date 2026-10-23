import React, { useState } from 'react';
import { User, Shield, Database, Key, Activity, RefreshCw } from 'lucide-react';
import { getSupabaseConfigStatus } from '../lib/supabaseClient';
import { checkSupabaseHealth, HealthCheckResult } from '../services/healthService';
import { ConnectionDiagnosticsModal } from '../components/diagnostics/ConnectionDiagnosticsModal';

export const SettingsPage: React.FC = () => {
  const config = getSupabaseConfigStatus();
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [health, setHealth] = useState<HealthCheckResult>({
    status: config.isConfigured ? 'checking' : 'unconfigured',
    latencyMs: null,
    message: config.message,
    checkedAt: new Date(),
  });

  const handleTestConnection = async () => {
    setIsChecking(true);
    const result = await checkSupabaseHealth();
    setHealth(result);
    setIsChecking(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h2>Account & Settings</h2>
          <p>User profile, role management, and Supabase connection settings</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* User Profile */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <User size={20} color="var(--color-brand-blue)" />
            <h3 style={{ fontSize: '1rem' }}>User Profile</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Full Name</label>
              <input type="text" value="Staff Counsellor" readOnly style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Active Role</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-new">Counsellor</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Roles are managed by Administrator)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={20} color="#10b981" />
              <h3 style={{ fontSize: '1rem' }}>Database Configuration</h3>
            </div>
            <span
              className={`badge ${config.isConfigured ? 'badge-converted' : 'badge-qualified'}`}
            >
              {config.isConfigured ? 'Configured' : 'Setup Needed'}
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
            {config.message}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => {
                handleTestConnection();
                setIsDiagnosticsOpen(true);
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
              type="button"
            >
              <Activity size={14} color="#2563eb" />
              <span>Open Diagnostics</span>
            </button>

            <button
              onClick={handleTestConnection}
              disabled={isChecking}
              className="btn btn-outline"
              style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
              type="button"
            >
              <RefreshCw size={14} style={isChecking ? { animation: 'spinSmooth 1s linear infinite' } : {}} />
              <span>Test Ping</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
            <Key size={15} color="var(--color-text-subtle)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Public client key bundle only. Never expose service keys.</span>
          </div>
        </div>

        {/* Security & RLS */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Shield size={20} color="#8b5cf6" />
            <h3 style={{ fontSize: '1rem' }}>Role Boundaries & RLS</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            PostgreSQL Row Level Security ensures counsellors only access their assigned leads, while managers and admins access team-wide records.
          </p>
          <div style={{ marginTop: '16px', fontSize: '0.8125rem', color: 'var(--color-brand-blue)', fontWeight: 500 }}>
            Active Policy Target: profiles, leads, follow_ups, activities
          </div>
        </div>
      </div>

      <ConnectionDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        health={health}
        onRefresh={handleTestConnection}
        isChecking={isChecking}
      />
    </div>
  );
};
