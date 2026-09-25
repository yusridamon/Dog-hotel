import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, Dog, Phone } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

const BookingConfirmationPage = () => {
  const { state } = useLocation();

  if (!state?.booking) return <Navigate to="/booking" replace />;

  const { booking, referenceNumber } = state;

  return (
    <div style={{ paddingTop: 70, background: 'var(--gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>

        {/* Success banner */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--green-600),var(--green-900))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(45,106,79,0.4)',
          }}>
            <CheckCircle size={40} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,42px)', color: 'var(--gray-900)', marginBottom: 12 }}>
            Booking Submitted!
          </h1>
          <p style={{ fontSize: 17, color: 'var(--gray-500)', lineHeight: 1.7 }}>
            Thank you! Your booking request has been received. We'll review it and send you a confirmation within 24 hours.
          </p>
        </div>

        {/* Reference number */}
        <div style={{
          background: 'linear-gradient(135deg,var(--green-900),var(--green-800))',
          borderRadius: 'var(--radius-xl)', padding: '28px 32px', textAlign: 'center', marginBottom: 24,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Your Booking Reference
          </p>
          <p style={{ color: '#fff', fontSize: 32, fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'monospace' }}>
            {referenceNumber}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>
            Keep this number safe — you'll need it to enquire about your booking
          </p>
        </div>

        {/* Booking summary */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', overflow: 'hidden', marginBottom: 24, boxShadow: 'var(--shadow)' }}>
          <div style={{ background: 'var(--gray-50)', padding: '14px 24px', borderBottom: '1px solid var(--gray-200)', fontWeight: 700, fontSize: 15 }}>Booking Summary</div>

          <div style={{ padding: '20px 24px' }}>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Status:</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px',
                background: '#fef3c7', color: '#92400e', borderRadius: 'var(--radius-full)',
                fontSize: 12, fontWeight: 700,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
                PENDING REVIEW
              </span>
            </div>

            {[
              { icon: <Calendar size={16} />, label: 'Check-In', value: formatDate(booking.checkInDate) },
              { icon: <Calendar size={16} />, label: 'Check-Out', value: formatDate(booking.checkOutDate) },
              { icon: <Calendar size={16} />, label: 'Duration', value: `${booking.numberOfNights} night${booking.numberOfNights !== 1 ? 's' : ''}` },
              { icon: <Dog size={16} />, label: 'Dogs', value: `${booking.numberOfDogs} dog${booking.numberOfDogs !== 1 ? 's' : ''}` + (booking.dogs ? ': ' + booking.dogs.map(d => `${d.name} (${d.breed})`).join(', ') : '') },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderTop: '1px solid var(--gray-100)' }}>
                <span style={{ color: 'var(--green-600)', marginTop: 2, flexShrink: 0 }}>{icon}</span>
                <span style={{ width: 100, fontSize: 14, color: 'var(--gray-500)', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{value}</span>
              </div>
            ))}

            {/* Price */}
            {booking.requiresQuote || !booking.totalPrice ? (
              <div style={{
                marginTop: 16, padding: '16px 20px', background: 'var(--green-50)',
                borderRadius: 'var(--radius-lg)',
              }}>
                <div style={{ fontSize: 14, color: 'var(--green-800)', fontWeight: 700, marginBottom: 4 }}>Quote to follow</div>
                <div style={{ fontSize: 13, color: 'var(--green-700)', lineHeight: 1.6 }}>
                  Because your stay is longer than 10 nights, it is priced separately. We'll send your personalised quote separately.
                </div>
              </div>
            ) : (
              <div style={{
                marginTop: 16, padding: '16px 20px', background: 'var(--green-50)',
                borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--green-800)', fontWeight: 600 }}>Estimated Total</div>
                  <div style={{ fontSize: 12, color: 'var(--green-700)' }}>Payable on check-in</div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--green-900)' }}>
                  {formatCurrency(booking.totalPrice)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What happens next */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '24px 28px', marginBottom: 24, boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>What happens next?</h3>
          {[
            { num: 1, text: 'We review your booking request (usually within a few hours).' },
            { num: 2, text: 'You\'ll receive an email with confirmation or any questions we have.' },
            { num: 3, text: 'Once confirmed, simply arrive on your check-in date. Payment is collected then.' },
          ].map(({ num, text }) => (
            <div key={num} style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--green-900)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>{num}</div>
              <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6, paddingTop: 4 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 32, border: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <Phone size={16} style={{ color: 'var(--green-700)', flexShrink: 0 }} />
          <span style={{ color: 'var(--gray-600)' }}>Questions? Call us on <strong>066 291 5804</strong> or email <strong>doggotel.cpt@gmail.com</strong></span>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/" style={{
            flex: 1, padding: '14px 24px', textAlign: 'center', borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg,var(--green-700),var(--green-900))',
            color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 15,
          }}>Back to Home</Link>
          <Link to="/contact" style={{
            flex: 1, padding: '14px 24px', textAlign: 'center', borderRadius: 'var(--radius-full)',
            border: '2px solid var(--gray-300)', color: 'var(--gray-700)',
            fontWeight: 600, textDecoration: 'none', fontSize: 15,
          }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
