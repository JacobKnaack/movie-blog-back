'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Review = require('../model/Review.js');
const reviewRouter = module.exports = new Router();

reviewRouter.get('/review', function (req, res, next) {
  Review.find({})
  .then(reviews => {
    if(!reviews) {return next(httpErrors(404, 'no reviews found'));}
    res.json(reviews);
  }).catch(err => httpErrors(404, err.message));
});

reviewRouter.post('/review', jsonParser, function (req, res) {
  new Review(req.body).save()
  .then( review => res.json(review) )
  .catch(err => httpErrors(400, err.message));
});

reviewRouter.put('/review/:id', jsonParser, function(req, res) {
  if (JSON.stringify(req.body) === '{}') return httpErrors(400, 'no body provided');
  Review.findOne({_id: req.params.id})
  .then(review => {
    if(req.body.jacob) {
      review.jacob.title = req.body.jacob.title;
      review.jacob.content = req.body.jacob.content;
      review.save();
      res.json(review);
    } else if (req.body.ivan) {
      review.ivan.title = req.body.ivan.title;
      review.ivan.content = req.body.ivan.content;
      review.save();
      res.json(review);
    } else if (req.body.megan) {
      review.megan.title = req.body.megan.title;
      review.megan.content = req.body.megan.content;
      review.save();
      res.json(review);
    }
  }).catch(err => httpErrors(404, err.message));
});

reviewRouter.delete('/review/:id', function(req, res) {
  Review.remove({_id: req.params.id})
  .then(review => {
    if (!review) {return httpErrors(404, 'no review found');}
    res.status(204);
    res.json(review);
  })
  .catch(err => httpErrors(404, err.message));
});

reviewRouter.removeAllReviews = () => {
  return Review.remove({});
};
