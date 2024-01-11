const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
