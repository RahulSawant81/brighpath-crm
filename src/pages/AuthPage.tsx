import React, { useState } from 'react';
import { GraduationCap, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary preview redirect for Phase 1
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas)', padding: '20px' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '36px 32px', boxShadow: 'var(--shadow-dropdown)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-brand-blue), #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <GraduationCap size={28} />
          </div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>BrightPath Academy</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {isRegister ? 'Create counsellor account' : 'Sign in to access student CRM'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                required
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
              <input
                type="email"
                placeholder="counsellor@brightpath.edu"
                required
                style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
              <input
                type="password"
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '8px' }}>
            {isRegister ? 'Sign Up as Counsellor' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{ fontSize: '0.8125rem', color: 'var(--color-brand-blue)', fontWeight: 500 }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
