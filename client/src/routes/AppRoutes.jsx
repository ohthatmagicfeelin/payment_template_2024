// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Loading from '@/common/components/ui/Loading';
import PaymentForm from '@/features/payments/components/PaymentForm';
import { EmailVerificationPending, ForgotPassword, ResetPassword, VerifyEmail } from '@/features/auth/components/index.js';
import { LoginContainer } from '@/features/auth/login/components/LoginContainer';
import { SignupContainer } from '@/features/auth/signup/components/SignupContainer';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { Settings } from '@/pages/Settings';
import { MainLayout } from '@/layouts/MainLayout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

const Home = lazy(() => import('@/common/components/Home'));
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
          {/* Root redirect */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
          />

          {/* Public routes - redirect if authenticated */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginContainer />} 
          />
          <Route 
            path="/signup" 
            element={isAuthenticated ? <Navigate to="/home" replace /> : <SignupContainer />} 
          />

          <Route path="/verify-email" element={<VerifyEmail />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
          <Route path="/reset-password" element={<ResetPassword />} />  
          <Route path="/verification-pending" element={<EmailVerificationPending />}/>

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
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