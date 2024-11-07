// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from '@/components/loading/Loading';
import PaymentForm from '@/components/payments/PaymentForm';
import { LoginForm, SignupForm, EmailVerificationPending, ForgotPassword, ResetPassword, VerifyEmail } from '@/components/auth/index.js';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Settings } from '@/pages/Settings';
import { AppProviders } from '@/providers/AppProviders';
import { MainLayout } from '@/layouts/MainLayout';

const Home = lazy(() => import('@/components/Home'));
const NotFound = lazy(() => import('@/components/error/NotFound'));

function AppRoutes() {
  return (
    <AppProviders>
      <Suspense fallback={<Loading />}>
        <MainLayout>
          <Routes>
            {/* Public routes */}
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verification-pending" element={<EmailVerificationPending />} />

            {/* Protected routes */}
            <Route
              path="/"
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

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Suspense>
    </AppProviders>
  );
}

export default AppRoutes;