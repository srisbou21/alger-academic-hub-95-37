import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { UpdateProfile } from './components/UpdateProfile';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { UserManagement } from './components/dashboard/UserManagement';
import { AcademicRegistrationForm } from './components/forms/AcademicRegistrationForm';
import { ReservationProvider } from './contexts/ReservationContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

function App() {
  useEffect(() => {
    document.title = 'FSECSG - IA Platform';
  }, []);

  return (
    <ReservationProvider>
      <div className="min-h-screen">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/notifications" element={<NotificationCenter />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/academic/register" element={<AcademicRegistrationForm />} />
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </ReservationProvider>
  );
}

export default App;