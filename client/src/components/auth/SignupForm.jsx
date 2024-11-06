// src/components/auth/SignupForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '@/api/auth';
import { authService } from '@/services/authService';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const { errors } = authService.validatePassword(newPassword);
    setPasswordErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { isValid, errors } = authService.validatePassword(password);
    if (!isValid) {
      setError('Please fix password requirements');
      setPasswordErrors(errors);
      return;
    }
    
    try {
      await signup(email, password);
      navigate('/verification-pending', { 
        replace: true,
        state: { email } 
      });
    } catch (err) {
      console.log(err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already registered')) {
        setError('This email is already registered. Please try logging in instead.');
      } else {
        setError(err.response?.data?.error || 'An error occurred during signup');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sign Up</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
          {error}
          {error.includes('already registered') && (
            <div className="mt-2">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                Go to login
              </button>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {passwordErrors.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {passwordErrors.map((error, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">
                    {password.length > 0 ? '❌' : '•'}
                  </span>
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Sign Up
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;