// src/config/env.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

export default {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    APP_ROUTE: process.env.APP_ROUTE,

    // Postgres
    PG_USER: process.env.PG_USER,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_HOST: process.env.PG_HOST,
    PG_PORT: process.env.PG_PORT,
    PG_DATABASE: process.env.PG_DATABASE,

    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,

    // Session
    SESSION_SECRET: process.env.SESSION_SECRET,

    // JWT
    JWT_SECRET: process.env.JWT_SECRET,
};