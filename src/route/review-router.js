'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Review = require('../model/Review.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const reviewRouter = module.exports = new Router();
// fetch all saved reviews
reviewRouter.get('/reviews', bearerAuth, function (req, res, next) {
  Review.find({})
    .then(reviews => {
      if(!reviews) {
        return next(httpErrors(404, 'no reviews found'));
      }
      res.json(reviews);
    }).catch(err => httpErrors(404, err.message));
});

// find review model by movie id
reviewRouter.get('/reviews/:movieId', bearerAuth, function (req, res, next) {
  Review.find({movieId: req.params.movieId})
    .then(reviews => {
      if(!reviews) {
        return next(httpErrors(404, 'no reviews for that id'));
      }
      res.json(reviews);
    }).catch(err => httpErrors(404, err.message));
});

reviewRouter.post('/review', jsonParser, bearerAuth, function (req, res) {
  new Review(req.body).save()
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
      if (req.body.markdown) {
        review.markdown = req.body.markdown;
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
