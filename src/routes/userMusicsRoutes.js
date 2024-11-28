const express = require('express');
const userMusicsController = require('../controllers/userMusicsController');
const rateLimiter = require('../middleware/rateLimiterMiddleware');
const router = express.Router();

// Define the route for get the user musics 
router.get('/', rateLimiter, userMusicsController.getUserMusics);

module.exports = router;
