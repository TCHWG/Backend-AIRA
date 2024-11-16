const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Define the route for updating the user's name
router.put('/users/name', userController.updateUserName);

// Define the route for uploading the user's profile photo
router.post('/users/photo', userController.uploadProfilePhoto);

module.exports = router;
