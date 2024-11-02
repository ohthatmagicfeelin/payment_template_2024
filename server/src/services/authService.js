import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { userRepository } from '../db/repositories/userRepository.js';
import { emailService } from '../utils/emailService.js';
import { auditService } from './auditService.js';
import bcrypt from 'bcrypt';

export const signup = async (email, password) => {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
        await auditService.log({
            action: 'SIGNUP_FAILED',
            entity: 'user',
            entityId: email,
            details: { reason: 'Email already exists' }
        });
        throw new AppError('Email already registered', 400);
    }

    const user = await userRepository.createUser({ email, password });
    await emailService.sendVerificationEmail(email, user.id);

    await auditService.log({
        userId: user.id,
        action: 'SIGNUP',
        entity: 'user',
        entityId: user.id.toString(),
        details: { email }
    });

    return {
        user,
        message: 'Please check your email to verify your account'
    };
};

export const login = async (email, password) => {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        await auditService.log({
            action: 'LOGIN_FAILED',
            entity: 'user',
            entityId: email,
            details: { reason: 'User not found' }
        });
        throw new AppError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        await auditService.log({
            userId: user.id,
            action: 'LOGIN_FAILED',
            entity: 'user',
            entityId: user.id.toString(),
            details: { reason: 'Invalid password' }
        });
        throw new AppError('Invalid credentials', 401);
    }

    await auditService.log({
        userId: user.id,
        action: 'LOGIN',
        entity: 'user',
        entityId: user.id.toString(),
        details: { email }
    });

    return user;
};

export const getUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
};

export const requestPasswordReset = async (email) => {
    const user = await userRepository.getUserByEmail(email);
    if (user) {
        await emailService.sendPasswordResetEmail(email, user.id);
        await auditService.log({
            userId: user.id,
            action: 'PASSWORD_RESET_REQUESTED',
            entity: 'user',
            entityId: user.id.toString(),
            details: { email }
        });
    } else {
        await auditService.log({
            action: 'PASSWORD_RESET_FAILED',
            entity: 'user',
            entityId: email,
            details: { reason: 'User not found' }
        });
    }
    // Always return success to prevent email enumeration
    return { message: 'If an account exists, you will receive a reset email.' };
};

export const resetPassword = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userRepository.getUserById(decoded.userId);
        
        if (!user) {
            await auditService.log({
                action: 'PASSWORD_RESET_FAILED',
                entity: 'user',
                entityId: decoded.userId.toString(),
                details: { reason: 'User not found' }
            });
            throw new AppError('Invalid reset token', 400);
        }

        await userRepository.updateUserPassword(user.id, newPassword);
        
        await auditService.log({
            userId: user.id,
            action: 'PASSWORD_RESET_COMPLETED',
            entity: 'user',
            entityId: user.id.toString(),
            details: { email: user.email }
        });

    } catch (error) {
        await auditService.log({
            action: 'PASSWORD_RESET_FAILED',
            entity: 'user',
            entityId: token,
            details: { error: error.message }
        });
        throw new AppError('Invalid or expired reset token', 400);
    }
};

export const verifyEmail = async (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userRepository.getUserById(decoded.userId);
        
        if (!user) {
            await auditService.log({
                action: 'EMAIL_VERIFICATION_FAILED',
                entity: 'user',
                entityId: decoded.userId.toString(),
                details: { reason: 'User not found' }
            });
            throw new AppError('Invalid verification token', 400);
        }

        await userRepository.markEmailAsVerified(user.id);
        
        await auditService.log({
            userId: user.id,
            action: 'EMAIL_VERIFIED',
            entity: 'user',
            entityId: user.id.toString(),
            details: { email: user.email }
        });

    } catch (error) {
        await auditService.log({
            action: 'EMAIL_VERIFICATION_FAILED',
            entity: 'user',
            entityId: token,
            details: { error: error.message }
        });
        throw new AppError('Invalid or expired verification token', 400);
    }
};

export const resendVerification = async (email) => {
    const user = await userRepository.getUserByEmail(email);
    if (user && !user.email_verified) {
        await emailService.sendVerificationEmail(email, user.id);
    }
};

export const logout = async (userId) => {
    if (userId) {
        await auditService.log({
            userId,
            action: 'LOGOUT',
            entity: 'user',
            entityId: userId.toString(),
            details: { timestamp: new Date().toISOString() }
        });
    }
}; 