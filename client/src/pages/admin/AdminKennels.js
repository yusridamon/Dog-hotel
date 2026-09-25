import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const AdminKennels = () => {
  const [kennels, setKennels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKennels = () => {
    setLoading(true);
    api.get('/admin/kennels')
      .then(r => setKennels(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchKennels(); }, []);

  // Sort numerically by name (1..12)
  const sorted = [...kennels].sort((a, b) => Number(a.name) - Number(b.name));

  // A kennel is "occupied now" if it has a confirmed/pending booking spanning today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentBooking = (kennel) => {
    if (!kennel.bookings) return null;
    return kennel.bookings.find(b => {
      const start = new Date(b.checkInDate);
      const end = new Date(b.checkOutDate);
      start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
      return today >= start && today < end;
    }) || null;
  };

  // Any active (confirmed/pending) booking, even if not today
  const nextBooking = (kennel) => {
    if (!kennel.bookings || kennel.bookings.length === 0) return null;
    const upcoming = [...kennel.bookings]
      .filter(b => new Date(b.checkOutDate) >= today)
      .sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate));
    return upcoming[0] || null;
  };

  const occupiedNow = sorted.filter(k => currentBooking(k)).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Kennels</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
          {sorted.length} kennels · <strong style={{ color: occupiedNow > 0 ? '#b45309' : '#166534' }}>{occupiedNow} occupied today</strong> · {sorted.length - occupiedNow} free
        </p>
      </div>

      {/* Info banner */}
      <div style={{
        background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius)',
        padding: '12px 18px', marginBottom: 24, fontSize: 13, color: '#78350f',
      }}>
        🐾 Kennels fill automatically from the lowest number up. When you confirm a booking, the next free kennel is assigned.
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {sorted.map((kennel) => {
            const now = currentBooking(kennel);
            const next = !now ? nextBooking(kennel) : null;
            const isOccupied = !!now;
            return (
              <div key={kennel.id} style={{
                background: '#fff', borderRadius: 'var(--radius-lg)',
                border: `2px solid ${isOccupied ? '#fca5a5' : 'var(--olive-200)'}`,
                boxShadow: 'var(--shadow)', overflow: 'hidden',
              }}>
                {/* Header with number */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: isOccupied ? '#fef2f2' : 'var(--olive-50)',
                  borderBottom: `1px solid ${isOccupied ? '#fecaca' : 'var(--olive-100)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: isOccupied ? '#dc2626' : 'var(--olive-600)',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 15,
                    }}>{kennel.name}</div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--brown-800)' }}>Kennel {kennel.name}</span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 9999,
                    background: isOccupied ? '#fee2e2' : '#dcfce7',
                    color: isOccupied ? '#991b1b' : '#166534',
                  }}>
                    {isOccupied ? 'Occupied' : 'Free'}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: '14px 18px', minHeight: 78 }}>
                  {now ? (
                    <Link to={`/admin/bookings/${now.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--brown-900)' }}>{now.customer.fullName}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                        Until {formatDate(now.checkOutDate)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--olive-700)', fontWeight: 600, marginTop: 6 }}>View booking →</div>
                    </Link>
                  ) : next ? (
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>Next booking:</div>
                      <Link to={`/admin/bookings/${next.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brown-800)' }}>{next.customer.fullName}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{formatDate(next.checkInDate)} – {formatDate(next.checkOutDate)}</div>
                      </Link>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', height: '100%' }}>
                      No upcoming bookings
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminKennels;
