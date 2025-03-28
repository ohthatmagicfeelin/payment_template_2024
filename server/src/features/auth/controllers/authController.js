import { catchAsync } from '../../../utils/catchAsync.js';
import { AppError } from '../../../utils/AppError.js';
import * as userService from '../../user/services/userServices.js';
import { sessionService } from '../../../common/services/sessionService.js';





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

