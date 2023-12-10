const { STATUSES } = require('../constants/statuses');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUSES.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
