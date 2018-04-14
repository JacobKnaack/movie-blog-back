'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Movie = require('../model/Movie.js');
const bearerAuth = require('../lib/bearer-auth-middleware');

const movieRouter = module.exports = new Router();
movieRouter.get('/movies', function(req, res, next) {
  Movie.find({})
    .then(movies => {
      if(!movies) {
        return next(httpErrors(404, 'no reviews found'));
      }
      res.json(movies);
    }).catch(err => httpErrors(404, err.message));
});

movieRouter.post('/movie', jsonParser, bearerAuth, function(req, res) {
  new Movie({
    name: req.body.name,
    release: req.body.release,
    image_path: req.body.image_path,
    created_on: new Date(),
  }).save()
    .then(movie => res.json(movie))
    .catch(err => httpErrors(400, err.message));
});

movieRouter.removeAllMovies = () => {
  return Movie.remove({});
};
