const rateLimit = require('express-rate-limit');
const ApiError = require('../errors/apiError');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(ApiError.tooManyRequests("You have exceeded the 100 requests in 15 mins limit!"));
  },
});

module.exports = limiter;
