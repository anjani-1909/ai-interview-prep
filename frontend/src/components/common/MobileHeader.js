import React from 'react';
import { MdMenu, MdNotifications, MdAutoAwesome } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const MobileHeader = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className="page-header" style={{ display: 'none' }} id="mobile-header">
      <button
        onClick={onMenuClick}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '24px',
          padding: '4px'
        }}
      >
        <MdMenu />
      </button>

      <div className="flex items-center gap-8">
        <span style={{ fontSize: '16px' }}>🚀</span>
        <span className="font-semibold" style={{ fontSize: '15px' }}>InterviewAI</span>
      </div>

      <div className="flex items-center gap-12">
        <MdNotifications style={{ fontSize: '20px', color: 'var(--text-muted)', cursor: 'pointer' }} />
        <div
          className="user-avatar"
          style={{ width: '32px', height: '32px', fontSize: '12px' }}
        >
          {user?.name?.[0]?.toUpperCase() || '?'}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
