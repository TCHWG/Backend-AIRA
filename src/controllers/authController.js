// controllers/authController.js
const authService = require("../services/authService");
const ApiError = require("../errors/apiError");

class AuthController {
    static async registerUser(req, res) {
        try {
            const { email, password, name, photoUrl } = req.body;

            // Validate required fields
            if (!email || !password || !name) {
                throw ApiError.badRequest("Email, password, and name are required");
            }

            // Register the user using the service
            const user = await authService.registerUser(email, password, name, photoUrl);

            // Respond with success message and user data
            res.status(201).json({
                success: true,
                code: 201,
                status: "Created",
                message: "Registration successful",
                data: user,
            });
        } catch (error) {
            console.error("Registration controller error:", error);

            if (error instanceof ApiError) {
                res.status(error.code).json({
                    success: false,
                    code: error.code,
                    status: error.status,
                    message: error.message,
                });
            } else {
                const serverError = ApiError.internalServerError("Registration failed");
                res.status(serverError.code).json({
                    success: false,
                    code: serverError.code,
                    status: serverError.status,
                    message: serverError.message,
                });
            }
        }
    }

    static async signIn(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw ApiError.badRequest("Email and password are required");
            }

            const { user, idToken } = await authService.signInWithEmailPassword(email, password);

            res.status(200).json({
                success: true,
                code: 200,
                status: "Success",
                message: "Sign in successful",
                data: {
                    user,
                    token: idToken,
                },
            });
        } catch (error) {
            console.error("Sign in controller error:", error);

            if (error instanceof ApiError) {
                res.status(error.code).json({
                    success: false,
                    code: error.code,
                    status: error.status,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    code: 500,
                    status: "Internal Server Error",
                    message: error.message || "Sign in failed",
                });
            }
        }
    }

    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const result = await authService.requestPasswordReset(email);
            res.status(200).json({
                success: true,
                code: 200,
                status: "Success",
                message: result.message,
            });
        } catch (error) {
            console.error("Request password reset controller error:", error);
            if (error instanceof ApiError) {
                res.status(error.code).json({
                    success: false,
                    code: error.code,
                    status: error.status,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    code: 500,
                    status: "Internal Server Error",
                    message: "Failed to request password reset",
                });
            }
        }
    }

    static async verifyResetToken(req, res) {
        try {
            const { email, token } = req.body;
            const result = await authService.verifyResetToken(email, token);
            res.status(200).json({
                success: true,
                code: 200,
                status: "Success",
                message: result.message,
            });
        } catch (error) {
            console.error("Verify reset token controller error:", error);
            if (error instanceof ApiError) {
                res.status(error.code).json({
                    success: false,
                    code: error.code,
                    status: error.status,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    code: 500,
                    status: "Internal Server Error",
                    message: "Failed to verify reset token",
                });
            }
        }
    }

    static async resetPassword(req, res) {
        try {
            const { email, token, newPassword } = req.body;
            const result = await authService.resetPassword(email, token, newPassword);
            res.status(200).json({
                success: true,
                code: 200,
                status: "Success",
                message: result.message,
            });
        } catch (error) {
            console.error("Reset password controller error:", error);
            if (error instanceof ApiError) {
                res.status(error.code).json({
                    success: false,
                    code: error.code,
                    status: error.status,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    code: 500,
                    status: "Internal Server Error",
                    message: "Failed to reset password",
                });
            }
        }
    }
}

module.exports = AuthController;
