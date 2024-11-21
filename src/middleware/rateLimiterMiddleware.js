const rateLimit = require('express-rate-limit');
const ApiError = require('../errors/apiError');

const windowMs = 10 * 60 * 1000;
const maxRequests = 100;

const limiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    const minutes = windowMs / (60 * 1000);
    const message = `You have exceeded the ${maxRequests} requests in ${minutes} minutes limit!`;
    next(ApiError.tooManyRequests(message));
  },
});

module.exports = limiter;
