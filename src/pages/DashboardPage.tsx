import React from 'react';
import { Users, UserPlus, CheckCircle2, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h2>Dashboard Overview</h2>
          <p>Real-time admission pipeline and counsellor follow-up metrics</p>
        </div>
        <div>
          <Link to="/leads" className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Lead</span>
          </Link>
        </div>
      </div>

      {/* KPI Preview Shell */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Leads</span>
            <span style={{ padding: '6px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb' }}><Users size={16} /></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>--</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>Supabase connection pending</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>New Enquiries</span>
            <span style={{ padding: '6px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb' }}><UserPlus size={16} /></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>--</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>Awaiting initial contact</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Converted</span>
            <span style={{ padding: '6px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a' }}><CheckCircle2 size={16} /></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>--</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>Successfully enrolled</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Overdue Follow-ups</span>
            <span style={{ padding: '6px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626' }}><Clock size={16} /></span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#dc2626' }}>--</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>Action required</p>
        </div>
      </div>

      {/* Main Content Card Shell */}
      <div className="card">
        <h3 style={{ marginBottom: '8px' }}>Phase 1 Initialized</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>
          Welcome to the BrightPath CRM application shell. The design system, layout, and client-side routing are fully operational.
          Real data integration, database migrations, and authentication will be connected in Phase 2 and Phase 3.
        </p>
      </div>
    </div>
  );
};
