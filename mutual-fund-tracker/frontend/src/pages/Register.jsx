import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../api/api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'fullName',  label: 'Full Name',  type: 'text',  },
    { name: 'username',  label: 'Username',   type: 'text',  },
    { name: 'email',     label: 'Email',      type: 'email',  },
    { name: 'password',  label: 'Password',   type: 'password', },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.grid} aria-hidden />
      <div style={styles.card} className="animate-in">
        <div style={styles.header}>
          <div >
            
          </div>
          <h1 style={styles.title}>Create Account</h1>
         
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                required={name !== 'fullName'}
                placeholder={placeholder}
                style={styles.input}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
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
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
    opacity: 0.4,
    maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%)',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  logoIcon: {
    width: '52px', height: '52px',
    background: 'var(--accent-dim)',
    border: '1px solid rgba(0,212,170,0.3)',
    borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
  },
  title: { fontSize: '26px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: 'var(--text-secondary)' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  input: {
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '11px 14px',
    color: 'var(--text-primary)', fontSize: '14px',
    fontFamily: 'var(--font-mono)', outline: 'none',
  },
  btn: {
    marginTop: '4px', padding: '12px',
    background: 'var(--accent)', color: '#080c14',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700',
    fontFamily: 'var(--font-display)', cursor: 'pointer',
  },
  footer: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' },
  link: { color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' },
};
