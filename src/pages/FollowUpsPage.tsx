import React, { useState } from 'react';
import { CalendarClock, Plus, CheckCircle2, Clock } from 'lucide-react';

export const FollowUpsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overdue' | 'today' | 'upcoming' | 'completed'>('today');

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h2>Scheduled Follow-ups</h2>
          <p>Prioritize calls, walk-in visits, and admission consultations</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          <span>New Follow-up</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
        <button
          className={`btn ${activeTab === 'today' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('today')}
        >
          <Clock size={15} />
          <span>Due Today</span>
        </button>
        <button
          className={`btn ${activeTab === 'overdue' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('overdue')}
          style={activeTab === 'overdue' ? { backgroundColor: '#dc2626' } : {}}
        >
          <Clock size={15} />
          <span>Overdue Tasks</span>
        </button>
        <button
          className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <CalendarClock size={15} />
          <span>Upcoming</span>
        </button>
        <button
          className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('completed')}
        >
          <CheckCircle2 size={15} />
          <span>Completed History</span>
        </button>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CalendarClock size={24} />
        </div>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Follow-up Task Pipeline</h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto', fontSize: '0.875rem' }}>
          Date logic, timezone-aware overdue indicators, and one-click completion workflows will be connected in Phase 6.
        </p>
      </div>
    </div>
  );
};
