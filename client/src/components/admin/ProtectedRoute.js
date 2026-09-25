import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40 }}>🐾</div>
        <p style={{ color: 'var(--gray-400)', fontSize: 15 }}>Loading…</p>
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

export default ProtectedRoute;
