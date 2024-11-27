const express = require('express');
const userController = require('../controllers/userController');
const rateLimiter = require('../middleware/rateLimiterMiddleware');
const router = express.Router();

// Define the route for get the user's profile
router.get('/users/profile', rateLimiter, userController.getUserProfile);

// Define the route for updating the user's name
router.put('/users/name', rateLimiter, userController.updateUserName);

// Define the route for uploading the user's profile photo
router.post('/users/photo', rateLimiter, userController.uploadProfilePhoto);

module.exports = router;
