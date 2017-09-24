'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Review = require('../model/Review.js');
const reviewRouter = module.exports = new Router();

reviewRouter.get('/reviews', function (req, res, next) {
  Review.find({})
    .then(reviews => {
      if(!reviews) {
        return next(httpErrors(404, 'no reviews found'));
      }
      res.json(reviews);
    }).catch(err => httpErrors(404, err.message));
});

reviewRouter.get('/review/:movieId', function (req, res, next) {
  Review.find({movieId: req.params.movieId})
    .then(review => {
      if(!review) {
        return next(httpErrors(404, 'no reviews for that id'));
      }
      res.json(review[0]);
    }).catch(err => httpErrors(404, err.message));
});

reviewRouter.post('/review', jsonParser, function (req, res) {
  new Review(req.body).save()
    .then(review => res.json(review))
    .catch(err => httpErrors(400, err.message));
});

reviewRouter.put('/review/:movieid', jsonParser, function(req, res) {
  if (JSON.stringify(req.body) === '{}') return httpErrors(400, 'no body provided');
  Review.findOne({movieId: req.params.movieid})
    .then(review => {
      review.submissions.push(req.body);
      review.save();
      res.json(review);
    }).catch(err => httpErrors(404, err.message));
});

//delete review by author
reviewRouter.delete('/review/:movieid/:author', function(req, res) {
  Review.findOne({movieId: req.params.movieid})
    .then(reviews => {
      if (!reviews) {return httpErrors(404, 'no review found');}
      for (var i = 0; i < reviews.submissions.length; i ++) {
        if (reviews.submissions[i].author === req.params.author) {
          reviews.submissions.splice(i, 1);
        }
      }
      reviews.save();
      res.status(204);
      res.json(reviews);
    })
    .catch(err => httpErrors(404, err.message));
});

reviewRouter.removeAllReviews = () => {
  return Review.remove({});
};
