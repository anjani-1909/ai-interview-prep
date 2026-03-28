import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
   MdCode, MdMic, MdDescription,
  MdPerson, MdLogout
} from 'react-icons/md';

const navItems = [
  { icon: <MdDashboard />, label: 'Dashboard', path: '/dashboard' },
  { icon: <MdCode />, label: 'DSA Tracker', path: '/dsa-tracker', badge: 'Track' },
  { icon: <MdMic />, label: 'Mock Interview', path: '/mock-interview', badge: 'AI' },
  { icon: <MdDescription />, label: 'Resume Analyzer', path: '/resume-analyzer', badge: 'ATS' },
  { icon: <MdMap />, label: 'Learning Roadmap', path: '/roadmap' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🚀</div>
        <div className="sidebar-logo-text">
          <h3>InterviewAI</h3>
          <span>Prep Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Main Menu</div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}

        <div className="nav-section-title" style={{ marginTop: '16px' }}>Account</div>

        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <span className="nav-item-icon"><MdPerson /></span>
          Profile
        </NavLink>

        {/* Progress Summary */}
        <div className="card" style={{ marginTop: '16px', padding: '14px' }}>
          <div className="flex items-center gap-8 mb-8">
            <MdTrendingUp style={{ color: 'var(--primary-light)', fontSize: '16px' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Your Progress
            </span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <div className="flex justify-between mb-4">
              <span className="text-xs text-muted">DSA Problems</span>
              <span className="text-xs" style={{ color: 'var(--primary-light)' }}>
                {user?.totalDSASolved || 0}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((user?.totalDSASolved || 0) / 100 * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-4">
              <span className="text-xs text-muted">Interviews Done</span>
              <span className="text-xs" style={{ color: 'var(--secondary)' }}>
                {user?.totalInterviews || 0}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((user?.totalInterviews || 0) / 20 * 100, 100)}%`,
                  background: 'linear-gradient(90deg, var(--secondary), #34d399)'
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-mini-profile" onClick={() => { navigate('/profile'); onClose?.(); }}>
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'User'}
            </div>
            <div className="text-xs text-muted truncate">{user?.targetRole || 'Developer'}</div>
          </div>
          <MdAutoAwesome style={{ color: 'var(--primary-light)', fontSize: '16px' }} />
        </div>

        <button
          onClick={handleLogout}
          className="nav-item btn-danger"
          style={{
            width: '100%',
            marginTop: '8px',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            cursor: 'pointer',
            padding: '10px 12px',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <MdLogout style={{ fontSize: '18px' }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
