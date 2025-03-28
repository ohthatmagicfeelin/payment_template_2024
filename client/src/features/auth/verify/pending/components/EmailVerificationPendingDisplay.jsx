import { FaEnvelope } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export function EmailVerificationPendingDisplay({ 
  email,
  resendStatus,
  onResendVerification
}) {
  return (
    <div className="max-w-md mx-auto mt-10 p-8 rounded-2xl
      bg-gray-50 dark:bg-gray-800/50
      shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
      dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl
          bg-gradient-to-br from-teal-50 to-cyan-100
          dark:from-teal-900/30 dark:to-cyan-800/30
          shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
          dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
          flex items-center justify-center">
          <FaEnvelope className="w-10 h-10 text-teal-500 dark:text-teal-300" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-teal-50">Check Your Email</h2>
        <p className="text-gray-600 dark:text-teal-200/70 mb-2">
          We've sent a verification link to
        </p>
        <p className="text-teal-600 dark:text-teal-300 font-medium mb-4">{email}</p>
        <p className="text-gray-500 dark:text-teal-200/50 text-sm">
          After verification, you'll be able to log in and complete your payment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => window.location.href = 'mailto:'}
          className="flex items-center justify-center py-4 px-6 rounded-2xl
            bg-gradient-to-br from-teal-50 to-cyan-100
            dark:from-teal-900/30 dark:to-cyan-800/30
            text-teal-700 dark:text-teal-300 font-medium
            shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
            dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
            transform transition-all duration-200
            hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
            dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.05)]"
        >
          <FaEnvelope className="mr-2" />
          Email App
        </button>

        <button
          onClick={() => window.location.href = 'https://gmail.com'}
          className="flex items-center justify-center py-4 px-6 rounded-2xl
            bg-gradient-to-br from-red-50 to-red-100
            dark:from-red-900/30 dark:to-red-800/30
            text-red-700 dark:text-red-300 font-medium
            shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
            dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
            transform transition-all duration-200
            hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
            dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.05)]"
        >
          <SiGmail className="mr-2 text-lg" />
          Gmail
        </button>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={onResendVerification}
          className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 
            text-sm hover:underline transition-colors duration-200"
        >
          Didn't receive the email? Click to resend
        </button>
        {resendStatus && (
          <p className={`mt-3 text-sm font-medium ${
            resendStatus.includes('success') 
              ? 'text-teal-600 dark:text-teal-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {resendStatus}
          </p>
        )}
      </div>
    </div>
  );
} 