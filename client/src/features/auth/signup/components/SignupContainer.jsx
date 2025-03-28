import { useSignup } from '../hooks/useSignup';
import { SignupDisplay } from './SignupDisplay';

export function SignupContainer() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    error,
    isSubmitting,
    handleSubmit
  } = useSignup();

  return (
    <SignupDisplay
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      confirmPassword={confirmPassword}
      onConfirmPasswordChange={setConfirmPassword}
      name={name}
      onNameChange={setName}
      error={error}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
} 