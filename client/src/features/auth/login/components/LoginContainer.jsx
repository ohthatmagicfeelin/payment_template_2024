import { useLogin } from '../hooks/useLogin';
import { LoginDisplay } from './LoginDisplay';

export function LoginContainer() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    message,
    messageType,
    handleSubmit
  } = useLogin();

  return (
    <LoginDisplay
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      rememberMe={rememberMe}
      onRememberMeChange={setRememberMe}
      error={error}
      message={message}
      messageType={messageType}
      onSubmit={handleSubmit}
    />
  );
}
