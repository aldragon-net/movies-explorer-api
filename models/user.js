const mongoose = require('mongoose');
const validator = require('validator');

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

module.exports = mongoose.model('user', userSchema);
