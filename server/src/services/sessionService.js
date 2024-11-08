import { sessionRepository } from '../db/repositories/sessionRepository.js';
import { AppError } from '../utils/AppError.js';

const cleanupExpiredSessions = async () => {
    try {
        const count = await sessionRepository.deleteExpiredSessions();
        console.log('Cleaned up expired sessions:', {
            deletedCount: count,
            timestamp: new Date().toISOString()
        });
        return count;
    } catch (error) {
        console.error('Session cleanup error:', error);
        throw new AppError('Session cleanup failed', 500);
    }
};

const deleteSession = async (sessionId) => {
    try {
        await sessionRepository.deleteSession(sessionId);
    } catch (error) {
        console.error('Session deletion error:', error);
        throw new AppError('Session deletion failed', 500);
    }
};

export { cleanupExpiredSessions, deleteSession }; 