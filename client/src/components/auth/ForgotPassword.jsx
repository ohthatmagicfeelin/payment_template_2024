// client/src/components/auth/ForgotPassword.jsx
import { useState } from 'react';
import { authService } from '@/services/authService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h2>
        <p className="text-gray-600">
          If an account exists with <span className="font-medium">{email}</span>, you will receive a password reset link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-6 px-4">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Reset Password</h2>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Send Reset Link
      </button>

      <div className="text-sm text-center">
        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Back to login
        </a>
      </div>
    </form>
  );
}