import React, { useState } from 'react';
import { User, Shield, Database, Key, Activity, RefreshCw, LogOut, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSupabaseConfigStatus } from '../lib/supabaseClient';
import { checkSupabaseHealth, HealthCheckResult } from '../services/healthService';
import { ConnectionDiagnosticsModal } from '../components/diagnostics/ConnectionDiagnosticsModal';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const config = getSupabaseConfigStatus();
  const { user, profile, role, isAuthenticated, signOut } = useAuth();
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

  const getRoleBadge = (userRole?: string | null) => {
    if (userRole === 'admin') {
      return { class: 'badge', bg: '#f3e8ff', text: '#7c3aed', border: '#d8b4fe', label: 'Administrator' };
    }
    if (userRole === 'manager') {
      return { class: 'badge', bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe', label: 'Manager' };
    }
    return { class: 'badge badge-new', bg: 'var(--status-new-bg)', text: 'var(--status-new-text)', border: 'var(--status-new-border)', label: 'Counsellor' };
  };

  const roleBadge = getRoleBadge(role);

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="var(--color-brand-blue)" />
              <h3 style={{ fontSize: '1rem' }}>User Profile</h3>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => signOut()}
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#b91c1c' }}
                title="Sign out of CRM"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                value={profile?.full_name || (isAuthenticated ? 'Staff Member' : 'Guest / Demo Mode')}
                readOnly
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Staff Email</label>
              <input
                type="text"
                value={user?.email || 'Not authenticated'}
                readOnly
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Active Role</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: roleBadge.bg,
                    color: roleBadge.text,
                    border: `1px solid ${roleBadge.border}`,
                  }}
                >
                  {isAuthenticated ? roleBadge.label : 'Guest Preview'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                  (Roles are bootstrapped via PostgreSQL SQL)
                </span>
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
              {config.isConfigured ? 'Connected' : 'Setup Needed'}
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
