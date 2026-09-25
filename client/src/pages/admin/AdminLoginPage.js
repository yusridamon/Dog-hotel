import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: '2px solid var(--gray-200)', borderRadius: 'var(--radius)',
    fontSize: 15, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--brown-900) 0%, var(--brown-800) 50%, var(--olive-900) 100%)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img
            src="/images/logo.png"
            alt="Doggo'tel logo"
            style={{ height: 110, width: 'auto', borderRadius: 16, margin: '0 auto 16px', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
          />
          <p style={{ color: 'rgba(245,237,224,0.6)', fontSize: 14 }}>Admin Portal</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-xl)', padding: '36px 36px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--gray-900)' }}>Sign In</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--gray-700)' }}>
                Email Address
              </label>
              <input
                type="email" required autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@doghotel.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--green-500)'}
                onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--gray-700)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => e.target.style.borderColor = 'var(--green-500)'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 4 }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px', borderRadius: 'var(--radius-full)', border: 'none',
              background: loading ? 'var(--gray-400)' : 'linear-gradient(135deg,var(--green-700),var(--green-900))',
              color: '#fff', fontSize: 16, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4,
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <LogIn size={18} /> {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 2 }}>Default credentials (change after setup):</p>
            <p style={{ fontSize: 12, color: 'var(--gray-600)', fontFamily: 'monospace' }}>admin@doghotel.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
