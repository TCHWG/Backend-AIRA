// routes/authRoutes.js
const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

// Route for traditional registration and signin
router.post("/register", AuthController.registerUser);
router.post("/signin", AuthController.signIn);

// Routes for password reset
router.post("/request-password-reset", AuthController.requestPasswordReset);
router.post("/verify-reset-token", AuthController.verifyResetToken);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
