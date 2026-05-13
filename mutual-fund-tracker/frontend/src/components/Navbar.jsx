import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',            label: 'Dashboard', icon: GridIcon },
  { to: '/funds',       label: 'Funds',     icon: TrendIcon },
  { to: '/investments', label: 'Portfolio', icon: BriefIcon },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 14L7 8L11 11L16 4" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="4" r="2" fill="#00d4aa"/>
          </svg>
        </div>
        <span style={styles.logoText}>FundSight</span>
      </div>

      {/* Nav links */}
      <div style={styles.links}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.linkActive : {}),
          })}>
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      {/* User */}
      <div style={styles.bottom}>
        <div style={styles.avatar}>
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.username}>{user?.fullName || user?.username}</div>
          <div style={styles.useremail}>{user?.email}</div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
          <LogoutIcon size={16} />
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    width: '220px',
    minWidth: '220px',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    gap: '8px',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 8px 24px',
    borderBottom: '1px solid var(--border-subtle)',
    marginBottom: '8px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'var(--accent-dim)',
    border: '1px solid rgba(0,212,170,0.3)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-display)',
  },
  linkActive: {
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
    border: '1px solid rgba(0,212,170,0.2)',
  },
  bottom: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '10px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    marginTop: 'auto',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--accent-dim)',
    border: '1px solid rgba(0,212,170,0.3)',
    color: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    flexShrink: 0,
  },
  username: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  useremail: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    transition: 'color 0.2s',
  },
};

// ── Inline SVG icons ──────────────────────────────────
function GridIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
    </svg>
  );
}

function TrendIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M1 12L5.5 7L9 10L15 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 3H15V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BriefIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1 9h14" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function LogoutIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
