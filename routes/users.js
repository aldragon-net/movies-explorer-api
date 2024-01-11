const usersRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { userUpdateSchema } = require('../schemas/users');
const { getUser, updateUser } = require('../controllers/users');

usersRouter.patch('/me', celebrate(userUpdateSchema), updateUser);
usersRouter.get('/me', getUser);

module.exports = usersRouter;
