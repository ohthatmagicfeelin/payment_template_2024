// server/src/middleware/auth.js
import { userRepository } from '../db/repositories/userRepository.js';

export const requireAuth = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await userRepository.getUserById(req.session.userId);
    if (!user || !user.emailVerified) {
      return res.status(401).json({ 
        error: 'Email verification required',
        requiresVerification: true 
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};