import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../utils/api';
import { formatDate, formatCurrency, StatusBadge } from '../../utils/helpers';

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/customers/${id}`)
      .then(r => setCustomer(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Loading…</div>;
  if (!customer) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Customer not found</div>;

  const totalSpend = customer.bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div>
      <button onClick={() => navigate('/admin/customers')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', fontSize: 14, marginBottom: 24, padding: 0 }}>
        <ArrowLeft size={16} /> Back to Customers
      </button>

      {/* Profile header */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '28px', marginBottom: 24, boxShadow: 'var(--shadow)', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)', flexShrink: 0 }}>
          <User size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{customer.fullName}</h1>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { icon: <Mail size={14} />, val: customer.email },
              { icon: <Phone size={14} />, val: customer.phone },
              { icon: <Calendar size={14} />, val: `Customer since ${formatDate(customer.createdAt)}` },
            ].map(({ icon, val }) => (
              <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-500)' }}>
                <span style={{ color: 'var(--green-600)' }}>{icon}</span> {val}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Bookings', value: customer.bookings.length },
            { label: 'Total Spend', value: formatCurrency(totalSpend) },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--green-50)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-900)' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--green-700)', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking history */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', fontWeight: 700, fontSize: 15 }}>
          Booking History ({customer.bookings.length})
        </div>

        {customer.bookings.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>No bookings yet</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)' }}>
                  {['Reference', 'Dogs', 'Check-In', 'Check-Out', 'Nights', 'Total', 'Kennel', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customer.bookings.map((b, i) => (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--gray-100)', background: i % 2 ? 'var(--gray-50)' : '#fff' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--green-800)', fontFamily: 'monospace' }}>{b.referenceNumber}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-600)' }}>{b.dogs.map(d => `${d.name} (${d.breed})`).join(', ')}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{formatDate(b.checkInDate)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{formatDate(b.checkOutDate)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'center' }}>{b.numberOfNights}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--green-700)' }}>{formatCurrency(b.totalPrice)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-500)' }}>{b.kennels && b.kennels.length ? b.kennels.map(k => k.name).sort((a, c) => Number(a) - Number(c)).join(', ') : '—'}</td>
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

export default AdminCustomerDetail;
