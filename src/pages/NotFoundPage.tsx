import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-brand-blue)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginTop: '16px', marginBottom: '8px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 24px' }}>
        The CRM view or record you are searching for does not exist or you do not have permission to view it.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
