export function EmailVerificationSuccessDisplay({ status, onBackToLogin }) {
  return (
    <div className="max-w-md mx-auto mt-8 p-8 rounded-2xl
      bg-gray-50 dark:bg-gray-800/50
      shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
      dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]">
      <div className="text-center">
        {status === 'verifying' && (
          <>
            <div className="mx-auto w-12 h-12 rounded-2xl
              bg-gradient-to-br from-teal-50 to-cyan-100
              dark:from-teal-900/30 dark:to-cyan-800/30
              shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
              dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
              flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 dark:border-teal-400"></div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-teal-50">
              Verifying your email...
            </h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto w-12 h-12 rounded-2xl
              bg-gradient-to-br from-green-50 to-teal-100
              dark:from-green-900/30 dark:to-teal-800/30
              shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
              dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
              flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-teal-50">
              Email verified successfully!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-teal-200/70">
              Redirecting you to login...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto w-12 h-12 rounded-2xl
              bg-gradient-to-br from-red-50 to-red-100
              dark:from-red-900/30 dark:to-red-800/30
              shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
              dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
              flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-teal-50">
              Verification failed
            </h2>
            <p className="mt-2 text-gray-600 dark:text-teal-200/70">
              The verification link is invalid or has expired.
            </p>
            <button
              onClick={onBackToLogin}
              className="mt-6 py-4 px-6 rounded-2xl
                bg-gradient-to-br from-teal-500 to-cyan-600
                dark:from-teal-400 dark:to-cyan-600
                text-white font-medium
                shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
                dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
                transform transition-all duration-200
                hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
                dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.05)]
                hover:from-teal-600 hover:to-cyan-700
                dark:hover:from-teal-500 dark:hover:to-cyan-700"
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
} 