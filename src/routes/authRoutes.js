// routes/authRoutes.js
const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

// Route for traditional registration
router.post("/register", AuthController.registerUser);

module.exports = router;
