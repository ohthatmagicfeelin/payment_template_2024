import { catchAsync } from '../../../../utils/catchAsync.js';
import { AppError } from '../../../../utils/AppError.js';
import { loginService } from '../services/loginService.js';

export const loginController = {
  login: catchAsync(async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const user = await loginService.login(email, password);
    
    // Set session data
    req.session.userId = user.id;
    req.session.email = user.email;
    
    if (rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    }

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          reject(new AppError('Failed to create session', 500));
        }
        resolve();
      });
    });

    res.json({ 
      user: { 
        id: user.id, 
        email: user.email 
      }
    });
  })
}; 