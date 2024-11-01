// client/src/components/auth/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';

export function VerifyEmail() {
  const [status, setStatus] = useState('verifying');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Email verified successfully. Please log in.' }
          });
        }, 3000);
      } catch (err) {
        setStatus('error');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
    }
  }, [token, navigate]);

  return (
    <div className="text-center">
      {status === 'verifying' && (
        <p>Verifying your email...</p>
      )}
      {status === 'success' && (
        <p className="text-green-500">
          Email verified successfully! Redirecting to login...
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-500">
          Could not verify email. The link may be invalid or expired.
        </p>
      )}
    </div>
  );
}