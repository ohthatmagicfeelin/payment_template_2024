import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import prisma from '../db/client.js';
import config from './env.js';

// Initialize store
const store = new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    ttl: 24 * 60 * 60 * 1000,
    sessionModelName: "Session",
    enableConcurrentSetInvocations: true,
    expiresField: 'expiresAt'
});

// Verify store is ready
await store.connect?.();

export const sessionConfig = {
    store,
    secret: config.SESSION_SECRET,
    name: 'sessionId',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    },
    proxy: config.NODE_ENV === 'production'
};

// Export session middleware
export const sessionMiddleware = session(sessionConfig);