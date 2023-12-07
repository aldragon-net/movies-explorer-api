const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError, DuplicateError, NotFoundError } = require('../errors/errors');
const { STATUSES } = require('../constants/statuses');
const { MESSAGES } = require('../constants/messages');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const JWT_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-not-so-secret-key';
const COOKIES_OPTIONS = NODE_ENV === 'production'
  ? {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  }
  : {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
  };

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError(MESSAGES.USER_NOT_FOUND))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: req.body },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(MESSAGES.BAD_USER_DATA));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res
      .status(STATUSES.CREATED)
      .send({
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar,
      }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new DuplicateError(MESSAGES.USER_EXISTS));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(MESSAGES.BAD_USER_DATA));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY);
      res.cookie('jwt', token, COOKIES_OPTIONS);
      res.send({ _id: user._id });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  res.cookie('jwt', 'none', { ...COOKIES_OPTIONS, maxAge: 5000 });
  res.send({ message: 'Logged out' })
    .catch(next);
};
