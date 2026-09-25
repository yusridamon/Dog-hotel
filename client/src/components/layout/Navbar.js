import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

const Logo = ({ light = false }) => (
  <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
    <img
      src="/images/logo.png"
      alt="Doggo'tel logo"
      style={{
        height: 52, width: 'auto', objectFit: 'contain', flexShrink: 0,
        borderRadius: light ? 10 : 0,
      }}
    />
  </Link>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const transparent = isHome && !scrolled;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: transparent ? 'transparent' : 'rgba(250,246,240,0.97)',
      backdropFilter: transparent ? 'none' : 'blur(12px)',
      boxShadow: transparent ? 'none' : 'var(--shadow)',
      transition: 'all 0.3s ease',
      borderBottom: transparent ? 'none' : '1px solid var(--brown-100)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        <Logo light={transparent} />

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                padding: '8px 16px', borderRadius: 'var(--radius-full)',
                fontWeight: 500, fontSize: 15,
                color: isActive
                  ? (transparent ? '#fff' : 'var(--brown-800)')
                  : (transparent ? 'rgba(255,255,255,0.85)' : 'var(--brown-600)'),
                background: isActive
                  ? (transparent ? 'rgba(255,255,255,0.18)' : 'var(--beige)')
                  : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              })}
            >{label}</NavLink>
          ))}
          <Link to="/booking" style={{
            marginLeft: 8, padding: '10px 22px', borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--olive-600), var(--olive-900))',
            color: '#fff', fontWeight: 700, fontSize: 15,
            boxShadow: '0 2px 8px rgba(74,94,32,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            textDecoration: 'none',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 16px rgba(74,94,32,0.5)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 2px 8px rgba(74,94,32,0.4)'; }}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="mobile-menu-btn"
          style={{
            display: 'none', background: 'none', border: 'none',
            color: transparent ? '#fff' : 'var(--brown-700)', padding: 8, cursor: 'pointer',
          }}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'var(--cream)', borderTop: '1px solid var(--brown-100)',
          padding: '16px 24px 24px',
        }}>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'block', padding: '12px 16px', borderRadius: 'var(--radius)',
                fontWeight: 500, fontSize: 16, marginBottom: 4,
                color: isActive ? 'var(--brown-800)' : 'var(--brown-600)',
                background: isActive ? 'var(--beige)' : 'transparent',
                textDecoration: 'none',
              })}
            >{label}</NavLink>
          ))}
          <Link to="/booking" style={{
            display: 'block', marginTop: 12, padding: '14px 24px', borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--olive-600), var(--olive-900))',
            color: '#fff', fontWeight: 700, fontSize: 16, textAlign: 'center',
            textDecoration: 'none',
          }}>Book Now</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
