import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, CheckCircle, CalendarCheck, CalendarX,
  MessageSquare, ArrowRight, TrendingUp,
} from 'lucide-react';
import api from '../../utils/api';
import { formatCurrency, formatDate, StatusBadge } from '../../utils/helpers';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{
    background: '#fff', borderRadius: 'var(--radius-lg)', padding: '24px 24px',
    border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow)',
    display: 'flex', gap: 16, alignItems: 'flex-start',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 'var(--radius)', flexShrink: 0,
      background: color + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <p style={{ color: 'var(--gray-400)' }}>Loading dashboard…</p>
    </div>
  );

  const { stats, recentBookings } = data || { stats: {}, recentBookings: [] };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Welcome back. Here's what's happening at the hotel.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon={<BookOpen size={22} />} label="Total Bookings" value={stats.totalBookings ?? 0} color="var(--green-700)" />
        <StatCard icon={<Clock size={22} />} label="Pending Review" value={stats.pendingBookings ?? 0} color="#f59e0b" sub="Awaiting confirmation" />
        <StatCard icon={<CheckCircle size={22} />} label="Confirmed" value={stats.confirmedBookings ?? 0} color="#10b981" sub="Active bookings" />
        <StatCard icon={<CalendarCheck size={22} />} label="Check-ins Today" value={stats.todayCheckIns ?? 0} color="#3b82f6" />
        <StatCard icon={<CalendarX size={22} />} label="Check-outs Today" value={stats.todayCheckOuts ?? 0} color="#8b5cf6" />
        <StatCard icon={<TrendingUp size={22} />} label="Total Revenue" value={formatCurrency(stats.totalRevenue ?? 0)} color="var(--green-700)" sub="Confirmed + completed" />
        <StatCard icon={<MessageSquare size={22} />} label="Unread Messages" value={stats.unreadMessages ?? 0} color="#ef4444" />
      </div>

      {/* Recent bookings */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Bookings</h2>
          <Link to="/admin/bookings" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--green-700)', fontWeight: 600, textDecoration: 'none' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>No bookings yet</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)' }}>
                  {['Reference', 'Customer', 'Dogs', 'Check-In', 'Check-Out', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--gray-100)', background: i % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--green-800)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{b.referenceNumber}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{b.customer.fullName}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{b.customer.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-600)' }}>
                      {b.dogs.map(d => d.name).join(', ')}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{formatDate(b.checkInDate)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>{formatDate(b.checkOutDate)}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link to={`/admin/bookings/${b.id}`} style={{ fontSize: 12, color: 'var(--green-700)', fontWeight: 600, textDecoration: 'none' }}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
