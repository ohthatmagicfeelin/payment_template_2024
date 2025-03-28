import { useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';

export function LogoutContainer() {
  const { handleLogout } = useLogout();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return null; // No UI needed
} 