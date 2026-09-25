import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../../utils/api';

// The 7 facility images
const galleryImages = [
  '/images/facility1.jpeg',
  '/images/facility2.jpeg',
  '/images/facility3.jpeg',
  '/images/facility4.jpeg',
  '/images/facility5.jpeg',
  '/images/facility6.jpeg',
  '/images/facility7.jpeg',
];

const Gallery = () => {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);

  const go = (index) => {
    const next = (index + galleryImages.length) % galleryImages.length;
    setCurrent(next);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Main viewer */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: 'var(--brown-900)' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', background: '#000' }}>
          {galleryImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Doggo'tel facility ${i + 1}`}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: i === current ? 1 : 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button onClick={() => go(current - 1)} aria-label="Previous image"
          style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.9)', color: 'var(--brown-800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
        >
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => go(current + 1)} aria-label="Next image"
          style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.9)', color: 'var(--brown-800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
        >
          <ChevronRight size={24} />
        </button>

        {/* Counter badge */}
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          background: 'rgba(59,31,10,0.75)', backdropFilter: 'blur(4px)',
          color: '#f5ede0', padding: '4px 12px', borderRadius: 'var(--radius-full)',
          fontSize: 13, fontWeight: 600,
        }}>
          {current + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnail strip - scrollable, clickable */}
      <div
        ref={trackRef}
        style={{
          display: 'flex', gap: 10, marginTop: 16, overflowX: 'auto',
          paddingBottom: 8, scrollBehavior: 'smooth',
        }}
      >
        {galleryImages.map((src, i) => (
          <button
            key={src}
            onClick={() => go(i)}
            style={{
              flexShrink: 0, width: 96, height: 68, borderRadius: 10, overflow: 'hidden',
              border: i === current ? '3px solid var(--olive-600)' : '3px solid transparent',
              padding: 0, cursor: 'pointer', background: 'none',
              opacity: i === current ? 1 : 0.65, transition: 'opacity 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => { if (i !== current) e.currentTarget.style.opacity = 0.65; }}
            aria-label={`View image ${i + 1}`}
          >
            <img src={src} alt={`Thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </button>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
        {galleryImages.map((_, i) => (
          <button key={i} onClick={() => go(i)} aria-label={`Go to image ${i + 1}`}
            style={{
              width: i === current ? 24 : 8, height: 8, borderRadius: 'var(--radius-full)',
              border: 'none', cursor: 'pointer', padding: 0,
              background: i === current ? 'var(--olive-600)' : 'var(--brown-300)',
              transition: 'width 0.3s, background 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/facilities')
      .then(r => setFacilities(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 70, background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--brown-900), var(--brown-800))',
        padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'var(--cream)', clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏡</div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#f5ede0', marginBottom: 16 }}>
            Our Facilities
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(245,237,224,0.75)', lineHeight: 1.7 }}>
            A safe, spacious and loving home environment in Schaapkraal, designed to keep your dog happy and comfortable.
          </p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section style={{ padding: '70px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', background: 'var(--olive-100)', color: 'var(--olive-800)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Photo Gallery</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: 'var(--brown-900)' }}>Take a look around 🐾</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: 15, marginTop: 8 }}>Click through to see where your dog will stay and play.</p>
          </div>
          <Gallery />
        </div>
      </section>

      {/* CTA with integrated facilities list */}
      <section style={{ padding: '60px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 14, color: 'var(--brown-900)' }}>
            What's included
          </h2>
          <p style={{ color: 'var(--gray-600)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Everything your dog needs for a safe, happy stay with us in Schaapkraal.
          </p>

          {/* Facilities as clean text list */}
          {loading ? (
            <div style={{ padding: 30, color: 'var(--brown-400)' }}>Loading...</div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '14px 32px', textAlign: 'left', marginBottom: 44,
            }}>
              {facilities.map((facility) => (
                <div key={facility.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--olive-600)', marginTop: 3, flexShrink: 0, fontWeight: 700 }}>🐾</span>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--brown-800)', fontSize: 15 }}>{facility.name}: </span>
                    <span style={{ color: 'var(--gray-600)', fontSize: 15 }}>{facility.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, marginBottom: 12, color: 'var(--brown-900)' }}>
            Seen enough? Let's get your dog booked in.
          </h3>
          <p style={{ color: 'var(--gray-600)', fontSize: 15, marginBottom: 28 }}>No account needed. Simple and quick.</p>
          <Link to="/booking" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 36px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: 16,
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

export default FacilitiesPage;
