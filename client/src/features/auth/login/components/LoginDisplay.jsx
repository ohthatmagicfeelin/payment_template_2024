import { Link } from 'react-router-dom';

export function LoginDisplay({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  rememberMe,
  onRememberMeChange,
  error,
  message,
  messageType,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-8 space-y-8 px-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
        Log In
      </h2>
      
      {message && (
        <div className="p-6 rounded-2xl text-sm
          bg-gradient-to-br from-green-50 to-green-100
          dark:from-green-900/50 dark:to-green-800/50
          text-green-700 dark:text-green-200
          shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]
          dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]">
          {message}
        </div>
      )}
      
      {error && (
        <div className="p-6 rounded-2xl text-sm
          bg-gradient-to-br from-red-50 to-red-100
          dark:from-red-900/50 dark:to-red-800/50
          text-red-700 dark:text-red-200
          shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]
          dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className="w-full px-6 py-4 rounded-2xl
              bg-gray-50 dark:bg-gray-800
              text-gray-900 dark:text-white
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),_inset_-2px_-2px_4px_rgba(255,255,255,0.9)]
              dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),_inset_-2px_-2px_4px_rgba(255,255,255,0.1)]
              border-none outline-none
              transition-shadow duration-200
              focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),_inset_-3px_-3px_6px_rgba(255,255,255,0.95)]
              dark:focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),_inset_-3px_-3px_6px_rgba(255,255,255,0.1)]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            className="w-full px-6 py-4 rounded-2xl
              bg-gray-50 dark:bg-gray-800
              text-gray-900 dark:text-white
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),_inset_-2px_-2px_4px_rgba(255,255,255,0.9)]
              dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),_inset_-2px_-2px_4px_rgba(255,255,255,0.1)]
              border-none outline-none
              transition-shadow duration-200
              focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),_inset_-3px_-3px_6px_rgba(255,255,255,0.95)]
              dark:focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),_inset_-3px_-3px_6px_rgba(255,255,255,0.1)]"
          />
        </div>

        <div className="flex items-center">
          <div className="relative">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-6 h-6 rounded-lg
              bg-gray-50 dark:bg-gray-800
              shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
              dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.1)]
              peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600
              transition-all duration-200
              cursor-pointer">
              {rememberMe && (
                <svg className="w-4 h-4 mx-auto mt-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Remember me
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 rounded-2xl
          bg-gradient-to-br from-blue-500 to-blue-600
          dark:from-blue-600 dark:to-blue-700
          text-white font-medium text-lg
          shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
          dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.1)]
          transform transition-all duration-200
          hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
          dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.1)]
          active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]
          dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]"
      >
        Log in
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or</span>
        </div>
      </div>

      <Link 
        to="/signup" 
        className="w-full block py-4 px-6 rounded-2xl
          bg-gray-50 dark:bg-gray-800
          text-gray-700 dark:text-gray-300 font-medium text-lg text-center
          shadow-[4px_4px_8px_rgba(0,0,0,0.1),_-4px_-4px_8px_rgba(255,255,255,0.9)]
          dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),_-4px_-4px_8px_rgba(255,255,255,0.1)]
          transform transition-all duration-200
          hover:shadow-[2px_2px_4px_rgba(0,0,0,0.1),_-2px_-2px_4px_rgba(255,255,255,0.9)]
          dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),_-2px_-2px_4px_rgba(255,255,255,0.1)]"
      >
        Sign up
      </Link>
      
      <div className="text-sm text-center">
        <Link 
          to="/forgot-password" 
          className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
