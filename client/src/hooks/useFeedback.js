import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { feedbackApi } from '@/api/feedback';

export function useFeedback() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await feedbackApi.create({
        rating,
        message,
        email: user ? user.user.email : email,
        ...((!user && name) && { name })
      }, user?.token);
      
      setStatus({ type: 'success', message: 'Thank you for your feedback!' });
      setTimeout(() => {
        resetForm();
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setMessage('');
    setEmail('');
    setName('');
    setStatus({ type: '', message: '' });
  };

  return {
    isOpen,
    setIsOpen,
    rating,
    setRating,
    message,
    setMessage,
    email,
    setEmail,
    name,
    setName,
    isSubmitting,
    status,
    handleSubmit,
    user
  };
} 