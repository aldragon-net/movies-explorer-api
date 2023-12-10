const { Joi } = require('celebrate');

module.exports.userCreationSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
    name: Joi.string().min(2).max(30),
  }),
};

module.exports.userLoginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
  }),
};

module.exports.userUpdateSchema = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
};
