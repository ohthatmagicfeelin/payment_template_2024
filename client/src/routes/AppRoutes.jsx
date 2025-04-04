// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Loading from '@/common/components/ui/Loading';
import PaymentForm from '@/features/payments/components/PaymentForm';
import { LoginContainer } from '@/features/auth/login/components/LoginContainer';
import { SignupContainer } from '@/features/auth/signup/components/SignupContainer';
import { ForgotPasswordContainer } from '@/features/auth/password/forgot/components/ForgotPasswordContainer';
import { ResetPasswordContainer } from '@/features/auth/password/reset/components/ResetPasswordContainer';
import { EmailVerificationPendingContainer } from '@/features/auth/verify/pending/components/EmailVerificationPendingContainer';
import { EmailVerificationSuccessContainer } from '@/features/auth/verify/success/components/EmailVerificationSuccessContainer';
import { LogoutContainer } from '@/features/auth/logout/components/LogoutContainer';
import { ProtectedRoute } from '@/features/auth/common/components/ProtectedRoute';
import { Settings } from '@/pages/Settings';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { LandingContainer } from '@/features/landing/components/LandingContainer';

const NotFound = lazy(() => import('@/common/components/error/NotFound'));

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <MainLayout>
        <Routes>
          {/* Root route - Landing page for everyone */}
          <Route path="/" element={<LandingContainer />} />

          {/* Public routes - redirect if authenticated */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <LoginContainer />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignupContainer />} 
          />

          <Route path="/verify-email" element={<EmailVerificationSuccessContainer />}/>
          <Route path="/forgot-password" element={<ForgotPasswordContainer />}/>
          <Route path="/reset-password" element={<ResetPasswordContainer />} />  
          <Route path="/verification-pending" element={<EmailVerificationPendingContainer />}/>
          <Route path="/logout" element={<LogoutContainer />} />

          {/* Protected routes */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Suspense>
  );
}

export default AppRoutes;