const moviesRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { queryIdSchema, movieSaveSchema } = require('../schemas/movies');
const {
  saveMovie,
  getAllMovies,
  deleteSavedMovie,
} = require('../controllers/movies');

moviesRouter.post('/', celebrate(movieSaveSchema), saveMovie);
moviesRouter.get('/', getAllMovies);
moviesRouter.delete('/:id', celebrate(queryIdSchema), deleteSavedMovie);

module.exports = moviesRouter;
