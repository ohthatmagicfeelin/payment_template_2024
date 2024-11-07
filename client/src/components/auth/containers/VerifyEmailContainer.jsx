import { useVerifyEmail } from '@/hooks/useVerifyEmail';
import { VerifyEmailDisplay } from '../verification/VerifyEmailDisplay';

export function VerifyEmailContainer() {
  const { status, handleBackToLogin } = useVerifyEmail();

  return (
    <VerifyEmailDisplay 
      status={status}
      onBackToLogin={handleBackToLogin}
    />
  );
} 