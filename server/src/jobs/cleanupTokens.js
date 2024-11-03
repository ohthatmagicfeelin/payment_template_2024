import { passwordResetRepository } from '../db/repositories/passwordResetRepository.js'

export const cleanupExpiredTokens = async () => {
  try {
    await passwordResetRepository.deleteExpiredTokens();
  } catch (error) {
    console.error('Failed to cleanup expired tokens:', error);
  }
};

// Run cleanup daily
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000); 