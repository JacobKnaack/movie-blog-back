'use strict';

const Router = require('express').Router;
const httpErrors = require('http-errors');

const Movie = require('../model/movie/schema.js');
const movieController = require('../model/movie/controller.js');
const bearerAuth = require('../lib/middleware/bearer-auth-middleware.js');

const movieRouter = module.exports = new Router();

// default fetch, for now fetches all movies, query limiting??
movieRouter.get('/movies', function (req, res, next) {
  // const page = parseInt(req.query.page);
  // const limit = parseInt(req.query.limit);
  // movieController.fetch(page, limit)
  Movie.find({})
    .then(movies => {
      if (!movies) {
        return next(httpErrors(404, 'no moviess found'));
      }
      return res.json(movies);
    }).catch(err => next(httpErrors(404, err.message)));
});

// fetch movie by movieId
movieRouter.get('/movie/:movieId', function (req, res, next) {
  Movie.findOne({ _id: req.params.movieId })
    .then(movie => {
      if (!movie) {
        return next(httpErrors(404, 'no movie found'));
      }
      return res.json(movie);
    }).catch(err => next(httpErrors(404, err.message)));
});

//fetch movie by title
movieRouter.get('/movie_title/:movieTitle', function (req, res, next) {
  Movie.findOne({ name: req.params.movieTitle })
    .then(movie => res.json(movie))
    .catch(err => next(httpErrors(404, err.message)));
});

movieRouter.post('/movies', bearerAuth, function (req, res, next) {
  movieController.create(req.body)
    .then(movie => res.json(movie))
    .catch(err => next(httpErrors(400, err.message)));
});

movieRouter.removeAllMovies = () => {
  return Movie.deleteMany({});
};
