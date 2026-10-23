import React from 'react';
import { User, Shield, Database, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h2>Account & Settings</h2>
          <p>User profile, role management, and Supabase connection settings</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Database size={20} color="#10b981" />
            <h3 style={{ fontSize: '1rem' }}>Database Configuration</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            Supabase client connection and schema diagnostics will be configured in Phase 2 and Phase 3.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={16} color="var(--color-text-subtle)" />
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)' }}>Public Anon Key Only (No Service-Role Key in Frontend)</span>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Shield size={20} color="#8b5cf6" />
            <h3 style={{ fontSize: '1rem' }}>Role Boundaries & RLS</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            PostgreSQL Row Level Security ensures counsellors only access their assigned leads, while managers and admins access team-wide records.
          </p>
        </div>
      </div>
    </div>
  );
};
