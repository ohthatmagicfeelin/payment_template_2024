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
      const response = await signup(email, password);
      console.log('Signup response:', response);
      
      navigate('/verification-pending', { 
        replace: true,
        state: { email } 
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full p-2 border rounded"
            required
          />
          {passwordErrors.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-700"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;