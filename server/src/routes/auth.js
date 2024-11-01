// server/src/routes/auth.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { emailService } from '../utils/emailService.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { createUser, verifyCredentials, getUserByEmail, updateUserPassword, markEmailAsVerified, getUserById } from '../db/userRepository.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await createUser({ email, password });
    console.log('User created:', user);
    // Send verification email
    await emailService.sendVerificationEmail(email, user.id);

    // Automatically log in the new user
    req.session.userId = user.id;

    res.status(201).json({ 
      user: { id: user.id, email: user.email },
      message: 'Please check your email to verify your account'
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Could not create account' });
  }
});

router.post('/login', async (req, res) => {
    const { email, password, rememberMe } = req.body;
    try {
        // Verify credentials
        const user = await verifyCredentials(email, password);

        // Set session
        req.session.userId = user.id;
        if (rememberMe) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }
        console.log('Session set:', req.session);
        res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not logout' });
    }
    res.clearCookie('sessionId');
    res.json({ message: 'Logged out' });
  });
});

router.get('/validate', requireAuth, async (req, res) => {
  const user = await getUserById(req.session.userId);
  res.json({ user: { id: user.id, email: user.email } });
});


router.post('/password-reset-request', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await getUserByEmail(email);
    if (user) {
      await emailService.sendPasswordResetEmail(email, user.id);
    }
    // Always return success to prevent email enumeration
    res.json({ message: 'If an account exists, you will receive a reset email.' });
  } catch (error) {
    res.status(500).json({ error: 'Could not process request' });
  }
});

router.post('/password-reset', async (req, res) => {
  const { token, newPassword } = req.body;
  console.log('Password reset request received:', req.body);
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token type');
    }

    await updateUserPassword(decoded.userId, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

router.post('/verify-email', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (decoded.type !== 'email-verification') {
      throw new Error('Invalid token type');
    }

    await markEmailAsVerified(decoded.userId);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

export default router;