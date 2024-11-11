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

const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.SESSION_SECRET)); // Add this before session
app.use(sanitizeInputs); // Apply global sanitization middleware


app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));


app.use(sessionMiddleware);


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