import { ResetPasswordDisplay } from './ResetPasswordDisplay';
import { useResetPassword } from '../hooks/useResetPassword';

export function ResetPasswordContainer() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleSubmit
  } = useResetPassword();

  return (
    <ResetPasswordDisplay
      password={password}
      onPasswordChange={setPassword}
      confirmPassword={confirmPassword}
      onConfirmPasswordChange={setConfirmPassword}
      error={error}
      onSubmit={handleSubmit}
    />
  );
} 