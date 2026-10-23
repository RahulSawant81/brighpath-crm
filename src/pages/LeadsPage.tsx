import React from 'react';
import { UserPlus, Search, Filter, ArrowUpDown } from 'lucide-react';

export const LeadsPage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h2>Leads & Enquiries</h2>
          <p>Manage, qualify, and track student prospective admissions</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={16} />
          <span>New Lead</span>
        </button>
      </div>

      {/* Search & Filter Toolbar Shell */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input
              type="text"
              placeholder="Search by student name, phone, or email..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-canvas)',
              }}
              readOnly
            />
          </div>

          <button className="btn btn-secondary">
            <Filter size={15} />
            <span>All Statuses</span>
          </button>

          <button className="btn btn-secondary">
            <Filter size={15} />
            <span>All Sources</span>
          </button>

          <button className="btn btn-secondary">
            <ArrowUpDown size={15} />
            <span>Sort: Newest First</span>
          </button>
        </div>
      </div>

      {/* Empty State / Shell Table */}
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <UserPlus size={24} />
        </div>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Lead Management Ready</h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.875rem' }}>
          Real-time lead listing, search debounce, and creation modals will connect directly to the Supabase database in Phase 5.
        </p>
        <button className="btn btn-primary">
          <UserPlus size={16} />
          <span>Create First Lead</span>
        </button>
      </div>
    </div>
  );
};
