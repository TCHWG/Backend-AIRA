// services/authService.js
const { auth } = require('../config/firebaseConfig');
const prisma = require('@prisma/client');
const axios = require('axios');
const ApiError = require('../errors/apiError');

const prismaClient = new prisma.PrismaClient();



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
                // If email exists but Firebase auth fails, it means password is wrong
                throw new ApiError(400, 'invalid-password', 'The password you entered is incorrect.');
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
}

module.exports = new AuthService();
