'use strict';

const Router = require('express').Router;
const httpErrors = require('http-errors');

const Review = require('../model/Review.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const reviewRouter = module.exports = new Router();
// fetch all saved reviews
reviewRouter.get('/reviews', function (req, res, next) {
  Review.find({})
    .then(reviews => {
      if (!reviews) {
        return next(httpErrors(404, 'no reviews found'));
      }
      return res.json(reviews);
    }).catch(err => httpErrors(404, err.message));
});

// find review model by movie id
reviewRouter.get('/reviews/:movieId', function (req, res, next) {
  Review.find({ movieId: req.params.movieId })
    .then(reviews => {
      if (!reviews) {
        return next(httpErrors(404, 'no reviews for that id'));
      }
      return res.json(reviews);
    }).catch(err => httpErrors(404, err.message));
});

//fetch review by review id
reviewRouter.get('/review/:reviewId', function (req, res, next) {
  Review.findOne({ _id: req.params.reviewId })
    .then(review => {
      if (!review) {
        return next(httpErrors(404, 'no review found'));
      }
      return res.json(review)
    }).catch(err => httpErrors(404, err.message));
});

//fetch review by author
reviewRouter.get('/reviews/by/:user', function (req, res, next) {
  Review.find({ user: req.params.user })
    .then(reviews => {
      if (!reviews) {
        return next(httpErrors(404, 'no reviews found by that author'));
      }
      return res.json(reviews);
    }).catch(err => httpErrors(404, err.message));
});

reviewRouter.post('/review', bearerAuth, function (req, res) {
  let creationDate = new Date();
  if (req.body.created_on) {
    creationDate = new Date(req.body.created_on);
  }

  new Review({
    movieId: req.body.movieId,
    user: req.body.user,
    title: req.body.title,
    html: req.body.html,
    created_on: creationDate,
    updated_on: new Date(),
  }).save()
    .then(review => res.json(review))
    .catch(err => httpErrors(400, err.message));
});

reviewRouter.put('/review/:id', bearerAuth, function (req, res) {
  if (JSON.stringify(req.body) === '{}') return httpErrors(400, 'no body provided');
  Review.findOne({ _id: req.params.id })
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
      review.updated_on = new Date();
      review.save();
      res.json(review);
    }).catch(err => httpErrors(404, err.message));
});

//delete review by user
reviewRouter.delete('/review/:id', bearerAuth, function (req, res) {
  Review.findByIdAndRemove(req.params.id)
    .then(review => {
      res.status(204).send(JSON.stringify(review));
    })
    .catch(err => httpErrors(404, err.message));
});

// for testing purposes only
reviewRouter.removeAllReviews = () => {
  return Review.remove({});
};
