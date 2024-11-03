import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import * as authService from '../services/authService.js';

export const signup = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { user, message } = await authService.signup(email, password);
    
    // Set session
    req.session.userId = user.id;
    
    res.status(201).json({ 
        user: { id: user.id, email: user.email },
        message
    });
});

export const login = catchAsync(async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const user = await authService.login(email, password);
    
    // Set session
    req.session.userId = user.id;
    if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    }
    
    res.json({ user: { id: user.id, email: user.email } });
});

export const logout = catchAsync(async (req, res) => {
    await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) reject(new AppError('Could not logout', 500));
            resolve();
        });
    });
    
    res.clearCookie('sessionId');
    res.json({ message: 'Logged out' });
});

export const validateSession = catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.session.userId);
    res.json({ user: { id: user.id, email: user.email } });
});

export const requestPasswordReset = catchAsync(async (req, res) => {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.json({ message: 'If an account exists, you will receive a reset email.' });
});

export const resetPassword = catchAsync(async (req, res) => {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ message: 'Password updated successfully' });
});

export const verifyEmail = catchAsync(async (req, res) => {
    const { token } = req.body;
    await authService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
});

export const resendVerification = catchAsync(async (req, res) => {
    const { email } = req.body;
    await authService.resendVerification(email);
    res.json({ message: 'If an account exists, a verification email will be sent.' });
});

export const verifyResetToken = catchAsync(async (req, res) => {
    const { token } = req.body;
    await authService.verifyResetToken(token);
    res.json({ valid: true });
}); 