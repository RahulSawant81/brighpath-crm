import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, CalendarClock, History } from 'lucide-react';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/leads" className="btn btn-secondary" style={{ padding: '6px 12px' }}>
          <ArrowLeft size={16} />
          <span>Back to All Leads</span>
        </Link>
      </div>

      <div className="page-header">
        <div className="page-title">
          <h2>Lead Record #{id?.slice(0, 8) || 'Preview'}</h2>
          <p>Student enquiry timeline and follow-up history</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary">
            <Phone size={15} />
            <span>Call</span>
          </button>
          <button className="btn btn-secondary">
            <Mail size={15} />
            <span>Email</span>
          </button>
          <button className="btn btn-primary">
            <CalendarClock size={16} />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', fontSize: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            Student Information
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Detailed attributes (course, phone, email, notes, source) will populate from PostgreSQL in Phase 5.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <History size={18} color="var(--color-brand-blue)" />
            <h3 style={{ fontSize: '1rem' }}>Activity History</h3>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Automated event tracking (lead created, status updated, follow-ups logged) will appear here in Phase 6.
          </p>
        </div>
      </div>
    </div>
  );
};
