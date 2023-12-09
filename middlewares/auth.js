const jwt = require('jsonwebtoken');
const { MESSAGES } = require('../constants/messages');
const { AuthorizationError } = require('../errors');
const { JWT_KEY } = require('../config');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new AuthorizationError(MESSAGES.AUTH_NEEDED));
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    next(new AuthorizationError(MESSAGES.TOKEN_FAIL));
  }
  req.user = payload;
  return next();
};
