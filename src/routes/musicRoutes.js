const express = require('express');
const musicController = require('../controllers/musicController');
const rateLimiter = require('../middleware/rateLimiterMiddleware');

const router = express.Router();

router.get('/', rateLimiter, musicController.getMusic);

module.exports = router;
