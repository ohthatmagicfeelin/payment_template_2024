import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handlePasswordReset = () => {
    navigate('/forgot-password');
  };

  if (!user) return null;

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a href="/dashboard" className="text-xl font-bold">
            App Name
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">{user.email}</span>
          <button
            onClick={handlePasswordReset}
            className="text-gray-300 hover:text-white"
          >
            Reset Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
} 