import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resendVerificationEmail } from '@/features/auth/services/authService';

export function useEmailVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [resendStatus, setResendStatus] = useState('');

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail(email);
      setResendStatus('Verification email sent successfully!');
    } catch (err) {
      setResendStatus('Failed to resend verification email. Please try again.');
    }
  };

  if (!email) {
    navigate('/signup', { replace: true });
    return null;
  }

  return {
    email,
    resendStatus,
    handleResendVerification
  };
}
