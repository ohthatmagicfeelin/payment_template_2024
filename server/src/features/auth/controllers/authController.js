import { catchAsync } from '../../../utils/catchAsync.js';
import { AppError } from '../../../utils/AppError.js';
import * as authService from '../services/index.js';
import * as userService from '../../user/services/userServices.js';
import { sessionService } from '../../../common/services/sessionService.js';





export const logout = catchAsync(async (req, res) => {
    const sessionId = req.session.id;
    const userId = req.session.userId;

    console.log('Logout attempt:', { 
        sessionId, 
        userId,
        session: req.session 
    });

    try {
        // Delete from database first
        await sessionService.deleteSession(sessionId);
        console.log('Session deleted from database');

        // Then destroy the session
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                    reject(new AppError('Could not logout', 500));
                }
                console.log('Session destroyed in memory');
                resolve();
            });
        });

        console.log('Logout successful:', { sessionId, userId });
        
        res.clearCookie('sessionId');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        throw new AppError('Logout failed', 500);
    }
});

export const validateSession = catchAsync(async (req, res) => {
    if (!req.session?.userId) {
        return res.status(401).json({ 
            error: 'No active session',
            code: 'NO_SESSION'
        });
    }

    const user = await userService.getUserById(req.session.userId);
    
    if (!user) {
        // Clear invalid session
        req.session.destroy();
        return res.status(401).json({ 
            error: 'Invalid session',
            code: 'INVALID_SESSION'
        });
    }

    // Extend session if valid
    req.session.touch();
    
    res.json({ 
        user: { 
            id: user.id, 
            email: user.email 
        } 
    });
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



export const verifyResetToken = catchAsync(async (req, res) => {
    const { token } = req.body;
    await authService.verifyResetToken(token);
    res.json({ valid: true });
}); 
