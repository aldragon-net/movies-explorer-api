const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');
const bodyParser = require('body-parser');

const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const { auth } = require('./middlewares/auth');
const { handleError, NotFoundError } = require('./errors/errors');

const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');
const { createUser, login, logout } = require('./controllers/users');
const { userCreationSchema, userLoginSchema } = require('./schemas/users');

const { MESSAGES } = require('./constants/messages');

require('dotenv').config();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());

app.post('/signin', celebrate(userLoginSchema), login);
app.post('/signup', celebrate(userCreationSchema), createUser);
app.post('/signout', logout);

app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);
app.use('*', auth, (req, res, next) => { next(new NotFoundError(MESSAGES.ROUTE_NOT_FOUND)); });

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  handleError({
    err, req, res, next,
  });
});

app.listen(PORT);
