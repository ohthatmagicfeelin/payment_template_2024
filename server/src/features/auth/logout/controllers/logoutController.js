import { catchAsync } from '../../../../utils/catchAsync.js';
import { AppError } from '../../../../utils/AppError.js';
import { sessionService } from '../../../../common/services/sessionService.js';


export const logoutController = {
    logout: catchAsync(async (req, res) => {
        const sessionId = req.session.id;
        const userId = req.session.userId;

        try {
            // Delete from database first
            await sessionService.deleteSession(sessionId);

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
    })
};