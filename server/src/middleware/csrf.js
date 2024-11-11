import csrf from 'csurf';

export const csrfProtection = csrf({
    cookie: false,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    value: (req) => req.headers['x-csrf-token']
});

export const handleCsrfError = (err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({
            error: 'Invalid CSRF token',
            code: 'INVALID_CSRF'
        });
    }
    
    if (err.message === 'misconfigured csrf') {
        return res.status(500).json({
            error: 'CSRF configuration error',
            code: 'CSRF_CONFIG_ERROR'
        });
    }
    
    next(err);
}; 