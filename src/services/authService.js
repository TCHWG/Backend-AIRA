// services/authService.js
const { auth } = require('../config/firebaseConfig');
const prisma = require('@prisma/client');

const prismaClient = new prisma.PrismaClient();

class AuthService {
    async registerUser(email, password, name, photoUrl) {
        try {
            // Create user in Firebase Authentication
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
        } catch (error) {
            throw new Error(`Error registering user: ${error.message}`);
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

module.exports = new AuthService();
