import { useEmailVerification } from '@/hooks/useEmailVerification';
import { EmailVerificationPendingDisplay } from './EmailVerificationPendingDisplay';

export function EmailVerificationPendingContainer() {
  const { email, resendStatus, handleResendVerification } = useEmailVerification();

  if (!email) return null;

  return (
    <EmailVerificationPendingDisplay
      email={email}
      resendStatus={resendStatus}
      onResendVerification={handleResendVerification}
    />
  );
} 