import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Star, Clock, Phone, ChevronRight, CheckCircle, MapPin, Bone, Bed, Tag, Link2, Home } from 'lucide-react';
import api from '../../utils/api';

const features = [
  { icon: <Shield size={28} />, title: '24/7 Supervision', desc: 'Round-the-clock care from our dedicated team, every single day.' },
  { icon: <Heart size={28} />, title: 'Individual Attention', desc: 'Every dog gets one-on-one love and personalised care during their stay.' },
  { icon: <Star size={28} />, title: 'Spacious Play Area', desc: 'Large outdoor play area where dogs can run, socialise and have fun.' },
  { icon: <Clock size={28} />, title: 'Flexible Stays', desc: 'Day care or overnight boarding — we work around your schedule.' },
];

const whyUs = [
  'Safe, secure and fully fenced property',
  'Dogs treated like family in a home environment',
  'Feeding and medication schedules followed exactly',
  'Regular updates and photos sent to owners',
  'Separate areas for small and large dogs',
  'Located in Schaapkraal, Cape Town',
];

const bringItems = [
  { icon: <Bone size={24} />, title: 'Food', desc: 'To keep their tummy happy and routine consistent.' },
  { icon: <Bed size={24} />, title: 'Blanket', desc: 'For comfort and a familiar scent from home.' },
  { icon: <Tag size={24} />, title: 'Collar', desc: 'For safety and easy identification.' },
  { icon: <Link2 size={24} />, title: 'Leash', desc: 'For safe walks and outdoor adventures.' },
];

// Paw print SVG for decorations
const PawPrint = ({ size = 24, color = 'currentColor', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity={opacity}>
    <circle cx="5.5" cy="6" r="2"/>
    <circle cx="10.5" cy="4" r="2"/>
    <circle cx="15.5" cy="4" r="2"/>
    <circle cx="20" cy="6" r="2"/>
    <path d="M12 8c-3 0-6 2-6.5 5.5C5 17 7 20 12 20s7-3 6.5-6.5C18 10 15 8 12 8z"/>
  </svg>
);

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    api.get('/public/services').then(r => setServices(r.data.slice(0, 3))).catch(() => {});
    api.get('/public/pricing').then(r => setPricing(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(160deg, var(--brown-900) 0%, var(--brown-800) 45%, var(--olive-900) 100%)',
        overflow: 'hidden',
      }}>
        {/* Decorative paw prints */}
        <div style={{ position: 'absolute', top: 80, right: 60, opacity: 0.08 }}>
          <PawPrint size={180} color="#fff" />
        </div>
        <div style={{ position: 'absolute', bottom: 60, left: 40, opacity: 0.06 }}>
          <PawPrint size={120} color="#fff" />
        </div>
        <div style={{ position: 'absolute', top: '40%', right: '15%', opacity: 0.05 }}>
          <PawPrint size={80} color="#fff" />
        </div>
        {/* Beige wave at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'var(--cream)',
          clipPath: 'ellipse(55% 100% at 50% 100%)',
        }} />

        {/* Responsive: stack hero on mobile */}
        <style>{`
          @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-map { margin-top: 8px; }
          }
        `}</style>

        <div className="hero-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 100px', position: 'relative', zIndex: 1, width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
          <div>
            {/* Logo image */}
            <div style={{ marginBottom: 28, display: 'inline-block' }}>
              <img
                src="/images/logo.png"
                alt="Doggo'tel logo"
                style={{
                  height: 150, width: 'auto', borderRadius: 20,
                  objectFit: 'contain', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                  display: 'block',
                }}
              />
            </div>

            <h1 style={{
              fontSize: 'clamp(22px, 3.5vw, 36px)',
              fontWeight: 600, color: 'rgba(245,237,224,0.85)', marginBottom: 20, lineHeight: 1.4,
            }}>
              Your dog's happy place away from home.
            </h1>

            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(245,237,224,0.7)', marginBottom: 40, lineHeight: 1.8, maxWidth: 520 }}>
              Doggy day care & overnight boarding in Schaapkraal, Cape Town. Individual attention, spacious outdoor play area and lots of love.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/booking" style={{
                padding: '16px 32px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: 16,
                background: 'var(--olive-600)', color: '#fff',
                boxShadow: '0 4px 20px rgba(74,94,32,0.5)', transition: 'transform 0.2s, box-shadow 0.2s',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(74,94,32,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(74,94,32,0.5)'; }}
              >
                Book a Stay <ChevronRight size={18} />
              </Link>
              <Link to="/services" style={{
                padding: '16px 32px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: 16,
                background: 'rgba(245,237,224,0.12)', color: '#f5ede0',
                border: '2px solid rgba(245,237,224,0.3)', transition: 'background 0.2s',
                textDecoration: 'none',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,237,224,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,237,224,0.12)'}
              >Our Services</Link>
            </div>

            {pricing && (
              <p style={{ marginTop: 24, color: 'rgba(245,237,224,0.55)', fontSize: 14 }}>
                From <strong style={{ color: 'var(--olive-400)' }}>R{pricing.pricePerDogPerNight}</strong> per dog per night
              </p>
            )}
          </div>

          {/* Map card on the right */}
          <div className="hero-map">
            <div style={{
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
              borderRadius: 20, padding: 12, border: '1px solid rgba(245,237,224,0.2)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 12px', color: '#f5ede0' }}>
                <MapPin size={18} style={{ color: 'var(--olive-400)' }} />
                <span style={{ fontWeight: 600, fontSize: 15 }}>Find us in Philippi, Cape Town</span>
              </div>
              <iframe
                title="Doggo'tel location"
                src="https://www.google.com/maps?q=XG6H%2BXJ%20Philippi%2C%20Cape%20Town&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: 14, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href="https://www.google.com/maps/search/?api=1&query=XG6H%2BXJ%20Philippi%2C%20Cape%20Town"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  marginTop: 10, padding: '10px', borderRadius: 12,
                  background: 'var(--olive-600)', color: '#fff', fontWeight: 600, fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                Get Directions <ChevronRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: 'var(--beige)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: 'var(--olive-100)', color: 'var(--olive-800)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Why Choose Us</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: 'var(--brown-900)' }}>
              Everything your dog needs 🐾
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: 'var(--cream)', borderRadius: 'var(--radius-lg)', padding: 32,
                boxShadow: 'var(--shadow)', border: '1px solid var(--brown-100)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{ color: 'var(--olive-700)', marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--brown-800)' }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to bring section - recreated from their flyer in code */}
      <section style={{ padding: '80px 24px', background: 'var(--cream)' }}>
        <style>{`
          @media (max-width: 820px) {
            .bring-photo { width: clamp(160px, 55vw, 220px) !important; height: clamp(160px, 55vw, 220px) !important; }
          }
        `}</style>

        <div style={{
          position: 'relative', maxWidth: 1000, margin: '0 auto', overflow: 'hidden',
          background: 'linear-gradient(160deg, var(--beige) 0%, var(--beige-dark) 100%)',
          borderRadius: 32, padding: 'clamp(28px, 5vw, 56px)',
          border: '1px solid var(--brown-100)', boxShadow: 'var(--shadow-lg, 0 12px 40px rgba(59,31,10,0.12))',
        }}>
          {/* Background paw motifs */}
          <div style={{ position: 'absolute', top: 20, right: 30, opacity: 0.09, pointerEvents: 'none' }}>
            <PawPrint size={120} color="var(--brown-700)" />
          </div>
          <div style={{ position: 'absolute', bottom: 30, left: 20, opacity: 0.08, pointerEvents: 'none' }}>
            <PawPrint size={90} color="var(--brown-700)" />
          </div>
          <div style={{ position: 'absolute', top: '45%', left: '42%', opacity: 0.06, pointerEvents: 'none' }}>
            <PawPrint size={70} color="var(--brown-700)" />
          </div>

          {/* Header + photo - centered, stacked */}
          <div className="bring-header" style={{
            position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center', gap: 24, marginBottom: 40,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ lineHeight: 1.02, marginBottom: 10, fontWeight: 900, letterSpacing: '-1px' }}>
                <span style={{ display: 'block', fontSize: 'clamp(38px, 8vw, 72px)', color: 'var(--brown-900)', textTransform: 'lowercase' }}>what to</span>
                <span style={{ position: 'relative', display: 'inline-block', fontSize: 'clamp(44px, 9vw, 84px)', color: 'var(--olive-700)', textTransform: 'lowercase' }}>
                  bring
                  {/* small orange accent burst near "bring" */}
                  <span style={{ position: 'absolute', top: -6, right: -26, display: 'inline-flex', gap: 3 }} aria-hidden="true">
                    <span style={{ display: 'block', width: 4, height: 16, borderRadius: 4, background: 'var(--amber-500)', transform: 'rotate(20deg)' }} />
                    <span style={{ display: 'block', width: 4, height: 22, borderRadius: 4, background: 'var(--amber-400)' }} />
                    <span style={{ display: 'block', width: 4, height: 16, borderRadius: 4, background: 'var(--amber-500)', transform: 'rotate(-20deg)' }} />
                  </span>
                </span>
              </h2>
              <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 600, color: 'var(--brown-700)', marginBottom: 20 }}>
                for your dog's stay
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'var(--brown-900)', color: 'var(--cream)',
                padding: '10px 18px', borderRadius: 'var(--radius-full)',
                fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow, 0 4px 14px rgba(59,31,10,0.2))',
              }}>
                <PawPrint size={18} color="var(--cream)" />
                <span>A little from home, makes their stay comfortable.</span>
              </div>
            </div>

            {/* Rottweiler photo in an organic blob, centered below the header */}
            <div className="bring-photo" style={{
              width: 'clamp(180px, 30vw, 260px)', height: 'clamp(180px, 30vw, 260px)',
              borderRadius: '60% 40% 55% 45% / 55% 50% 50% 45%',
              overflow: 'hidden', border: '5px solid var(--cream)',
              boxShadow: '0 14px 40px rgba(59,31,10,0.25)',
            }}>
              <img
                src="/images/rottie.jpg"
                alt="A happy Rottweiler"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
              />
            </div>
          </div>

          {/* Four item rows */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bringItems.map(({ icon, title, desc }) => (
              <div key={title} style={{
                display: 'flex', alignItems: 'center', gap: 18,
                background: 'rgba(250,246,240,0.85)', borderRadius: 'var(--radius-lg, 18px)',
                padding: '18px 22px', border: '1px solid var(--brown-100)',
                boxShadow: '0 4px 14px rgba(59,31,10,0.06)',
              }}>
                <div style={{
                  flexShrink: 0, width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--olive-100)', color: 'var(--olive-700)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: 16, fontWeight: 800, color: 'var(--brown-900)',
                    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4,
                    display: 'inline-block', borderBottom: '3px solid var(--olive-400)', paddingBottom: 2,
                  }}>{title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6, marginTop: 6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10, marginTop: 32, flexWrap: 'wrap',
            color: 'var(--brown-700)', fontSize: 15, fontWeight: 600, textAlign: 'center',
          }}>
            <Home size={20} style={{ color: 'var(--olive-700)', flexShrink: 0 }} />
            <span>Thank you for helping us make your pup feel at home!</span>
            <Heart size={18} fill="var(--red-500)" style={{ color: 'var(--red-500)', flexShrink: 0 }} />
          </div>
        </div>
      </section>

      {/* Services preview */}
      {services.length > 0 && (
        <section style={{ padding: '80px 24px', background: 'var(--beige)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'inline-block', background: 'var(--olive-100)', color: 'var(--olive-800)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Our Services</div>
                <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'var(--brown-900)' }}>Tailored care for every dog</h2>
              </div>
              <Link to="/services" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--olive-700)', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                View all services <ChevronRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {services.map((s) => (
                <div key={s.id} style={{
                  background: 'var(--cream)', border: '1px solid var(--brown-100)', borderRadius: 'var(--radius-lg)', padding: 28,
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--olive-400)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--brown-100)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--brown-800)' }}>{s.name}</h3>
                  <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 16 }}>{s.description}</p>
                  {s.price && <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--olive-700)' }}>From R{s.price}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why us checklist */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, var(--brown-900) 0%, var(--brown-800) 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative paw */}
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
          <PawPrint size={300} color="#fff" />
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(245,237,224,0.12)', color: 'var(--olive-400)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Our Promise</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#f5ede0', marginBottom: 20 }}>
              Peace of mind,<br />guaranteed
            </h2>
            <p style={{ color: 'rgba(245,237,224,0.7)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              We understand how much your dog means to you. That's why Yusri, Laaiqah and the team go above and beyond to provide a safe, loving home environment.
            </p>
            <Link to="/booking" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px',
              background: 'var(--olive-600)', color: '#fff', borderRadius: 'var(--radius-full)',
              fontWeight: 700, textDecoration: 'none', transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              Book Now <ChevronRight size={16} />
            </Link>
          </div>
          <div>
            {whyUs.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <CheckCircle size={20} style={{ color: 'var(--olive-400)', marginTop: 2, flexShrink: 0 }} />
                <span style={{ color: 'rgba(245,237,224,0.85)', fontSize: 15, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--beige)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, marginBottom: 16, color: 'var(--brown-900)' }}>Ready to book?</h2>
          <p style={{ fontSize: 17, color: 'var(--gray-600)', marginBottom: 8, lineHeight: 1.7 }}>
            It only takes a few minutes. No account needed.
          </p>
          <p style={{ fontSize: 14, color: 'var(--brown-500)', marginBottom: 32 }}>
            📍 Schaapkraal, Cape Town &nbsp;|&nbsp; 📞 066 291 5804
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/booking" style={{
              padding: '16px 40px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: 16,
              background: 'linear-gradient(135deg, var(--olive-600), var(--olive-900))',
              color: '#fff', boxShadow: '0 4px 16px rgba(74,94,32,0.4)', textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >Book a Stay</Link>
            <Link to="/contact" style={{
              padding: '16px 40px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: 16,
              border: '2px solid var(--brown-300)', color: 'var(--brown-700)',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--olive-500)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--brown-300)'}
            >
              <Phone size={16} /> Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
