import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BarChart3,
  Settings,
  GraduationCap,
  LogOut,
  LogIn,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { profile, role, isAuthenticated, signOut } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/leads', label: 'Leads & Enquiries', icon: Users },
    { to: '/follow-ups', label: 'Follow-ups', icon: CalendarClock },
    { to: '/reports', label: 'Analytics & Reports', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const getInitials = (name?: string | null): string => {
    if (!name) return 'BP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadgeStyle = (userRole?: string | null) => {
    if (userRole === 'admin') return { color: '#c084fc', background: 'rgba(192, 132, 252, 0.15)' };
    if (userRole === 'manager') return { color: '#818cf8', background: 'rgba(129, 140, 248, 0.15)' };
    return { color: '#93c5fd', background: 'rgba(147, 197, 253, 0.15)' };
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar Drawer */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-badge">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <div className="brand-text">
              <h1>BrightPath CRM</h1>
              <p>Academy Pipeline</p>
            </div>
          </div>
          <button
            className="menu-toggle-btn"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ color: '#fff' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div className="user-profile-badge" style={{ flex: 1, minWidth: 0 }}>
                <div className="user-avatar" style={{ background: role === 'admin' ? '#7c3aed' : '#2563eb' }}>
                  {getInitials(profile?.full_name)}
                </div>
                <div className="user-meta">
                  <p className="user-name" title={profile?.full_name || 'Staff'}>
                    {profile?.full_name || 'Staff Member'}
                  </p>
                  <span
                    className="user-role-tag"
                    style={{
                      ...getRoleBadgeStyle(role),
                      padding: '1px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {role || 'Counsellor'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                aria-label="Sign out"
                title="Sign out of account"
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  color: '#94a3b8',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div className="user-profile-badge" style={{ flex: 1, minWidth: 0 }}>
                <div className="user-avatar" style={{ background: '#475569' }}>
                  GM
                </div>
                <div className="user-meta">
                  <p className="user-name">Guest Mode</p>
                  <span className="user-role-tag" style={{ color: '#94a3b8' }}>Preview Access</span>
                </div>
              </div>

              <Link
                to="/login"
                className="btn btn-primary"
                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                title="Sign in to your account"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
