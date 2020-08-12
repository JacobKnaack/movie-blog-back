'use strict';

const Router = require('express').Router;
const httpErrors = require('http-errors');

const Movie = require('../model/movie/schema.js');
const bearerAuth = require('../lib/bearer-auth-middleware');

const movieRouter = module.exports = new Router();

// fetch all movies
movieRouter.get('/movies', function (req, res, next) {
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
  let creationDate = new Date();
  if (req.body.created_on) {
    creationDate = new Date(req.body.created_on);
  }

  new Movie({
    name: req.body.name,
    release: req.body.release,
    image_path: req.body.image_path,
    created_on: creationDate,
  }).save()
    .then(movie => res.json(movie))
    .catch(err => next(httpErrors(400, err.message)));
});

movieRouter.removeAllMovies = () => {
  return Movie.deleteMany({});
};
