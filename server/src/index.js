// server/src/index.js
import express from "express";
import cors from "cors";
import config from './config/env.js';
import routes from './routes/routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// middleware
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());


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
});