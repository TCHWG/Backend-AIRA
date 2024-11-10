// services/authService.js
const { auth } = require('../config/firestoreConfig');
const UserModel = require("../models/userModel");
const ApiError = require("../errors/api_error");

class AuthService {
    static validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            throw ApiError.badRequest('Password must be at least 8 characters long');
        }
        if (!hasUpperCase || !hasLowerCase) {
            throw ApiError.badRequest('Password must contain both uppercase and lowercase letters');
        }
        if (!hasNumbers) {
            throw ApiError.badRequest('Password must contain at least one number');
        }
        if (!hasSpecialChar) {
            throw ApiError.badRequest('Password must contain at least one special character');
        }
    }

    static async registerUser(email, password, name) {
        try {
            // Validate password strength
            this.validatePassword(password);

            // Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email,
                password,
                displayName: name,
            });

            // Create user in Firestore
            const user = new UserModel(userRecord.uid, {
                name,
                email,
                socialId: null,
                authProvider: 'email',
                metadata: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            });

            await user.save();
            return user;
        } catch (error) {
            console.error("Registration error:", error);

            if (error.code === 'auth/email-already-exists') {
                throw ApiError.badRequest('Email sudah terpakai');
            }
            if (error instanceof ApiError) {
                throw error;
            }
            throw ApiError.internalServerError("Registration failed");
        }
    }

    static async signInWithEmailPassword(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = await UserModel.getUserById(userCredential.user.uid);
            
            await user.update({
                metadata: {
                    lastSignInTime: new Date().toISOString()
                }
            });

            return user;
        } catch (error) {
            console.error("Sign in error:", error);
            if (error.code === 'auth/wrong-password') {
                throw ApiError.unauthorized('Invalid credentials');
            }
            if (error.code === 'auth/user-not-found') {
                throw ApiError.unauthorized('User not found');
            }
            throw ApiError.internalServerError("Sign in failed");
        }
    }
}

module.exports = AuthService;
