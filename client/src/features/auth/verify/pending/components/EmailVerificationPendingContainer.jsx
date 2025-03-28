import { EmailVerificationPendingDisplay } from './EmailVerificationPendingDisplay';
import { useEmailVerificationPending } from '../hooks/useEmailVerificationPending';

export function EmailVerificationPendingContainer() {
  const { email, resendStatus, handleResendVerification } = useEmailVerificationPending();

  if (!email) return null;

  return (
    <EmailVerificationPendingDisplay
      email={email}
      resendStatus={resendStatus}
      onResendVerification={handleResendVerification}
    />
  );
} 