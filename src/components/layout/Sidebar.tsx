import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BarChart3,
  Settings,
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/leads', label: 'Leads & Enquiries', icon: Users },
    { to: '/follow-ups', label: 'Follow-ups', icon: CalendarClock },
    { to: '/reports', label: 'Analytics & Reports', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

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
          <div className="user-profile-badge">
            <div className="user-avatar">BP</div>
            <div className="user-meta">
              <p className="user-name">Staff Counsellor</p>
              <span className="user-role-tag">Counsellor</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
