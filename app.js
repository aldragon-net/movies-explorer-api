const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const { handleError } = require('./errors');

const router = require('./routes');

const { PORT, DB_URL } = require('./config');

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

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  handleError({
    err, req, res, next,
  });
});

app.listen(PORT);
