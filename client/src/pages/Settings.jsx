import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { CustomSettingsManager } from '@/components/settings/CustomSettingsManager';
import { PasswordChangeSettings } from '@/components/settings/PasswordChangeSettings';

import { Navigate } from 'react-router-dom';

export function Settings() {
  const { settings, loading, error } = useSettings();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <ThemeSettings />
          <NotificationSettings />
          <PasswordChangeSettings />
        </div>
        {/* <div>
          <CustomSettingsManager />
        </div> */}
      </div>
    </div>
  );
} 