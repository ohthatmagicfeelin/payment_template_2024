// server/src/middleware/auth.js
import session from 'express-session';
import config from '../config/env.js';
import { userRepository } from '../db/repositories/userRepository.js';

export const sessionMiddleware = session({
  secret: config.SESSION_SECRET,
  name: 'sessionId', // Change from default 'connect.sid'
  cookie: {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  resave: false,
  saveUninitialized: false
});

export const requireAuth = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await userRepository.getUserById(req.session.userId);
    if (!user || !user.email_verified) {
      req.session.destroy();
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