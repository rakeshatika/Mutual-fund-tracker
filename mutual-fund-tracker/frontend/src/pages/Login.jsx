import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data);
      toast.success(`Welcome back, ${data.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      {/* Ambient blobs */}
      <div style={S.blob1} />
      <div style={S.blob2} />

      {/* Grid overlay */}
      <div style={S.grid} aria-hidden />

      <div style={S.card} className="animate-in">
        {/* Logo mark */}
        <div style={S.logoWrap}>
          <div style={S.logoRing}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 17L8 10L13 13L19 5" stroke="#00e5b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="19" cy="5" r="2.5" fill="#00e5b8"/>
            </svg>
          </div>
        </div>

        <h1 style={S.title}>Welcome back</h1>
        <p style={S.subtitle}>Sign in to your FundSight account</p>

        <form onSubmit={handleSubmit} style={S.form}>
          {[
            { name: 'username', label: 'Username', type: 'text',     placeholder: 'your_username', icon: '👤' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••',      icon: '🔒' },
          ].map(({ name, label, type, placeholder, icon }) => (
            <div key={name} style={S.fieldWrap}>
              <label style={S.label}>{label}</label>
              <div style={{ position: 'relative' }}>
                <span style={S.fieldIcon}>{icon}</span>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoFocus={name === 'username'}
                  placeholder={placeholder}
                  style={{
                    ...S.input,
                    borderColor: focusedField === name ? 'var(--accent)' : 'var(--border)',
                    boxShadow: focusedField === name ? '0 0 0 3px var(--accent-glow)' : 'none',
                  }}
                />
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? (
              <span style={S.spinner} />
            ) : (
              <>
                <span>Sign In</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div style={S.divider}>
          <span style={S.dividerLine}/>
          <span style={S.dividerText}>or</span>
          <span style={S.dividerLine}/>
        </div>

        <p style={S.footer}>
          No account?{' '}
          <Link to="/register" style={S.link}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
  },
  blob1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(0,229,184,0.07) 0%, transparent 65%)',
    top: '-100px',
    left: '-100px',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)',
    bottom: '-80px',
    right: '-80px',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(var(--border-subtle) 1px, transparent 1px),' +
      'linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
    backgroundSize: '52px 52px',
    opacity: 0.35,
    maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '44px 40px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logoRing: {
    width: '58px',
    height: '58px',
    background: 'var(--accent-dim)',
    border: '1px solid rgba(0,229,184,0.25)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 24px var(--accent-glow)',
    animation: 'float 4s ease-in-out infinite',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '-0.6px',
    textAlign: 'center',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  fieldIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  input: {
    width: '100%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '12px 14px 12px 38px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'var(--font-mono)',
    transition: 'border-color 0.18s, box-shadow 0.18s',
  },
  btn: {
    marginTop: '6px',
    padding: '13px',
    background: 'linear-gradient(135deg, var(--accent), #00b894)',
    color: '#040810',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 20px var(--accent-glow)',
    transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.15s',
    cursor: 'pointer',
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(4,8,16,0.3)',
    borderTopColor: '#040810',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--border)',
  },
  dividerText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    flexShrink: 0,
  },
  footer: {
    marginTop: '16px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'color 0.15s',
  },
};
