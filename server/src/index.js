// server/src/index.js
import express from "express";
import cors from "cors";
import config from './config/env.js';
//  Routes
import apiRoutes from './routes/apiRoutes.js';
import deployRoutes from './routes/deployRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// middleware
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

// Determine whether to use base path based on environment
const isProduction = config.NODE_ENV === 'production';
const basePath = isProduction ? config.APP_ROUTE : '';

// Routes
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

app.use(`${basePath}/api`, apiRoutes);
app.use('/api', paymentRoutes)
app.use(`/api/health`, deployRoutes);


app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${config.PORT}`);
});