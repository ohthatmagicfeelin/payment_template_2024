import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { userRepository } from '../db/repositories/userRepository.js';
import { emailService } from '../utils/emailService.js';
import bcrypt from 'bcrypt';

export const signup = async (email, password) => {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
        throw new AppError('Email already registered', 400);
    }

    const user = await userRepository.createUser({ email, password });
    await emailService.sendVerificationEmail(email, user.id);

    return {
        user,
        message: 'Please check your email to verify your account'
    };
};

export const login = async (email, password) => {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new AppError('Invalid credentials', 401);
    }

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
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (decoded.type !== 'password-reset') {
            throw new AppError('Invalid token type', 400);
        }
        await userRepository.updateUserPassword(decoded.userId, newPassword);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid or expired token', 400);
        }
        throw error;
    }
};

export const verifyEmail = async (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (decoded.type !== 'email-verification') {
            throw new AppError('Invalid token type', 400);
        }
        await userRepository.markEmailAsVerified(decoded.userId);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid or expired token', 400);
        }
        throw error;
    }
};

export const resendVerification = async (email) => {
    const user = await userRepository.getUserByEmail(email);
    if (user && !user.email_verified) {
        await emailService.sendVerificationEmail(email, user.id);
    }
}; 