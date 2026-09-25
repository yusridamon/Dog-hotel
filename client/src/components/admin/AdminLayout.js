import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, BookOpen, Building2,
  Users, MessageSquare, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: <BookOpen size={18} /> },
  { to: '/admin/kennels', label: 'Kennels', icon: <Building2 size={18} /> },
  { to: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
  { to: '/admin/calendar', label: 'Calendar', icon: <CalendarDays size={18} /> },
  { to: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside style={{
      width: mobile ? '100%' : 240,
      background: 'var(--gray-900)',
      display: 'flex',
      flexDirection: 'column',
      height: mobile ? 'auto' : '100vh',
      position: mobile ? 'static' : 'fixed',
      top: 0, left: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px', borderBottom: '1px solid var(--gray-800)', textAlign: 'center' }}>
        <img
          src="/images/logo.png"
          alt="Doggo'tel logo"
          style={{ height: 72, width: 'auto', borderRadius: 10, objectFit: 'contain', marginBottom: 6 }}
        />
        <div style={{ fontSize: 10, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Portal</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 'var(--radius)',
              marginBottom: 2, textDecoration: 'none', fontSize: 14, fontWeight: 500,
              color: isActive ? '#fff' : 'var(--gray-400)',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'all 0.15s',
            })}
          >
            {icon} {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--gray-800)' }}>
        <div style={{ padding: '10px 12px', marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{admin?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{admin?.email}</div>
        </div>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '10px 12px', borderRadius: 'var(--radius)', border: 'none',
          background: 'transparent', color: 'var(--gray-400)', fontSize: 14,
          fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-100)' }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop" style={{ width: 240, flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }} className="admin-sidebar-mobile">
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'relative', width: 260 }}>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div className="admin-topbar" style={{
          display: 'none', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', background: 'var(--gray-900)', borderBottom: '1px solid var(--gray-800)',
        }}>
          <img
            src="/images/logo.png"
            alt="Doggo'tel logo"
            style={{ height: 44, width: 'auto', borderRadius: 8, objectFit: 'contain' }}
          />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-topbar { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
