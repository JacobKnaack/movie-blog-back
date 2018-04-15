'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Review = require('../model/Review.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const reviewRouter = module.exports = new Router();
// fetch all saved reviews
reviewRouter.get('/reviews', function (req, res, next) {
  Review.find({})
    .then(reviews => {
      if(!reviews) {
        return next(httpErrors(404, 'no reviews found'));
      }
      return res.json(reviews);
    }).catch(err => httpErrors(404, err.message));
});

// find review model by movie id
reviewRouter.get('/reviews/:movieId', function (req, res, next) {
  Review.find({ movieId: req.params.movieId })
    .then(reviews => {
      if(!reviews) {
        return next(httpErrors(404, 'no reviews for that id'));
      }
      return res.json(reviews);
    }).catch(err => httpErrors(404, err.message));
});

reviewRouter.get('/review/:reviewId', function(req, res, next) {
  Review.findOne({ _id: req.params.reviewId })
    .then(review => {
      if(!review) {
        return next(httpErrors(404, 'no review found'));
      }
      return res.json(review)
    }).catch(err => httpError(404, err.message));
});

reviewRouter.post('/review', jsonParser, bearerAuth, function (req, res) {
  new Review({
    movieId: req.body.movieId,
    author: req.body.author,
    title: req.body.title,
    html: req.body.html,
    created_on: new Date(),
    updated_on: new Date(),
  }).save()
    .then(review => res.json(review))
    .catch(err => httpErrors(400, err.message));
});

reviewRouter.put('/review/:id', jsonParser, bearerAuth, function(req, res) {
  if (JSON.stringify(req.body) === '{}') return httpErrors(400, 'no body provided');
  Review.findOne({_id: req.params.id})
    .then(review => {
      if (req.body.title) {
        review.title = req.body.title;
      }
      if (req.body.author) {
        review.author = req.body.author;
      }
      if (req.body.html) {
        review.html = req.body.html;
      }
      review.save();
      res.json(review);
    }).catch(err => httpErrors(404, err.message));
});

//delete review by author
reviewRouter.delete('/review/:id', bearerAuth, function(req, res) {
  Review.findByIdAndRemove(req.params.id)
    .then(review => {
      res.status(204).send(JSON.stringify(review));
    })
    .catch(err => httpErrors(404, err.message));
});

reviewRouter.removeAllReviews = () => {
  return Review.remove({});
};
