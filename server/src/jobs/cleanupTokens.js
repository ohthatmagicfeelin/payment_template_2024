import { passwordRepository } from '../features/auth/password/repositories/passwordRepository.js'
import { emailVerificationRepository } from '../features/auth/verify/repositories/emailVerificationRepository.js'

export const cleanupExpiredTokens = async () => {
  try {
    await Promise.all([
      passwordRepository.deleteExpiredTokens(),
      emailVerificationRepository.deleteExpiredTokens()
    ]);
  } catch (error) {
    console.error('Failed to cleanup expired tokens:', error);
  }
};

// Run cleanup daily
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000); 