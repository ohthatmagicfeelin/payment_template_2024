import { catchAsync } from '../../../../utils/catchAsync.js';
import { AppError } from '../../../../utils/AppError.js';
import { sessionService } from '../services/sessionService.js';
import { auditService } from '../../../../common/services/auditService.js';

export const sessionController = {
    validateSession: catchAsync(async (req, res) => {
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
    }),

    getActiveSessions: catchAsync(async (req, res) => {
        const sessions = await sessionService.getUserActiveSessions(req.session.userId);
        
        // Map sessions to safe response format
        const safeSessions = sessions.map(session => ({
            id: session.id,
            createdAt: session.createdAt,
            expiresAt: session.expiresAt,
            isCurrentSession: session.id === req.session.id
        }));

        res.json({ sessions: safeSessions });
    }),

    invalidateAllSessions: catchAsync(async (req, res) => {
        // Optionally keep current session active
        const keepCurrentSession = req.body.keepCurrentSession === true;
        const currentSessionId = keepCurrentSession ? req.session.id : null;

        await sessionService.invalidateUserSessions(
            req.session.userId, 
            currentSessionId
        );

        await auditService.log({
            userId: req.session.userId,
            action: 'SESSIONS_INVALIDATED',
            entity: 'session',
            entityId: 'all',
            details: {
                keepCurrentSession,
                timestamp: new Date().toISOString()
            }
        });

        res.json({ 
            message: 'All sessions invalidated successfully',
            keepCurrentSession
        });
    }),

    invalidateSession: catchAsync(async (req, res) => {
        const { sessionId } = req.params;

        // Prevent invalidating current session through this endpoint
        if (sessionId === req.session.id) {
            throw new AppError('Cannot invalidate current session. Use logout instead.', 400);
        }

        // Verify session belongs to user
        const session = await sessionService.getSessionById(sessionId);
        if (!session || session.userId !== req.session.userId) {
            throw new AppError('Session not found or unauthorized', 404);
        }

        await sessionService.deleteSession(sessionId);

        await auditService.log({
            userId: req.session.userId,
            action: 'SESSION_INVALIDATED',
            entity: 'session',
            entityId: sessionId,
            details: {
                timestamp: new Date().toISOString()
            }
        });

        res.json({ message: 'Session invalidated successfully' });
    })
}; 