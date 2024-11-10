import csrf from 'csurf';
import { AppError } from '../utils/AppError.js';
import config from '../config/env.js';

// Initialize CSRF protection
export const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax'
    }
});

// Error handler for CSRF errors
export const handleCsrfError = (err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        console.error('CSRF Error:', {
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
        
        return res.status(403).json({
            error: 'Invalid CSRF token',
            code: 'INVALID_CSRF'
        });
    }
    next(err);
};

// Middleware to attach CSRF token to response
export const attachCsrfToken = (req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
        httpOnly: false, // Must be false so client JS can read it
        secure: config.NODE_ENV === 'production',
        sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax'
    });
    next();
}; 