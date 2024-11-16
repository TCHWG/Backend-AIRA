// services/authService.js
const { auth } = require('../config/firebaseConfig');
const prisma = require('@prisma/client');
const axios = require('axios');
const ApiError = require('../errors/apiError');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const prismaClient = new prisma.PrismaClient();

function generateResetToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    const bytes = crypto.randomBytes(4);

    for (let i = 0; i < bytes.length; i++) {
        const randomIndex = bytes[i] % characters.length;
        token += characters[randomIndex];
    }

    return token;
}

class AuthService {
    async registerUser(email, password, name, photoUrl) {
        try {
            // Check if email already exists in database
            const existingUser = await prismaClient.user.findFirst({
                where: { email: email }
            });

            if (existingUser) {
                throw new ApiError(400, 'email-already-exists', 'An account with this email already exists.');
            }

            // Validate password requirements
            if (password.length < 6) {
                throw new ApiError(400, 'weak-password', 'Password should be at least 6 characters long.');
            }

            // Create user in Firebase Authentication
            try {
                const userRecord = await auth.createUser({
                    email: email,
                    password: password,
                    displayName: name,
                    photoURL: photoUrl || undefined,
                });

                // Save user to the database
                const newUser = await prismaClient.user.create({
                    data: {
                        uid: userRecord.uid,
                        email: userRecord.email,
                        name: userRecord.displayName,
                        photo_url: userRecord.photoURL || null,
                        provider_id: 'email',
                    },
                });

                return newUser;

            } catch (firebaseError) {
                // Handle specific Firebase errors
                switch (firebaseError.code) {
                    case 'auth/email-already-in-use':
                        throw new ApiError(400, 'email-already-in-use', 'This email is already registered.');
                    case 'auth/invalid-email':
                        throw new ApiError(400, 'invalid-email', 'The email address is not valid.');
                    case 'auth/operation-not-allowed':
                        throw new ApiError(400, 'email-auth-disabled', 'Email/password authentication is not enabled.');
                    case 'auth/weak-password':
                        throw new ApiError(400, 'weak-password', 'The password is too weak. It must be at least 6 characters long.');
                    default:
                        throw new ApiError(500, 'registration-failed', 'Failed to create user account.');
                }
            }

        } catch (error) {
            // If it's already an ApiError, throw it directly
            if (error instanceof ApiError) {
                throw error;
            }

            // Handle other types of errors
            console.error("Registration error:", error);

            throw new ApiError(
                500,
                'internal-error',
                'An unexpected error occurred during registration.'
            );
        }
    }

    async signInWithEmailPassword(email, password) {
        try {
            // First, check if the email exists in your database
            const userExists = await prismaClient.user.findFirst({
                where: { email: email }
            });

            if (!userExists) {
                throw new ApiError(400, 'email-not-found', 'No user found with this email address.');
            }

            // If email exists, try to authenticate with Firebase
            const apiKey = process.env.FIREBASE_API_KEY;
            try {
                const response = await axios.post(
                    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
                    {
                        email,
                        password,
                        returnSecureToken: true
                    }
                );

                const { idToken, localId } = response.data;

                // Update last login
                await prismaClient.user.update({
                    where: { uid: localId },
                    data: { last_login_at: new Date() },
                });

                return { user: userExists, idToken };

            } catch (firebaseError) {
                // Access the actual error response from Firebase
                const errorMessage = firebaseError.response?.data?.error?.message || 'Authentication failed';

                switch (errorMessage) {
                    case 'EMAIL_NOT_FOUND':
                        throw new ApiError(400, 'email-not-found', 'No user found with this email address.');
                    case 'INVALID_PASSWORD':
                        throw new ApiError(400, 'invalid-password', 'The password you entered is incorrect.');
                    case 'USER_DISABLED':
                        throw new ApiError(400, 'user-disabled', 'This user account has been disabled.');
                    default:
                        throw new ApiError(400, 'auth-error', 'Authentication failed. Please try again.');
                }
            }
        } catch (error) {
            // If it's already an ApiError, throw it directly
            if (error instanceof ApiError) {
                throw error;
            }

            // Handle other types of errors
            console.error("Login error:", error);

            throw new ApiError(
                500,
                'internal-error',
                'An unexpected error occurred during login.'
            );
        }
    }

    async requestPasswordReset(email) {
        const user = await prismaClient.user.findFirst({ where: { email } });
        if (!user) {
            throw new ApiError(400, 'email-not-found', 'No user found with this email address.');
        }

        const token = generateResetToken();
        await prismaClient.passwordReset.create({
            data: {
                email,
                token,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Set expiration to 5 minutes
            }
        });

        await sendEmail(email, 'Password Reset for AIRA', `Your reset token is: ${token}`);
        return { success: true, message: 'Password reset token sent to email.' };
    }

    async verifyResetToken(email, token) {
        const resetRequest = await prismaClient.passwordReset.findFirst({
            where: { email, token, expiresAt: { gt: new Date() } }
        });

        if (!resetRequest) {
            throw new ApiError(400, 'invalid-token', 'The token is invalid or has expired.');
        }

        return { success: true, message: 'Token verified successfully.' };
    }

    async resetPassword(email, token, newPassword) {
        const resetRequest = await prismaClient.passwordReset.findFirst({
            where: { email, token, expiresAt: { gt: new Date() } }
        });

        if (!resetRequest) {
            throw new ApiError(400, 'invalid-token', 'The token is invalid or has expired.');
        }

        if (newPassword.length < 6) {
            throw new ApiError(400, 'weak-password', 'Password should be at least 6 characters long.');
        }

        const userRecord = await auth.getUserByEmail(email);
        await auth.updateUser(userRecord.uid, { password: newPassword });

        await prismaClient.passwordReset.deleteMany({ where: { email } });

        return { success: true, message: 'Password reset successfully.' };
    }
}

module.exports = new AuthService();
