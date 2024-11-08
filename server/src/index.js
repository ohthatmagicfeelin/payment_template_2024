// server/src/index.js
import express from "express";
import cors from "cors";
import config from './config/env.js';
import routes from './routes/routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInputs } from './middleware/sanitizeInput.js';
import { sessionMiddleware } from './config/session.js';
import { startJobs } from './jobs/index.js';

const app = express();


// middleware
app.use(express.json());
app.use(sanitizeInputs); // Apply global sanitization middleware


app.use(sessionMiddleware);


app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));



// Routes
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

app.use('/', routes);


// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${config.PORT}`);
    startJobs();
});