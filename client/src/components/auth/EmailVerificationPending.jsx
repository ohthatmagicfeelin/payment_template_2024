// src/components/auth/EmailVerificationPending.jsx
import { useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '@/services/authService';

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Check Your Email</h2>
      <p className="text-gray-600">
        We've sent a verification link to {email}. 
        Please check your email and click the link to verify your account.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        After verification, you'll be able to log in and complete your payment.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          onClick={() => window.location.href = 'mailto:'}
          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Open Email App
        </button>

        <button
          onClick={() => window.location.href = 'https://gmail.com'}
          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Open Gmail
        </button>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleResendVerification}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          Didn't receive the email? Click to resend
        </button>
        {resendStatus && (
          <p className={`mt-2 text-sm ${
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