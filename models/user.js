const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { AuthorizationError } = require('../errors');
const { MESSAGES } = require('../constants/messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Поле "email" должно содержать корректный e-mail',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  __v: {
    type: Number,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError(MESSAGES.AUTH_FAIL));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError(MESSAGES.AUTH_FAIL));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
