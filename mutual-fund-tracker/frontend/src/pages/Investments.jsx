import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { investmentsAPI, fundsAPI } from '../api/api';

const emptyForm = {
  fundId: '', units: '', purchaseNav: '',
  purchaseDate: '', investmentType: 'Lumpsum', notes: '',
};

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState('date');

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes, fundRes] = await Promise.all([
        investmentsAPI.getAll(),
        fundsAPI.getAll(),
      ]);
      setInvestments(invRes.data);
      setFunds(fundRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await investmentsAPI.create({
        ...form,
        fundId: parseInt(form.fundId),
        units: parseFloat(form.units),
        purchaseNav: parseFloat(form.purchaseNav),
      });
      toast.success('Investment added!');
      setShowModal(false);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add investment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this investment?')) return;
    try {
      await investmentsAPI.delete(id);
      toast.success('Investment removed');
      loadData();
    } catch {
      toast.error('Failed to delete investment');
    }
  };

  // Sort investments
  const sorted = [...investments].sort((a, b) => {
    if (sortBy === 'date')    return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    if (sortBy === 'value')   return b.currentValue - a.currentValue;
    if (sortBy === 'pl')      return b.profitLossPercent - a.profitLossPercent;
    if (sortBy === 'invested') return b.investedAmount - a.investedAmount;
    return 0;
  });

  // Totals
  const totalInvested    = investments.reduce((s, i) => s + parseFloat(i.investedAmount || 0), 0);
  const totalCurrentVal  = investments.reduce((s, i) => s + parseFloat(i.currentValue || 0), 0);
  const totalPL          = totalCurrentVal - totalInvested;
  const totalPLPct       = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
  const fmtN = (v) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }).format(v);

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Portfolio</h1>
          <p style={s.subtitle}>{investments.length} investment{investments.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button onClick={() => setShowModal(true)} style={s.addBtn}>+ Add Investment</button>
      </div>

      {/* Summary bar */}
      {investments.length > 0 && (
        <div style={s.summaryBar}>
          {[
            { label: 'Total Invested',  value: fmt(totalInvested),   color: '#3b82f6' },
            { label: 'Current Value',   value: fmt(totalCurrentVal), color: '#00d4aa' },
            { label: 'Overall P&L',
              value: `${fmt(totalPL)} (${totalPL >= 0 ? '+' : ''}${totalPLPct.toFixed(2)}%)`,
              color: totalPL >= 0 ? '#00d4aa' : '#ff4d6d' },
          ].map(({ label, value, color }) => (
            <div key={label} style={s.summaryItem}>
              <div style={s.summaryLabel}>{label}</div>
              <div style={{ ...s.summaryValue, color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Sort toolbar */}
      <div style={s.toolbar}>
        <span style={s.sortLabel}>Sort by:</span>
        {[['date','Date'], ['value','Current Value'], ['pl','P&L %'], ['invested','Invested']].map(([k, l]) => (
          <button key={k} onClick={() => setSortBy(k)}
            style={{ ...s.sortBtn, ...(sortBy === k ? s.sortBtnActive : {}) }}>
            {l}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={s.tableWrap}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '40%' }} />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📊</div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: '15px', fontWeight: '600' }}>No investments yet</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: 20 }}>
            Add funds first, then record your investments here.
          </p>
          <button onClick={() => setShowModal(true)} style={s.addBtn}>Add Investment</button>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['Fund', 'Type', 'Units', 'Buy NAV', 'Current NAV', 'Invested', 'Current Value', 'P&L', 'P&L %', 'Date', ''].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(inv => {
                const gain = parseFloat(inv.profitLoss) >= 0;
                return (
                  <tr key={inv.id} style={s.tr}>
                    <td style={s.td}>
                      <div style={s.fundName}>{inv.fundName}</div>
                      <div style={s.fundCat}>
                        <span style={s.catChip}>{inv.fundCategory}</span>
                        <RiskDot risk={inv.riskLevel} />
                      </div>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.typeChip, ...(inv.investmentType === 'SIP' ? s.sipChip : {}) }}>
                        {inv.investmentType || 'Lumpsum'}
                      </span>
                    </td>
                    <td style={{ ...s.td, ...s.mono }}>{fmtN(inv.units)}</td>
                    <td style={{ ...s.td, ...s.mono }}>₹{parseFloat(inv.purchaseNav).toFixed(2)}</td>
                    <td style={{ ...s.td, ...s.mono }}>₹{parseFloat(inv.currentNav).toFixed(2)}</td>
                    <td style={{ ...s.td, ...s.mono }}>{fmt(inv.investedAmount)}</td>
                    <td style={{ ...s.td, ...s.mono }}>{fmt(inv.currentValue)}</td>
                    <td style={{ ...s.td, ...s.mono, color: gain ? 'var(--accent)' : 'var(--accent-red)' }}>
                      {gain ? '+' : ''}{fmt(inv.profitLoss)}
                    </td>
                    <td style={{ ...s.td, ...s.mono }}>
                      <span style={{ ...s.plBadge, background: gain ? 'var(--accent-dim)' : 'var(--accent-red-dim)', color: gain ? 'var(--accent)' : 'var(--accent-red)' }}>
                        {gain ? '+' : ''}{parseFloat(inv.profitLossPercent).toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ ...s.td, ...s.mono, color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(inv.purchaseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={s.td}>
                      <button onClick={() => handleDelete(inv.id)} style={s.delBtn} title="Remove">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 012 0v1M6 6v4M8 6v4M3 3.5l.7 7a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Investment Modal */}
      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={s.modal} className="animate-in">
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Add Investment</h2>
              <button onClick={() => setShowModal(false)} style={s.closeBtn}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              {/* Fund picker */}
              <div>
                <label style={s.label}>Select Fund <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                <select style={s.input} value={form.fundId} onChange={e => {
                  const f = funds.find(f => f.id === parseInt(e.target.value));
                  setForm({ ...form, fundId: e.target.value, purchaseNav: f ? f.currentNav : '' });
                }} required>
                  <option value="">— Choose a fund —</option>
                  {funds.map(f => (
                    <option key={f.id} value={f.id}>{f.name} (₹{parseFloat(f.currentNav).toFixed(2)})</option>
                  ))}
                </select>
              </div>

              <div style={s.row2}>
                <div>
                  <label style={s.label}>Units <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                  <input style={s.input} type="number" step="0.0001" min="0.0001"
                    value={form.units} onChange={e => setForm({ ...form, units: e.target.value })} required placeholder="100.0000" />
                </div>
                <div>
                  <label style={s.label}>Purchase NAV (₹) <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                  <input style={s.input} type="number" step="0.0001" min="0.0001"
                    value={form.purchaseNav} onChange={e => setForm({ ...form, purchaseNav: e.target.value })} required placeholder="145.5000" />
                </div>
              </div>

              {/* Computed invested amount preview */}
              {form.units && form.purchaseNav && (
                <div style={s.previewBox}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Invested Amount</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: '700' }}>
                    ₹{(parseFloat(form.units) * parseFloat(form.purchaseNav)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div style={s.row2}>
                <div>
                  <label style={s.label}>Purchase Date <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                  <input style={s.input} type="date"
                    value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} required
                    max={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label style={s.label}>Investment Type</label>
                  <select style={s.input} value={form.investmentType} onChange={e => setForm({ ...form, investmentType: e.target.value })}>
                    <option>Lumpsum</option>
                    <option>SIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={s.label}>Notes (optional)</label>
                <input style={s.input} type="text"
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Monthly SIP — Jan 2024" />
              </div>

              <div style={s.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Cancel</button>
                <button type="submit" disabled={saving} style={s.submitBtn}>
                  {saving ? 'Adding…' : 'Add Investment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RiskDot({ risk }) {
  const colors = { Low: '#00d4aa', Moderate: '#fbbf24', High: '#ff4d6d' };
  return (
    <span title={risk} style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: colors[risk] || '#8899aa', marginLeft: 4 }} />
  );
}

const s = {
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' },
  addBtn: { background: 'var(--accent)', color: '#080c14', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' },
  summaryBar: { display: 'flex', gap: '1px', background: 'var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '20px' },
  summaryItem: { flex: 1, background: 'var(--bg-card)', padding: '16px 20px' },
  summaryLabel: { fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' },
  summaryValue: { fontSize: '16px', fontWeight: '800', fontFamily: 'var(--font-mono)', letterSpacing: '-0.3px' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' },
  sortLabel: { fontSize: '12px', color: 'var(--text-muted)', marginRight: '4px' },
  sortBtn: { padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-display)' },
  sortBtnActive: { background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'rgba(0,212,170,0.3)' },
  tableWrap: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '900px' },
  th: { textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '14px 16px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' },
  td: { padding: '14px 16px', color: 'var(--text-primary)', verticalAlign: 'middle', fontSize: '13px' },
  mono: { fontFamily: 'var(--font-mono)' },
  fundName: { fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' },
  fundCat: { display: 'flex', alignItems: 'center', gap: '4px' },
  catChip: { fontSize: '11px', color: 'var(--text-muted)' },
  typeChip: { background: 'rgba(59,130,246,0.12)', color: '#3b82f6', fontSize: '11px', fontWeight: '600', padding: '2px 7px', borderRadius: '4px', border: '1px solid rgba(59,130,246,0.25)' },
  sipChip: { background: 'rgba(167,139,250,0.12)', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.25)' },
  plBadge: { fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '5px', fontFamily: 'var(--font-mono)' },
  delBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px' },
  empty: { textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' },
  emptyIcon: { fontSize: '40px', marginBottom: '12px' },
  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(8,12,20,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' },
  modal: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  label: { fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' },
  input: { width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-mono)', outline: 'none' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  previewBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accent-dim)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '8px', padding: '10px 14px' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-display)' },
  submitBtn: { padding: '10px 24px', background: 'var(--accent)', border: 'none', borderRadius: '8px', color: '#080c14', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-display)' },
};
