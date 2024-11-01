// src/components/auth/EmailVerificationPending.jsx
import { useLocation } from 'react-router-dom';

const EmailVerificationPending = () => {
  const location = useLocation();
  const email = location.state?.email;

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
    </div>
  );
};

export default EmailVerificationPending;