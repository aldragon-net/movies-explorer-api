const { STATUSES } = require('../constants/statuses');
const { MESSAGES } = require('../constants/messages');

const NotFoundError = require('./not-found-error');
const AuthorizationError = require('./auth-error');
const ForbiddenError = require('./forbidden-error');
const DuplicateError = require('./duplicate-error');
const BadRequestError = require('./bad-request-error');

const handleError = ({ err, res }) => {
  const { statusCode = STATUSES.INTERNAL, message } = err;
  res.status(statusCode).send({
    message: statusCode === STATUSES.INTERNAL
      ? MESSAGES.INTERNAL
      : message,
  });
};

module.exports = {
  NotFoundError, BadRequestError, AuthorizationError, ForbiddenError, DuplicateError, handleError,
};
