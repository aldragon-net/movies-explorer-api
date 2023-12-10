require('dotenv').config();

const DOMAINS = [
  'https://diplodrakon.nomoredomainsmonster.ru',
  'http://diplodrakon.nomoredomainsmonster.ru',
  'localhost:3000',
];

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  NODE_ENV = 'dev',
  JWT_SECRET,
} = process.env;

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

module.exports = {
  PORT, DB_URL, DOMAINS, COOKIES_OPTIONS, JWT_KEY,
};
