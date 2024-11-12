// server/src/index.js
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import routes from './routes/routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInputs } from './middleware/sanitizeInput.js';
import { sessionMiddleware } from './config/session.js';
import { startJobs } from './jobs/index.js';
import { handleCsrfError } from './middleware/csrf.js';
import { debugMiddleware } from './middleware/debug.js';

const app = express();


// middleware
app.set('trust proxy', 1); // Trust proxy - important for secure cookies behind a proxy
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.SESSION_SECRET)); // Add this before session


// Security Middleware
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Cookie'],
    exposedHeaders: ['X-CSRF-Token', 'Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(sanitizeInputs); // Apply global sanitization middleware


// Session handling
app.use(sessionMiddleware);
// app.use(debugMiddleware); 


// request logging
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});


app.use('/', routes);


// Error handling middleware (should be last)
app.use(handleCsrfError);
app.use(errorHandler);

app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${config.PORT}`);
    startJobs();
});