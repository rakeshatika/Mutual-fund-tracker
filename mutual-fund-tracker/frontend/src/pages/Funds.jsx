import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fundsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Equity', 'Debt', 'Hybrid'];
const RISK_LEVELS = ['Low', 'Moderate', 'High'];
const RISK_COLORS = { Low: '#00d4aa', Moderate: '#fbbf24', High: '#ff4d6d' };

const emptyForm = {
  name: '', category: 'Equity', riskLevel: 'Moderate',
  currentNav: '', fundSize: '',
};

export default function Funds() {
  const { isAdmin } = useAuth();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadFunds = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search.trim()) params.search = search.trim();
      const { data } = await fundsAPI.getAll(params);
      setFunds(data);
    } catch {
      toast.error('Failed to load funds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFunds(); }, [activeCategory, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fundsAPI.create(form);
      toast.success('Fund added successfully!');
      setShowModal(false);
      setForm(emptyForm);
      loadFunds();
    } catch {
      toast.error('Failed to add fund');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await fundsAPI.delete(id);
      toast.success('Fund deleted');
      loadFunds();
    } catch {
      toast.error('Failed to delete fund');
    }
  };

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Mutual Funds</h1>
          <p style={s.subtitle}>{funds.length} funds available</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} style={s.addBtn}>
            + Add Fund
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <div style={s.tabs}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ ...s.tab, ...(activeCategory === cat ? s.tabActive : {}) }}>
              {cat}
            </button>
          ))}
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search funds…" style={s.search}
        />
      </div>

      {/* Fund Cards */}
      {loading ? (
        <div style={s.grid}>
          {Array(6).fill(0).map((_, i) => (
            <div key={i} style={s.card}>
              <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 32, width: '50%' }} />
            </div>
          ))}
        </div>
      ) : funds.length === 0 ? (
        <div style={s.empty}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>No funds found</p>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} style={s.addBtn}>Add your first fund</button>
          )}
        </div>
      ) : (
        <div style={s.grid}>
          {funds.map(fund => (
            <FundCard key={fund.id} fund={fund} onDelete={handleDelete} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {/* Add Fund Modal — admin only */}
      {isAdmin && showModal && (
        <Modal title="Add Mutual Fund" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.formGrid}>
              <Field label="Fund Name" required>
                <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Mirae Asset Large Cap" />
              </Field>
              <Field label="Category" required>
                <select style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Risk Level" required>
                <select style={s.input} value={form.riskLevel} onChange={e => setForm({ ...form, riskLevel: e.target.value })}>
                  {RISK_LEVELS.map(r => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Current NAV (₹)" required>
                <input style={s.input} type="number" step="0.0001" value={form.currentNav} onChange={e => setForm({ ...form, currentNav: e.target.value })} required placeholder="145.50" />
              </Field>
              <Field label="Fund Size (Cr)">
                <input style={s.input} type="number" step="0.01" value={form.fundSize} onChange={e => setForm({ ...form, fundSize: e.target.value })} placeholder="24500" />
              </Field>
            </div>
            <div style={s.modalActions}>
              <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Cancel</button>
              <button type="submit" disabled={saving} style={s.submitBtn}>{saving ? 'Adding…' : 'Add Fund'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function FundCard({ fund, onDelete, isAdmin }) {
  const riskColor = RISK_COLORS[fund.riskLevel] || '#8899aa';

  return (
    <div style={s.card} className="animate-in">
      <div style={s.cardTop}>
        <div>
          <div style={s.fundName}>{fund.name}</div>
          <div style={s.fundAmc}>{fund.category} Fund</div>
        </div>
        {isAdmin && (
          <button onClick={() => onDelete(fund.id, fund.name)} style={s.deleteBtn} title="Delete">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 012 0v1M6 6v4M8 6v4M3 3.5l.7 7a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div style={s.badges}>
        <span style={s.catBadge}>{fund.category}</span>
        <span style={{ ...s.riskBadge, color: riskColor, background: riskColor + '18', borderColor: riskColor + '44' }}>
          {fund.riskLevel}
        </span>
      </div>

      <div style={s.navRow}>
        <span style={s.navLabel}>NAV</span>
        <span style={s.navValue}>₹{parseFloat(fund.currentNav || 0).toFixed(2)}</span>
      </div>

      {fund.fundSize && (
        <div style={s.expense}>Fund Size: <span style={{ color: 'var(--text-primary)' }}>₹{fund.fundSize} Cr</span></div>
      )}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
        {label}{required && <span style={{ color: 'var(--accent-red)' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal} className="animate-in">
        <div style={s.modalHeader}>
          <h2 style={s.modalTitle}>{title}</h2>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const s = {
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' },
  addBtn: { background: 'var(--accent)', color: '#080c14', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' },
  filters: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' },
  tabs: { display: 'flex', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px' },
  tab: { padding: '6px 14px', borderRadius: '7px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-display)' },
  tabActive: { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.3)' },
  search: { flex: 1, minWidth: '200px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 14px', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-mono)', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  card: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'border-color 0.2s', cursor: 'default' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  fundName: { fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.3 },
  fundAmc: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' },
  deleteBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '4px', flexShrink: 0 },
  badges: { display: 'flex', gap: '6px' },
  catBadge: { background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(0,212,170,0.2)' },
  riskBadge: { fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', border: '1px solid' },
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '10px 14px' },
  navLabel: { fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' },
  navValue: { fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' },
  returnsRow: { display: 'flex', gap: '8px' },
  returnItem: { flex: 1, background: 'var(--bg-secondary)', borderRadius: '8px', padding: '8px', textAlign: 'center' },
  returnLabel: { fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' },
  returnValue: { fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)' },
  expense: { fontSize: '12px', color: 'var(--text-muted)' },
  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(8,12,20,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' },
  modal: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  input: { width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-mono)', outline: 'none' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-display)' },
  submitBtn: { padding: '10px 24px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#080c14', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-display)' },
};
