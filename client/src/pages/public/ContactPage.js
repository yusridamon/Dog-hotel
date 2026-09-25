import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      toast.success("Message sent! We'll be in touch soon.");
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '2px solid var(--brown-200, #e8d8c8)',
    borderRadius: 'var(--radius)', fontSize: 15, background: 'var(--cream)', color: 'var(--brown-800)',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <div style={{ paddingTop: 70, background: 'var(--cream)' }}>
      <style>{`
        @media (max-width: 520px) {
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--brown-900), var(--brown-800))',
        padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'var(--cream)', clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📞</div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,50px)', fontWeight: 800, color: '#f5ede0', marginBottom: 16 }}>Get in Touch</h1>
          <p style={{ fontSize: 17, color: 'rgba(245,237,224,0.75)', lineHeight: 1.7 }}>
            Questions or want to find out more? Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section style={{ padding: '70px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>

          {/* Contact info */}
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, color: 'var(--brown-900)' }}>Contact Information</h2>
            {[
              { icon: <MapPin size={20} />, title: 'Address', text: 'Schaapkraal, Cape Town, Western Cape' },
              { icon: <Phone size={20} />, title: 'Phone / WhatsApp', text: '066 291 5804' },
              { icon: <Mail size={20} />, title: 'Email', text: 'doggotel.cpt@gmail.com' },
              { icon: <Clock size={20} />, title: 'Hours', text: 'Mon–Fri: 7am–8pm\nSat: 8am–6pm\nSun: 9am–5pm' },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius)', flexShrink: 0,
                  background: 'var(--olive-100)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'var(--olive-700)',
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--brown-500)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</div>
                  <div style={{ fontSize: 15, color: 'var(--brown-800)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>{text}</div>
                </div>
              </div>
            ))}

            {/* Owner card */}
            <div style={{
              marginTop: 8, padding: '20px 24px', background: 'var(--beige)',
              borderRadius: 'var(--radius-lg)', border: '1px solid var(--brown-100)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: 'var(--brown-800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>🐕</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--brown-900)' }}>Yusri & Laaiqah Damon</div>
                <div style={{ fontSize: 13, color: 'var(--brown-600)' }}>Owners, Doggo'tel Cape Town</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div style={{
                textAlign: 'center', padding: 60, background: 'var(--olive-50)',
                borderRadius: 'var(--radius-xl)', border: '1px solid var(--olive-200)',
              }}>
                <CheckCircle size={56} style={{ color: 'var(--olive-700)', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--brown-900)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: 15, lineHeight: 1.7 }}>
                  Thank you for getting in touch. Yusri will respond as soon as possible.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  style={{ marginTop: 24, padding: '10px 24px', borderRadius: 'var(--radius-full)', background: 'var(--olive-700)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4, color: 'var(--brown-900)' }}>Send a Message</h2>

                <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--brown-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Jane Smith"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--olive-500)'}
                      onBlur={e => e.target.style.borderColor = 'var(--brown-200, #e8d8c8)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--brown-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="jane@example.com"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--olive-500)'}
                      onBlur={e => e.target.style.borderColor = 'var(--brown-200, #e8d8c8)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--brown-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone / WhatsApp</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="066 291 5804"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--olive-500)'}
                    onBlur={e => e.target.style.borderColor = 'var(--brown-200, #e8d8c8)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--brown-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject *</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required placeholder="Enquiry about boarding"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--olive-500)'}
                    onBlur={e => e.target.style.borderColor = 'var(--brown-200, #e8d8c8)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--brown-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={6}
                    placeholder="Tell us how we can help..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--olive-500)'}
                    onBlur={e => e.target.style.borderColor = 'var(--brown-200, #e8d8c8)'}
                  />
                </div>

                <button type="submit" disabled={submitting} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 32px', borderRadius: 'var(--radius-full)', border: 'none',
                  background: submitting ? 'var(--gray-400)' : 'linear-gradient(135deg, var(--olive-600), var(--olive-900))',
                  color: '#fff', fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <Send size={18} /> {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
