import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public pages
import Layout from './components/layout/Layout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import FacilitiesPage from './pages/public/FacilitiesPage';
import ServicesPage from './pages/public/ServicesPage';
import ContactPage from './pages/public/ContactPage';
import BookingPage from './pages/public/BookingPage';
import BookingConfirmationPage from './pages/public/BookingConfirmationPage';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBookingDetail from './pages/admin/AdminBookingDetail';
import AdminKennels from './pages/admin/AdminKennels';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCustomerDetail from './pages/admin/AdminCustomerDetail';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminMessages from './pages/admin/AdminMessages';

// Context
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="facilities" element={<FacilitiesPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="booking/confirmation" element={<BookingConfirmationPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="bookings/:id" element={<AdminBookingDetail />} />
            <Route path="kennels" element={<AdminKennels />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<AdminCustomerDetail />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
