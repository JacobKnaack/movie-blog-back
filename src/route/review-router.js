'use strict';

const Router = require('express').Router;
const httpErrors = require('http-errors');
const errorHandler = require('../lib/error-middleware.js');

const Review = require('../model/review/schema.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const reviewController = require('../model/review/controller.js');
const reviewRouter = module.exports = new Router();

// fetch all saved reviews
reviewRouter.get('/reviews', function (req, res, next) {
  const page = parseInt(req.query.page);
  reviewController.fetch(page)
    .then(reviews => {
      if (!reviews) {
        return next(httpErrors(404, 'no reviews found'));
      }
      return res.json(reviews);
    }).catch(err => next(httpErrors(404, err.message)));
});

// find review model by movie id
reviewRouter.get('/reviews/:movieId', function (req, res, next) {
  // Review.find({ movieId: req.params.movieId })
  reviewController.fetchByMovieId(req.params.movieId)
    .then(reviews => {
      if (!reviews) {
        return next(httpErrors(404, 'no reviews for that id'));
      }
      return res.json(reviews);
    }).catch(err => next(httpErrors(404, err.message)));
});

//fetch review by review id
reviewRouter.get('/review/:id', function (req, res, next) {
  reviewController.fetchById(req.params.id)
    .then(review => {
      if (!review) {
        return next(httpErrors(404, 'no review found'));
      }
      return res.json(review);
    }).catch(err => next(httpErrors(404, err.message)));
});

//fetch review by author
reviewRouter.get('/reviews/by/:user', function (req, res, next) {
  reviewController.fetchByUser(req.params.user)
    .then(reviews => {
      if (!reviews) {
        return next(httpErrors(404, 'no reviews found by that author'));
      }
      return res.json(reviews);
    }).catch(err => next(httpErrors(404, err.message)));
});

reviewRouter.post('/review', bearerAuth, function (req, res, next) {
  let data = req.body;
  reviewController.create(data)
    .then(review => res.json(review))
    .catch(err => next(httpErrors(400, err.message)));
});

reviewRouter.patch('/review/:id', bearerAuth, function (req, res, next) {
  if (JSON.stringify(req.body) === '{}') return httpErrors(400, 'no body provided');

  reviewController.updateById(req.params.id, req.body)
    .then(review => res.json(review))
    .catch(err => next(errorHandler(err.message)));
});

//delete review by user
reviewRouter.delete('/review/:id', bearerAuth, function (req, res, next) {
  Review.findByIdAndRemove(req.params.id)
    .then(review => {
      res.status(204).send(JSON.stringify(review));
    })
    .catch(err => next(httpErrors(404, err.message)));
});

// for testing purposes only
reviewRouter.removeAllReviews = () => {
  return Review.deleteMany({});
};
