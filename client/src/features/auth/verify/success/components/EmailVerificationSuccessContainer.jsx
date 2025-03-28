import { EmailVerificationSuccessDisplay } from './EmailVerificationSuccessDisplay';
import { useEmailVerificationSuccess } from '../hooks/useEmailVerificationSuccess';

export function EmailVerificationSuccessContainer() {
  const { status, handleBackToLogin } = useEmailVerificationSuccess();

  return (
    <EmailVerificationSuccessDisplay 
      status={status}
      onBackToLogin={handleBackToLogin}
    />
  );
} 