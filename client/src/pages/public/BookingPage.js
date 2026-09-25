import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronRight, ChevronLeft, Dog, Calendar, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { formatDate, formatCurrency, calculateNights } from '../../utils/helpers';

const STEPS = ['Your Details', 'Your Dogs', 'Stay Dates', 'Extra Info', 'Review & Book'];

const inputStyle = {
  width: '100%', padding: '12px 16px',
  border: '2px solid var(--gray-200)', borderRadius: 'var(--radius)',
  fontSize: 15, background: '#fff', color: 'var(--gray-800)',
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
};

const labelStyle = { display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--gray-700)' };

const focusIn = (e) => e.target.style.borderColor = 'var(--green-500)';
const focusOut = (e) => e.target.style.borderColor = 'var(--gray-200)';

const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pricing, setPricing] = useState({ pricePerDogPerNight: 250, currencySymbol: 'R' });
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    dogs: [{ name: '', breed: '' }],
    checkInDate: '', checkOutDate: '',
    feedingInstructions: '', medicalInfo: '', specialRequirements: '', additionalNotes: '',
  });

  useEffect(() => {
    api.get('/public/pricing').then(r => setPricing(r.data)).catch(() => {});
  }, []);

  const nights = form.checkInDate && form.checkOutDate
    ? calculateNights(form.checkInDate, form.checkOutDate) : 0;
  // Stays longer than the threshold are priced separately via a manual quote.
  const quoteThreshold = pricing.quoteThresholdNights || 10;
  const requiresQuote = nights > quoteThreshold;
  const totalPrice = nights > 0 && !requiresQuote ? nights * form.dogs.length * pricing.pricePerDogPerNight : 0;

  // Live availability check for the chosen dates
  const [availability, setAvailability] = useState(null); // { available, isAvailable } | null
  const [checkingAvail, setCheckingAvail] = useState(false);

  useEffect(() => {
    if (nights > 0 && form.checkInDate && form.checkOutDate) {
      setCheckingAvail(true);
      setAvailability(null);
      const params = new URLSearchParams({
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        numberOfDogs: form.dogs.length,
      });
      api.get(`/bookings/availability?${params}`)
        .then(r => setAvailability(r.data))
        .catch(() => setAvailability(null))
        .finally(() => setCheckingAvail(false));
    } else {
      setAvailability(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.checkInDate, form.checkOutDate, form.dogs.length]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const setDog = (i, field, value) => {
    const dogs = [...form.dogs];
    dogs[i] = { ...dogs[i], [field]: value };
    setForm(f => ({ ...f, dogs }));
  };
  const addDog = () => setForm(f => ({ ...f, dogs: [...f.dogs, { name: '', breed: '' }] }));
  const removeDog = (i) => setForm(f => ({ ...f, dogs: f.dogs.filter((_, idx) => idx !== i) }));

  const canProceed = () => {
    if (step === 0) return form.fullName.trim() && form.email.trim() && form.phone.trim();
    if (step === 1) return form.dogs.every(d => d.name.trim() && d.breed.trim());
    if (step === 2) {
      if (!form.checkInDate || !form.checkOutDate) return false;
      if (availability && !availability.isAvailable) return false;
      const n = calculateNights(form.checkInDate, form.checkOutDate);
      return n > 0;
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        ...form,
        numberOfDogs: form.dogs.length,
      });
      navigate('/booking/confirmation', { state: { booking: res.data.booking, referenceNumber: res.data.referenceNumber } });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Booking failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ paddingTop: 70, background: 'var(--gray-50)', minHeight: '100vh' }}>
      {/* Collapse two-column form fields on small phones */}
      <style>{`
        @media (max-width: 520px) {
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,var(--green-900),var(--green-700))', padding: '48px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px,4vw,46px)', color: '#fff', marginBottom: 8 }}>Book a Stay</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>No account needed. Quick and easy.</p>
      </div>

      {/* Stepper */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--gray-200)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{
              flex: 1, minWidth: 100, padding: '18px 8px', textAlign: 'center', position: 'relative',
              borderBottom: i === step ? '3px solid var(--green-700)' : '3px solid transparent',
              cursor: i < step ? 'pointer' : 'default',
            }} onClick={() => i < step && setStep(i)}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                background: i < step ? 'var(--green-700)' : i === step ? 'var(--green-900)' : 'var(--gray-200)',
                color: i <= step ? '#fff' : 'var(--gray-500)',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 12, fontWeight: i === step ? 700 : 500, color: i === step ? 'var(--green-900)' : i < step ? 'var(--green-700)' : 'var(--gray-400)', whiteSpace: 'nowrap' }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 24px 60px' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '40px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-200)' }}>

          {/* Step 0: Personal details */}
          {step === 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)' }}>
                  <Dog size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>Your Details</h2>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>We'll use these to contact you about your booking</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Jane Smith" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="07700 900000" required style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Dogs */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)', fontSize: 20 }}>🐶</div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>Your Dogs</h2>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Add each dog you'd like to bring</p>
                </div>
              </div>
              {form.dogs.map((dog, i) => (
                <div key={i} style={{
                  border: '2px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: 24,
                  marginBottom: 16, position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--green-800)' }}>Dog {i + 1}</span>
                    {form.dogs.length > 1 && (
                      <button onClick={() => removeDog(i)} style={{ background: 'none', border: 'none', color: 'var(--red-500)', cursor: 'pointer', padding: 4 }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Dog's Name *</label>
                      <input value={dog.name} onChange={e => setDog(i, 'name', e.target.value)} placeholder="Buddy" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <div>
                      <label style={labelStyle}>Breed *</label>
                      <input value={dog.breed} onChange={e => setDog(i, 'breed', e.target.value)} placeholder="Golden Retriever" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addDog} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                border: '2px dashed var(--green-400)', borderRadius: 'var(--radius)',
                background: 'var(--green-50)', color: 'var(--green-700)', fontWeight: 600, fontSize: 14,
                cursor: 'pointer', width: '100%', justifyContent: 'center',
              }}>
                <Plus size={16} /> Add Another Dog
              </button>
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)' }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>Stay Dates</h2>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>When would you like to drop off and collect?</p>
                </div>
              </div>
              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Check-In Date *</label>
                  <input type="date" value={form.checkInDate} min={today}
                    onChange={e => { set('checkInDate', e.target.value); if (form.checkOutDate && e.target.value >= form.checkOutDate) set('checkOutDate', ''); }}
                    style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={labelStyle}>Check-Out Date *</label>
                  <input type="date" value={form.checkOutDate} min={form.checkInDate || today}
                    onChange={e => set('checkOutDate', e.target.value)}
                    style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                </div>
              </div>
              {nights > 0 && requiresQuote && (
                <div style={{ marginTop: 24, background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
                  <p style={{ fontSize: 15, color: 'var(--green-800)', fontWeight: 700, marginBottom: 6 }}>Stays longer than {quoteThreshold} nights are priced separately</p>
                  <p style={{ fontSize: 14, color: 'var(--green-700)', lineHeight: 1.6 }}>
                    Submit your booking and we'll send you a personalised quote for your {nights}-night stay.
                  </p>
                </div>
              )}
              {nights > 0 && !requiresQuote && (
                <div style={{ marginTop: 24, background: 'var(--green-50)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, color: 'var(--green-800)', fontWeight: 600 }}>Estimated Total</p>
                      <p style={{ fontSize: 13, color: 'var(--green-700)' }}>
                        {nights} night{nights !== 1 ? 's' : ''} × {form.dogs.length} dog{form.dogs.length !== 1 ? 's' : ''} × {pricing.currencySymbol}{pricing.pricePerDogPerNight}/night
                      </p>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--green-900)' }}>{formatCurrency(totalPrice)}</div>
                  </div>
                </div>
              )}

              {/* Availability status */}
              {nights > 0 && checkingAvail && (
                <div style={{ marginTop: 16, fontSize: 13, color: 'var(--gray-500)' }}>Checking availability…</div>
              )}
              {nights > 0 && availability && (
                availability.isAvailable ? (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius)', fontSize: 14, color: '#166534', fontWeight: 600 }}>
                    ✓ Available — {availability.available} {availability.available === 1 ? 'kennel' : 'kennels'} free for these dates ({form.dogs.length} needed)
                  </div>
                ) : (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius)', fontSize: 14, color: '#991b1b', fontWeight: 600 }}>
                    ✗ We need {form.dogs.length} kennel{form.dogs.length === 1 ? '' : 's'} (one per dog) but only {availability.available} {availability.available === 1 ? 'is' : 'are'} free for these dates. Please try different dates or contact us on 066 291 5804.
                  </div>
                )
              )}
            </div>
          )}

          {/* Step 3: Extra info */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)' }}>
                  <FileText size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>Extra Information</h2>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>All fields optional but help us care for your dog better</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'Feeding Instructions', field: 'feedingInstructions', placeholder: 'e.g. 2 cups of dry food twice a day, 8am and 6pm…' },
                  { label: 'Medication / Medical Information', field: 'medicalInfo', placeholder: 'e.g. Takes 1 tablet daily for arthritis, given with food…' },
                  { label: 'Special Requirements', field: 'specialRequirements', placeholder: 'e.g. Needs to sleep with a light on, nervous around big dogs…' },
                  { label: 'Additional Notes', field: 'additionalNotes', placeholder: 'Anything else we should know…' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label style={labelStyle}>{label}</label>
                    <textarea value={form[field]} onChange={e => set(field, e.target.value)}
                      placeholder={placeholder} rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={focusIn} onBlur={focusOut} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)' }}>
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>Review & Confirm</h2>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Please check all details before submitting</p>
                </div>
              </div>

              {/* Summary sections */}
              {[
                {
                  title: 'Your Details',
                  rows: [['Name', form.fullName], ['Email', form.email], ['Phone', form.phone]],
                },
                {
                  title: `Your Dogs (${form.dogs.length})`,
                  rows: form.dogs.map((d, i) => [`Dog ${i + 1}`, `${d.name} – ${d.breed}`]),
                },
                {
                  title: 'Stay Dates',
                  rows: [
                    ['Check-In', formatDate(form.checkInDate)],
                    ['Check-Out', formatDate(form.checkOutDate)],
                    ['Duration', `${nights} night${nights !== 1 ? 's' : ''}`],
                  ],
                },
              ].map(({ title, rows }) => (
                <div key={title} style={{ marginBottom: 24, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--gray-50)', padding: '10px 16px', borderBottom: '1px solid var(--gray-200)', fontWeight: 700, fontSize: 13, color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
                  {rows.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', padding: '10px 16px', borderBottom: '1px solid var(--gray-100)', fontSize: 14 }}>
                      <span style={{ width: 160, color: 'var(--gray-500)', flexShrink: 0 }}>{k}</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Price breakdown */}
              <div style={{ background: 'linear-gradient(135deg,var(--green-900),var(--green-800))', borderRadius: 'var(--radius-lg)', padding: 24, color: '#fff' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>Price Summary</h3>
                {requiresQuote ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, opacity: 0.85 }}>
                      <span>{nights} nights × {form.dogs.length} dog{form.dogs.length > 1 ? 's' : ''}</span>
                      <span>Quote to follow</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>
                      <span>Total</span>
                      <span>Quote to follow</span>
                    </div>
                    <p style={{ fontSize: 12, opacity: 0.7, marginTop: 10 }}>
                      Stays longer than {quoteThreshold} nights are priced separately. Submit your booking and we'll send you a personalised quote.
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, opacity: 0.85 }}>
                      <span>{nights} nights × {form.dogs.length} dog{form.dogs.length > 1 ? 's' : ''} × {pricing.currencySymbol}{pricing.pricePerDogPerNight}</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>
                      <span>Estimated Total</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <p style={{ fontSize: 12, opacity: 0.7, marginTop: 10 }}>
                      Payment is collected on check-in. Price confirmed upon booking confirmation.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, gap: 12 }}>
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '12px 24px',
                border: '2px solid var(--gray-300)', borderRadius: 'var(--radius-full)',
                background: 'none', fontWeight: 600, fontSize: 15, color: 'var(--gray-700)',
                cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={18} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '12px 28px',
                  borderRadius: 'var(--radius-full)', border: 'none',
                  background: !canProceed() ? 'var(--gray-300)' : 'linear-gradient(135deg,var(--green-700),var(--green-900))',
                  color: '#fff', fontWeight: 700, fontSize: 15,
                  cursor: !canProceed() ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => { if (canProceed()) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '14px 32px',
                  borderRadius: 'var(--radius-full)', border: 'none',
                  background: submitting ? 'var(--gray-400)' : 'linear-gradient(135deg,var(--green-700),var(--green-900))',
                  color: '#fff', fontWeight: 700, fontSize: 16,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(45,106,79,0.4)',
                }}
              >
                {submitting ? '⏳ Submitting…' : '🐾 Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
