const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Define the route for updating the user's name
router.put('/users/:uid/name', userController.updateUserName);

module.exports = router;
