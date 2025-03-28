import { Link } from 'react-router-dom';

export function ResetPasswordDisplay({
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  error,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-8 space-y-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-teal-50 text-center mb-8">
        Reset Password
      </h2>
      
      {error && (
        <div className="p-6 rounded-2xl text-sm
          bg-gradient-to-br from-red-50 to-red-100
          dark:from-red-900/30 dark:to-red-800/30
          text-red-700 dark:text-red-200
          shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]
          dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-teal-200">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            className="w-full px-6 py-4 rounded-2xl
              bg-gray-50 dark:bg-gray-800/50
              text-gray-900 dark:text-teal-50
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),_inset_-2px_-2px_4px_rgba(255,255,255,0.9)]
              dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),_inset_-2px_-2px_4px_rgba(255,255,255,0.05)]
              border-none outline-none
              transition-all duration-200
              focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),_inset_-3px_-3px_6px_rgba(255,255,255,0.95)]
              dark:focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),_inset_-3px_-3px_6px_rgba(255,255,255,0.05)]
              dark:focus:bg-gray-800/80
              placeholder-gray-400 dark:placeholder-teal-200/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-teal-200">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            required
            className="w-full px-6 py-4 rounded-2xl
              bg-gray-50 dark:bg-gray-800/50
              text-gray-900 dark:text-teal-50
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),_inset_-2px_-2px_4px_rgba(255,255,255,0.9)]
              dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),_inset_-2px_-2px_4px_rgba(255,255,255,0.05)]
              border-none outline-none
              transition-all duration-200
              focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),_inset_-3px_-3px_6px_rgba(255,255,255,0.95)]
              dark:focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),_inset_-3px_-3px_6px_rgba(255,255,255,0.05)]
              dark:focus:bg-gray-800/80
              placeholder-gray-400 dark:placeholder-teal-200/30"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 rounded-2xl
          bg-gradient-to-br from-teal-500 to-cyan-600
          dark:from-teal-400 dark:to-cyan-600
          text-white font-medium text-lg
          shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
          dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.05)]
          transform transition-all duration-200
          hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
          dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.05)]
          hover:from-teal-600 hover:to-cyan-700
          dark:hover:from-teal-500 dark:hover:to-cyan-700
          active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]
          dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]"
      >
        Reset Password
      </button>

      <div className="text-sm text-center">
        <Link 
          to="/login" 
          className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
} 