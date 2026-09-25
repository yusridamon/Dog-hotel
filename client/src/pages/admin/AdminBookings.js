import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import { formatDate, formatCurrency, StatusBadge } from '../../utils/helpers';

const STATUSES = ['', 'PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: pagination.page, limit: 20 });
    if (status) params.set('status', status);
    if (search) params.set('search', search);

    api.get(`/admin/bookings?${params}`)
      .then(r => { setBookings(r.data.bookings); setPagination(r.data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pagination.page, status, search]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleStatusChange = (s) => {
    setStatus(s);
    setPagination(p => ({ ...p, page: 1 }));
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>Bookings</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>{pagination.total} total booking{pagination.total !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '16px 20px', border: '1px solid var(--gray-200)', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 220 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by ref, name or email…"
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <button type="submit" style={{ padding: '9px 16px', background: 'var(--green-700)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
        </form>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => handleStatusChange(s)} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              border: status === s ? '2px solid var(--green-700)' : '2px solid var(--gray-200)',
              background: status === s ? 'var(--green-50)' : '#fff',
              color: status === s ? 'var(--green-800)' : 'var(--gray-600)',
            }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Loading…</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>No bookings found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)' }}>
                  {['Reference', 'Customer', 'Dogs', 'Check-In', 'Check-Out', 'Nights', 'Total', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--gray-100)', background: i % 2 ? 'var(--gray-50)' : '#fff' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--green-800)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{b.referenceNumber}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{b.customer.fullName}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{b.customer.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-600)' }}>{b.dogs.map(d => d.name).join(', ')}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{formatDate(b.checkInDate)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, whiteSpace: 'nowrap' }}>{formatDate(b.checkOutDate)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'center' }}>{b.numberOfNights}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--green-700)', whiteSpace: 'nowrap' }}>
                      {b.requiresQuote ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 9px', borderRadius: 9999, fontSize: 11, fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b' }} />
                          Quote required
                        </span>
                      ) : formatCurrency(b.totalPrice)}
                    </td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link to={`/admin/bookings/${b.id}`} style={{ fontSize: 12, color: 'var(--green-700)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              Page {pagination.page} of {pagination.pages} ({pagination.total} results)
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1}
                style={{ padding: '7px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', background: '#fff', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', opacity: pagination.page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                <ChevronLeft size={14} /> Prev
              </button>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page === pagination.pages}
                style={{ padding: '7px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', background: '#fff', cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer', opacity: pagination.page === pagination.pages ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
