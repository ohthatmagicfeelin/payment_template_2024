// client/src/components/auth/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation, Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';

export function VerifyEmail() {
  const [status, setStatus] = useState('verifying');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const location = useLocation();
  const email = location.state?.email;

  // // Redirect to home if no email is provided
  // if (!email) {
  //   return <Navigate to="/" replace />;
  // }


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

  if (status === 'success') {
    return <Navigate to="/login" replace state={{ 
      message: 'Email verified successfully! You can now log in.',
      type: 'success'
    }} />;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
          <svg
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          We've sent a verification link to
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{email}</p>
        
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Please check your email and click the verification link to activate your account.
        </p>

        <div className="mt-6 space-y-4">
          <button
            onClick={() => window.location.href = 'mailto:'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Open email app
          </button>
          
          <a
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to login
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={() => {/* Add resend verification email logic */}}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            click here to resend
          </button>
        </p>
      </div>
    </div>
  );
}