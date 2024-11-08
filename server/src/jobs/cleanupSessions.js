import { cleanupExpiredSessions } from '../services/sessionService.js';

export const startSessionCleanup = () => {
    const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes

    setInterval(async () => {
        try {
            await cleanupExpiredSessions();
        } catch (error) {
            console.error('Scheduled session cleanup failed:', error);
        }
    }, CLEANUP_INTERVAL);
}; 