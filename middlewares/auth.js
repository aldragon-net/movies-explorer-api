const jwt = require('jsonwebtoken');
const { MESSAGES } = require('../constants/messages');
const { AuthorizationError } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;
const JWT_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-not-so-secret-key';

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
