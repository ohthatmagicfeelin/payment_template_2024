export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push(`Must be at least ${minLength} characters`);
  if (!hasUpper) errors.push('Must contain uppercase letter');
  if (!hasLower) errors.push('Must contain lowercase letter');
  if (!hasNumber) errors.push('Must contain number');
  if (!hasSpecial) errors.push('Must contain special character');

  return {
    isValid: errors.length === 0,
    errors
  };
}; 