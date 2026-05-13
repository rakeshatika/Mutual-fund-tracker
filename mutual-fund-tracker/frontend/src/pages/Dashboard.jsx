import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#00d4aa', '#3b82f6', '#fbbf24', '#ff4d6d', '#a78bfa', '#34d399', '#f97316'];

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getSummary()
      .then(({ data }) => setSummary(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (val) => val != null
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
    : '—';

  const pct = (val) => val != null ? `${val > 0 ? '+' : ''}${val}%` : '—';
  const isProfit = summary?.totalProfitLoss >= 0;

  if (loading) return <LoadingSkeleton />;

  const pieData = summary?.fundAllocations?.map((f) => ({
    name: f.fundName,
    value: parseFloat(f.currentValue),
  })) || [];

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Dashboard</h1>
          <p style={s.pageSubtitle}>Good day, {user?.fullName || user?.username} 👋</p>
        </div>
      </div>

      {/* Summary stat cards */}
      <div style={s.statsGrid}>
        <StatCard label="Total Invested"      value={fmt(summary?.totalInvested)}     accent="#3b82f6" />
        <StatCard label="Current Value"       value={fmt(summary?.totalCurrentValue)}  accent="#00d4aa" />
        <StatCard
          label="Profit / Loss"
          value={fmt(summary?.totalProfitLoss)}
          sub={pct(summary?.totalProfitLossPercent)}
          accent={isProfit ? '#00d4aa' : '#ff4d6d'}
          positive={isProfit}
        />
        <StatCard label="Funds Tracked"       value={summary?.totalFunds ?? '—'}       accent="#fbbf24" />
        <StatCard label="Total Transactions"  value={summary?.totalInvestments ?? '—'} accent="#a78bfa" />
      </div>

      {/* Charts row */}
      <div style={s.chartsRow}>
        {/* Allocation Pie */}
        <div style={s.chartCard}>
          <h2 style={s.cardTitle}>Portfolio Allocation</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmt(v)}
                    contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px', fontFamily: 'Syne, sans-serif' }}
                    labelStyle={{ color: '#e8f0fe' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={s.legend}>
                {pieData.map((d, i) => (
                  <div key={i} style={s.legendItem}>
                    <span style={{ ...s.legendDot, background: COLORS[i % COLORS.length] }} />
                    <span style={s.legendName}>{d.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <EmptyState msg="No investments yet" />}
        </div>

        {/* Fund Breakdown Table */}
        <div style={{ ...s.chartCard, flex: 1.5 }}>
          <h2 style={s.cardTitle}>Fund Breakdown</h2>
          {summary?.fundAllocations?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Fund', 'Category', 'Invested', 'Current', 'P&L', 'P&L %', 'Allocation'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summary.fundAllocations.map((f, i) => {
                    const gain = f.profitLoss >= 0;
                    return (
                      <tr key={i} style={s.tr}>
                        <td style={s.td}>
                          <span style={{ ...s.fundDot, background: COLORS[i % COLORS.length] }} />
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>{f.fundName}</span>
                        </td>
                        <td style={s.td}><span style={s.badge}>{f.category}</span></td>
                        <td style={{ ...s.td, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{fmt(f.investedAmount)}</td>
                        <td style={{ ...s.td, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{fmt(f.currentValue)}</td>
                        <td style={{ ...s.td, fontFamily: 'var(--font-mono)', fontSize: '13px', color: gain ? 'var(--accent)' : 'var(--accent-red)' }}>
                          {fmt(f.profitLoss)}
                        </td>
                        <td style={{ ...s.td, fontFamily: 'var(--font-mono)', fontSize: '13px', color: gain ? 'var(--accent)' : 'var(--accent-red)' }}>
                          {pct(f.profitLossPercent)}
                        </td>
                        <td style={{ ...s.td, fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {f.allocationPercent}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : <EmptyState msg="Add investments to see breakdown" />}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent, positive }) {
  return (
    <div style={{ ...s.statCard, borderColor: accent + '22' }} className="animate-in">
      <div style={{ ...s.statAccent, background: accent + '18', borderColor: accent + '44' }}>
        <div style={{ ...s.statDot, background: accent }} />
      </div>
      <div style={s.statLabel}>{label}</div>
      <div style={{ ...s.statValue, color: sub ? accent : 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ ...s.statSub, color: positive ? 'var(--accent)' : 'var(--accent-red)' }}>{sub}</div>}
    </div>
  );
}

function EmptyState({ msg }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
      {msg}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div className="skeleton" style={{ width: 120, height: 28, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 200, height: 18 }} />
      </div>
      <div style={s.statsGrid}>
        {Array(5).fill(0).map((_, i) => (
          <div key={i} style={s.statCard}>
            <div className="skeleton" style={{ width: 80, height: 14, marginBottom: 12 }} />
            <div className="skeleton" style={{ width: '70%', height: 28 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  pageHeader: { marginBottom: '28px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  statAccent: {
    position: 'absolute', top: 0, right: 0,
    width: '48px', height: '48px',
    borderBottomLeftRadius: '100%',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
    padding: '8px',
    border: '1px solid',
    borderTopColor: 'transparent', borderRightColor: 'transparent',
  },
  statDot: { width: '8px', height: '8px', borderRadius: '50%' },
  statLabel: { fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' },
  statValue: { fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-mono)', letterSpacing: '-0.5px' },
  statSub: { fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font-mono)', marginTop: '4px' },
  chartsRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  chartCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    flex: 1,
    minWidth: '280px',
  },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '-0.2px' },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  legendDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  legendName: { fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 12px 0', whiteSpace: 'nowrap' },
  tr: { borderTop: '1px solid var(--border-subtle)' },
  td: { padding: '12px 12px 12px 0', color: 'var(--text-primary)', verticalAlign: 'middle', display: 'revert' },
  badge: { background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' },
  fundDot: { display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px', flexShrink: 0 },
};
