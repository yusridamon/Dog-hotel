import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Ban, Archive, Dog } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatDate, formatCurrency, StatusBadge } from '../../utils/helpers';

const statusActions = [
  { status: 'CONFIRMED', label: 'Confirm', icon: <CheckCircle size={15} />, color: '#10b981', bg: '#d1fae5' },
  { status: 'REJECTED', label: 'Reject', icon: <XCircle size={15} />, color: '#ef4444', bg: '#fee2e2' },
  { status: 'CANCELLED', label: 'Cancel', icon: <Ban size={15} />, color: '#6b7280', bg: '#f3f4f6' },
  { status: 'COMPLETED', label: 'Complete', icon: <Archive size={15} />, color: '#3b82f6', bg: '#dbeafe' },
];

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [kennels, setKennels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/admin/bookings/${id}`),
      api.get('/admin/kennels'),
    ]).then(([bRes, kRes]) => {
      setBooking(bRes.data);
      setKennels(kRes.data);
    }).catch(() => toast.error('Failed to load booking'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/admin/bookings/${id}/status`, { status });
      setBooking(b => ({ ...b, status: res.data.status, kennels: res.data.kennels }));
      const ks = res.data.kennels || [];
      const kMsg = ks.length ? ` — Kennel${ks.length > 1 ? 's' : ''} ${ks.map(k => k.name).sort((a, b) => Number(a) - Number(b)).join(', ')} assigned` : '';
      toast.success(`Booking ${status.toLowerCase()}${status === 'CONFIRMED' ? kMsg : ''}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const savePrice = async () => {
    const price = Number(priceInput);
    if (!Number.isFinite(price) || price < 0) {
      toast.error('Enter a valid total price');
      return;
    }
    setSavingPrice(true);
    try {
      const res = await api.patch(`/admin/bookings/${id}/price`, { totalPrice: price });
      setBooking(b => ({ ...b, totalPrice: res.data.totalPrice, requiresQuote: res.data.requiresQuote }));
      setPriceInput('');
      toast.success('Quote saved');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save price');
    } finally {
      setSavingPrice(false);
    }
  };

  const assignKennel = async (kennelId, action = 'add') => {
    try {
      const res = await api.post(`/admin/kennels/${kennelId}/assign`, { bookingId: id, action });
      setBooking(b => ({ ...b, kennels: res.data.kennels }));
      const kName = kennels.find(k => k.id === parseInt(kennelId))?.name;
      toast.success(action === 'remove' ? `Removed Kennel ${kName}` : `Added Kennel ${kName}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update kennels');
    }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Loading…</div>;
  if (!booking) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>Booking not found</div>;

  const Section = ({ title, children }) => (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', overflow: 'hidden', marginBottom: 20, boxShadow: 'var(--shadow)' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-100)', fontWeight: 700, fontSize: 14, color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--gray-50)' }}>{title}</div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 14 }}>
      <span style={{ width: 160, color: 'var(--gray-500)', flexShrink: 0, fontWeight: 500 }}>{label}</span>
      <span style={{ fontWeight: 500, color: 'var(--gray-800)', flex: 1 }}>{value || <span style={{ color: 'var(--gray-300)' }}>—</span>}</span>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/admin/bookings')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', fontSize: 14, padding: 0 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            Booking {booking.referenceNumber}
            <StatusBadge status={booking.status} />
            {booking.requiresQuote && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
                background: '#fef3c7', color: '#92400e',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                Quote required
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 2 }}>Created {formatDate(booking.createdAt)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'start' }}>
        {/* Left column */}
        <div>
          <Section title="Customer">
            <Row label="Full Name" value={booking.customer.fullName} />
            <Row label="Email" value={booking.customer.email} />
            <Row label="Phone" value={booking.customer.phone} />
          </Section>

          <Section title="Stay Details">
            <Row label="Check-In" value={formatDate(booking.checkInDate)} />
            <Row label="Check-Out" value={formatDate(booking.checkOutDate)} />
            <Row label="Nights" value={booking.numberOfNights} />
            <Row label="Dogs" value={`${booking.numberOfDogs} dog${booking.numberOfDogs > 1 ? 's' : ''}`} />
            <Row label="Price / Dog / Night" value={formatCurrency(booking.pricePerNight)} />
            {booking.requiresQuote ? (
              <div style={{ marginTop: 16, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
                <div style={{ fontWeight: 700, color: '#92400e', marginBottom: 6 }}>Quote required</div>
                <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 12, lineHeight: 1.6 }}>
                  This stay is longer than 10 nights, so it was not auto-priced. Enter the quoted total below to send the customer their price.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="number" min="0" step="0.01" value={priceInput}
                    onChange={e => setPriceInput(e.target.value)}
                    placeholder="Total price (R)"
                    style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', fontSize: 14, outline: 'none' }}
                  />
                  <button onClick={savePrice} disabled={savingPrice}
                    style={{ padding: '9px 16px', background: 'var(--green-700)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600, cursor: savingPrice ? 'not-allowed' : 'pointer' }}>
                    {savingPrice ? 'Saving…' : 'Save Quote'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 16, background: 'var(--green-50)', borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--green-800)' }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-900)' }}>{formatCurrency(booking.totalPrice)}</span>
              </div>
            )}
          </Section>

          <Section title="Dogs">
            {booking.dogs.map((dog, i) => (
              <div key={dog.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < booking.dogs.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)' }}>
                  <Dog size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{dog.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{dog.breed}</div>
                </div>
              </div>
            ))}
          </Section>
        </div>

        {/* Right column */}
        <div>
          {/* Actions */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '20px', marginBottom: 20, boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Update Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {statusActions.map(({ status, label, icon, color, bg }) => (
                <button key={status} onClick={() => updateStatus(status)} disabled={updating || booking.status === status}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px', borderRadius: 'var(--radius)', border: `1.5px solid ${color}`,
                    background: booking.status === status ? bg : '#fff',
                    color, fontWeight: 600, fontSize: 13, cursor: booking.status === status || updating ? 'not-allowed' : 'pointer',
                    opacity: booking.status === status ? 0.7 : 1,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (booking.status !== status) e.currentTarget.style.background = bg; }}
                  onMouseLeave={e => { if (booking.status !== status) e.currentTarget.style.background = '#fff'; }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Kennel assignment */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '20px', marginBottom: 20, boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Kennels ({(booking.kennels || []).length} / {booking.numberOfDogs} needed)
            </h3>
            {booking.kennels && booking.kennels.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {[...booking.kennels].sort((a, b) => Number(a.name) - Number(b.name)).map((k) => (
                  <div key={k.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 6px',
                    background: 'var(--green-50)', borderRadius: 'var(--radius)', border: '1px solid var(--green-200)',
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 6, background: 'var(--olive-600)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
                    }}>{k.name}</span>
                    <button
                      onClick={() => assignKennel(k.id, 'remove')}
                      title="Remove this kennel"
                      style={{ background: 'none', border: 'none', color: 'var(--red-500)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
                    >×</button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 12 }}>
                No kennels assigned yet — assigned automatically on confirmation (one per dog).
              </p>
            )}
            <select
              onChange={e => { if (e.target.value) { assignKennel(e.target.value, 'add'); e.target.value = ''; } }}
              defaultValue=""
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer' }}
            >
              <option value="">+ Add a kennel…</option>
              {[...kennels]
                .filter(k => k.isActive && !(booking.kennels || []).some(bk => bk.id === k.id))
                .sort((a, b) => Number(a.name) - Number(b.name))
                .map(k => (
                  <option key={k.id} value={k.id}>Kennel {k.name}</option>
                ))}
            </select>
          </div>

          {/* Notes */}
          <Section title="Care Notes">
            <Row label="Feeding" value={booking.feedingInstructions} />
            <Row label="Medical" value={booking.medicalInfo} />
            <Row label="Special Req." value={booking.specialRequirements} />
            <Row label="Extra Notes" value={booking.additionalNotes} />
          </Section>

          <div style={{ marginTop: 8 }}>
            <Link to={`/admin/customers/${booking.customerId}`} style={{ fontSize: 13, color: 'var(--green-700)', fontWeight: 600, textDecoration: 'none' }}>
              View Customer History →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;
