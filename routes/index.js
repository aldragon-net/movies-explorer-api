const router = require('express').Router();
const { celebrate } = require('celebrate');

const { auth } = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { NotFoundError } = require('../errors');
const { MESSAGES } = require('../constants/messages');
const { createUser, login, logout } = require('../controllers/users');
const { userCreationSchema, userLoginSchema } = require('../schemas/users');

router.post('/signin', celebrate(userLoginSchema), login);
router.post('/signup', celebrate(userCreationSchema), createUser);
router.post('/signout', auth, logout);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.use('*', (req, res, next) => { next(new NotFoundError(MESSAGES.ROUTE_NOT_FOUND)); });

module.exports = router;
