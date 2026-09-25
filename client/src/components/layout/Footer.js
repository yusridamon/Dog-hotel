import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: 'var(--brown-900)', color: 'var(--brown-300)', paddingTop: 60, paddingBottom: 32 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 48 }}>

        {/* Brand */}
        <div>
          <img
            src="/images/logo.png"
            alt="Doggo'tel logo"
            style={{ height: 80, width: 'auto', borderRadius: 12, marginBottom: 16, objectFit: 'contain' }}
          />
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--brown-300)' }}>
            Premium dog boarding in Schaapkraal, Cape Town. We treat every dog like family, ensuring a safe, happy and comfortable stay while you're away.
          </p>
          {/* Paw prints decoration */}
          <div style={{ marginTop: 16, fontSize: 18, opacity: 0.3, letterSpacing: 4 }}>🐾🐾🐾</div>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{ color: '#f5ede0', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Quick Links</h4>
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About Yusri' },
            { to: '/facilities', label: 'Facilities' },
            { to: '/services', label: 'Services' },
            { to: '/booking', label: 'Book a Stay' },
            { to: '/contact', label: 'Contact Us' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--brown-300)', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--olive-400)'}
              onMouseLeave={e => e.target.style.color = 'var(--brown-300)'}
            >{label}</Link>
          ))}
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ color: '#f5ede0', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Contact</h4>
          {[
            { icon: <MapPin size={14} />, text: 'Schaapkraal, Cape Town' },
            { icon: <Phone size={14} />, text: '066 291 5804' },
            { icon: <Mail size={14} />, text: 'doggotel.cpt@gmail.com' },
            { icon: <Clock size={14} />, text: 'Open 7 days a week' },
          ].map(({ icon, text }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 14, color: 'var(--brown-300)' }}>
              <span style={{ marginTop: 2, color: 'var(--olive-400)', flexShrink: 0 }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--olive-600)' }}>
            <p style={{ fontSize: 13, color: 'var(--brown-300)', margin: 0 }}>Owners: <strong style={{ color: '#f5ede0' }}>Yusri & Laaiqah Damon</strong></p>
          </div>
        </div>

        {/* Opening hours */}
        <div>
          <h4 style={{ color: '#f5ede0', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Hours</h4>
          {[
            { day: 'Monday – Friday', hours: '7:00am – 8:00pm' },
            { day: 'Saturday', hours: '8:00am – 6:00pm' },
            { day: 'Sunday', hours: '9:00am – 5:00pm' },
            { day: 'Bank Holidays', hours: '10:00am – 4:00pm' },
          ].map(({ day, hours }) => (
            <div key={day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: 'var(--brown-300)' }}>{day}</span>
              <span style={{ color: 'var(--olive-400)', fontWeight: 500 }}>{hours}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--brown-500)' }}>
          © {new Date().getFullYear()} Doggo'tel. All rights reserved.
        </p>
        <Link to="/admin/login" style={{ fontSize: 12, color: 'var(--brown-600)', textDecoration: 'none' }}
          onMouseEnter={e => e.target.style.color = 'var(--brown-400)'}
          onMouseLeave={e => e.target.style.color = 'var(--brown-600)'}
        >Staff Login</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
