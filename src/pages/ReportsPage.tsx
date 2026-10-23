import React from 'react';
import { TrendingUp, PieChart, Users } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h2>Analytics & Reports</h2>
          <p>Truthful conversion metrics and lead source performance analysis</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <TrendingUp size={20} color="var(--color-brand-blue)" />
            <h3 style={{ fontSize: '1rem' }}>Overall Conversion Rate</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>--%</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Formula: Converted / Total Accessible Leads × 100
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <PieChart size={20} color="#8b5cf6" />
            <h3 style={{ fontSize: '1rem' }}>Source Performance</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Breakdown across Walk-in, Website, Call, and Referral channels will appear in Phase 7.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Users size={20} color="#10b981" />
            <h3 style={{ fontSize: '1rem' }}>Counsellor Workload</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Team pipeline workload and conversion breakdown will be populated in Phase 7.
          </p>
        </div>
      </div>
    </div>
  );
};
