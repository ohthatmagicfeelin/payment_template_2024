import { useState } from 'react';
import { forgotPasswordApi } from '../api/forgotPasswordApi';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPasswordApi(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    email,
    setEmail,
    submitted,
    error,
    handleSubmit
  };
} 