const { STATUSES } = require('../constants/statuses');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUSES.UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
