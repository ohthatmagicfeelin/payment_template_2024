import { passwordResetRepository } from '../db/repositories/passwordResetRepository.js'
import { emailVerificationRepository } from '../db/repositories/emailVerificationRepository.js'

export const cleanupExpiredTokens = async () => {
  try {
    await Promise.all([
      passwordResetRepository.deleteExpiredTokens(),
      emailVerificationRepository.deleteExpiredTokens()
    ]);
  } catch (error) {
    console.error('Failed to cleanup expired tokens:', error);
  }
};

// Run cleanup daily
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000); 