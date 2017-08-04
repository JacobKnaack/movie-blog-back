'use strict'

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const Review = require('../model/Review.js');
const reviewRouter = module.exports = new Router();

reviewRouter.get('/reviews', function (req, res, next) {
  Review.find({})
  .then(reviews => {
    if(!reviews) {return next(httpErrors(404, 'no reivews found'))};
    res.json(reviews);
  }).catch(err => httpErrors(404, err.message));
});

reviewRouter.post('./reviews', jsonParser, function (req, res, next) {
  new Review(req.body).save()
  .then( review => res.json(review) )
  .catch(err => httpErrors(400, err.message));
})
