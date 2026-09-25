import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Scissors, Award, Heart, Utensils, Bone, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import api from '../../utils/api';

// Map a service's `icon` field to a proper lucide icon component.
const iconMap = {
  moon: Moon,
  sun: Sun,
  scissors: Scissors,
  award: Award,
  heart: Heart,
  utensils: Utensils,
};

// Paw print SVG for subtle background motifs (matches HomePage pattern).
const PawPrint = ({ size = 24, color = 'currentColor', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity={opacity}>
    <circle cx="5.5" cy="6" r="2" />
    <circle cx="10.5" cy="4" r="2" />
    <circle cx="15.5" cy="4" r="2" />
    <circle cx="20" cy="6" r="2" />
    <path d="M12 8c-3 0-6 2-6.5 5.5C5 17 7 20 12 20s7-3 6.5-6.5C18 10 15 8 12 8z" />
  </svg>
);

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/services')
      .then((sRes) => {
        setServices(sRes.data);
      }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 70, background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--brown-900), var(--brown-800))',
        padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative paw prints */}
        <div style={{ position: 'absolute', top: 40, right: 60, opacity: 0.07, pointerEvents: 'none' }}>
          <PawPrint size={150} color="#fff" />
        </div>
        <div style={{ position: 'absolute', top: '30%', left: 50, opacity: 0.05, pointerEvents: 'none' }}>
          <PawPrint size={90} color="#fff" />
        </div>
        {/* Cream ellipse wave at the bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'var(--cream)', clipPath: 'ellipse(55% 100% at 50% 100%)' }} />

        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 76, height: 76, borderRadius: '50%', marginBottom: 22,
            background: 'rgba(245,237,224,0.12)', border: '1px solid rgba(245,237,224,0.25)',
            color: 'var(--olive-400)',
          }}>
            <PawPrint size={38} color="var(--olive-400)" />
          </div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#f5ede0', marginBottom: 16 }}>Our Services</h1>
          <p style={{ fontSize: 17, color: 'rgba(245,237,224,0.75)', lineHeight: 1.7 }}>
            From overnight boarding to day care, everything your dog needs is here in one loving place.
          </p>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '70px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background paw motif */}
        <div style={{ position: 'absolute', bottom: 40, right: -10, opacity: 0.05, pointerEvents: 'none' }}>
          <PawPrint size={220} color="var(--brown-700)" />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: 'var(--olive-100)', color: 'var(--olive-800)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>What We Offer</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: 'var(--brown-900)' }}>Tailored care for every dog</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 80, color: 'var(--brown-400)' }}>Loading services...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, maxWidth: 880, margin: '0 auto' }}>
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Bone;
                const hasPrice = service.price != null && Number(service.price) > 0;
                return (
                  <div key={service.id} style={{
                    display: 'flex', flexDirection: 'column',
                    background: '#fff', borderRadius: 'var(--radius-xl)', padding: 36,
                    border: '1px solid var(--brown-100)', boxShadow: 'var(--shadow)',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = 'var(--olive-400)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--brown-100)'; }}
                  >
                    {/* Circular olive-tinted icon badge */}
                    <div style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'var(--olive-100)', color: 'var(--olive-700)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 20,
                    }}>
                      <Icon size={30} />
                    </div>

                    {/* Name with short olive underline accent */}
                    <h3 style={{
                      fontSize: 20, fontWeight: 800, marginBottom: 12, color: 'var(--brown-900)',
                      display: 'inline-block', borderBottom: '3px solid var(--olive-400)',
                      paddingBottom: 6, alignSelf: 'flex-start',
                    }}>{service.name}</h3>

                    <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 24, flexGrow: 1 }}>{service.description}</p>

                    {/* Price pill / Included tag */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      {hasPrice ? (
                        <div style={{
                          display: 'inline-flex', alignItems: 'baseline', gap: 5,
                          background: 'var(--olive-50)', padding: '7px 16px',
                          borderRadius: 'var(--radius-full)', border: '1px solid var(--olive-100)',
                        }}>
                          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--olive-700)' }}>R{service.price}</span>
                          <span style={{ fontSize: 13, color: 'var(--brown-500)' }}>per session</span>
                        </div>
                      ) : (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: 'var(--olive-50)', padding: '7px 16px',
                          borderRadius: 'var(--radius-full)', border: '1px solid var(--olive-100)',
                        }}>
                          <Sparkles size={16} style={{ color: 'var(--olive-700)' }} />
                          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--olive-700)' }}>Included</span>
                        </div>
                      )}

                      <Link to="/booking" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        color: 'var(--olive-700)', fontWeight: 700, fontSize: 14, textDecoration: 'none',
                        transition: 'gap 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.gap = '8px'; }}
                        onMouseLeave={e => { e.currentTarget.style.gap = '4px'; }}
                      >
                        Book <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Long stay notice */}
      <section style={{ padding: '0 24px 10px', background: 'var(--cream)' }}>
        <div style={{
          maxWidth: 880, margin: '0 auto',
          background: 'var(--olive-50)', border: '1px solid var(--olive-100)',
          borderRadius: 'var(--radius-xl)', padding: '22px 26px',
          display: 'flex', alignItems: 'flex-start', gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'var(--olive-100)', color: 'var(--olive-700)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PawPrint size={22} color="var(--olive-700)" />
          </div>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--brown-900)', marginBottom: 6 }}>Staying longer than 10 nights?</h3>
            <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.7 }}>
              Stays longer than 10 nights are priced separately. Book your dates or contact us and we'll send you a personalised quote.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64, borderRadius: '50%', marginBottom: 18,
            background: 'var(--olive-100)', color: 'var(--olive-700)',
          }}>
            <PawPrint size={32} color="var(--olive-700)" />
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, marginBottom: 16, color: 'var(--brown-900)' }}>Ready to book?</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>It only takes a few minutes. No account needed.</p>
          <Link to="/booking" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 40px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: 16,
            background: 'linear-gradient(135deg, var(--olive-600), var(--olive-900))', color: '#fff',
            boxShadow: '0 4px 16px rgba(74,94,32,0.4)', textDecoration: 'none',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            Book a Stay <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
