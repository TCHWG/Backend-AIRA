const express = require('express');
const musicController = require('../controllers/musicController');
const rateLimiter = require('../middleware/rateLimiterMiddleware');

const router = express.Router();

// Define the route for get the musics
router.get('/', rateLimiter, musicController.getMusic);

module.exports = router;
