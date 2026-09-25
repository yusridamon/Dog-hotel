import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: pagination.page, limit: 20 });
    if (search) params.set('search', search);
    api.get(`/admin/customers?${params}`)
      .then(r => { setCustomers(r.data.customers); setPagination(r.data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pagination.page, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination(p => ({ ...p, page: 1 }));
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Customers</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>{pagination.total} registered customer{pagination.total !== 1 ? 's' : ''}</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20, maxWidth: 400 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '9px 16px', background: 'var(--green-700)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Search
        </button>
      </form>

      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Loading…</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>No customers found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)' }}>
                  {['Customer', 'Phone', 'Total Bookings', 'Joined', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: '1px solid var(--gray-100)', background: i % 2 ? 'var(--gray-50)' : '#fff' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)', flexShrink: 0 }}>
                          <User size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{c.fullName}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-600)' }}>{c.phone}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-block', background: 'var(--green-50)', color: 'var(--green-800)', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 700 }}>
                        {c._count?.bookings ?? 0}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link to={`/admin/customers/${c.id}`} style={{ fontSize: 12, color: 'var(--green-700)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Page {pagination.page} of {pagination.pages}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1}
                style={{ padding: '7px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', background: '#fff', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', opacity: pagination.page === 1 ? 0.4 : 1, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ChevronLeft size={14} /> Prev
              </button>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page === pagination.pages}
                style={{ padding: '7px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', background: '#fff', cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer', opacity: pagination.page === pagination.pages ? 0.4 : 1, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
