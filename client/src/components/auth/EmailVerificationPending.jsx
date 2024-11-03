// src/components/auth/EmailVerificationPending.jsx
import { useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '@/services/authService';
import { FaEnvelope } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

const EmailVerificationPending = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [resendStatus, setResendStatus] = useState('');

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  const handleResendVerification = async () => {
    try {
      await authService.resendVerificationEmail(email);
      setResendStatus('Verification email sent successfully!');
    } catch (err) {
      setResendStatus('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
          <FaEnvelope className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Check Your Email</h2>
        <p className="text-gray-600 mb-2">
          We've sent a verification link to
        </p>
        <p className="text-blue-600 font-medium mb-4">{email}</p>
        <p className="text-gray-500 text-sm">
          After verification, you'll be able to log in and complete your payment.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => window.location.href = 'mailto:'}
          className="flex items-center justify-center py-3 px-4 border border-blue-100 rounded-xl shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
        >
          <FaEnvelope className="mr-2" />
          Email App
        </button>

        <button
          onClick={() => window.location.href = 'https://gmail.com'}
          className="flex items-center justify-center py-3 px-4 border border-red-100 rounded-xl shadow-sm text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
        >
          <SiGmail className="mr-2 text-lg" />
          Gmail
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={handleResendVerification}
          className="text-blue-500 hover:text-blue-700 text-sm hover:underline transition-colors duration-200"
        >
          Didn't receive the email? Click to resend
        </button>
        {resendStatus && (
          <p className={`mt-3 text-sm font-medium ${
            resendStatus.includes('success') ? 'text-green-500' : 'text-red-500'
          }`}>
            {resendStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPending;