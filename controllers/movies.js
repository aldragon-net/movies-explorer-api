const Movie = require('../models/movie');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../errors/errors');
const { MESSAGES } = require('../constants/messages');
const { STATUSES } = require('../constants/statuses');

module.exports.saveMovie = (req, res, next) => {
  const data = req.body;
  const movieData = { ...data, owner: req.user._id };
  Movie.create(movieData)
    .then((movie) => res.status(STATUSES.CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(MESSAGES.BAD_MOVIE_DATA));
      }
      return next(err);
    });
};

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteSavedMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => new NotFoundError(MESSAGES.MOVIE_NOT_FOUND))
    .then((savedMovie) => {
      if (savedMovie.owner.toHexString() === req.user._id) {
        Movie.findByIdAndRemove(savedMovie._id)
          .then((deletedMovie) => res.send(deletedMovie))
          .catch(next);
      } else {
        throw new ForbiddenError(MESSAGES.DELETE_FORBIDDEN);
      }
    })
    .catch(next);
};
