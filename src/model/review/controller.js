'use strict';

const ReviewModel = require('./schema.js');

exports.fetch = (page, limit) => {
  let options = {
    limit: limit || 15,
  };
  if (page) options['skip'] = options.limit * (page - 1);

  return ReviewModel.find({}, null, options)
    .then(reviews => ({
      count: reviews.length,
      results: reviews,
      next: reviews.length < options.limit ? null : page + 1 || 2,
    }));
};

exports.create = (data) => {
  let createdOn = data.created_on ? new Date(data.created_on) : new Date();

  return new ReviewModel({
    movieId: data.movieId,
    user: data.user,
    title: data.title,
    html: data.html,
    created_on: createdOn,
    updated_on: new Date(),
  }).save();
};

exports.fetchById = (id) => {
  return ReviewModel.findOne({ _id: id });
};

exports.fetchByMovieId = (id) => {
  return ReviewModel.find({ movieId: id });
};

exports.fetchByUser = (user, page) => {
  let options = {
    limit: 15,
  };
  if (page) {
    options['skip'] = options.limit * (page - 1);
  }
  return ReviewModel.find({ user }, null, options)
    .then(reviews => ({
      count: reviews.length,
      results: reviews,
      next: reviews.length < options.limit ? null : page + 1 || 2,
    }));
};

exports.updateById = (id, data) => {
  return ReviewModel.findOne({ _id: id })
    .then(review => {
      Object.keys(data).forEach(key => {
        review[key] = data[key];
      });
      review.updated_on = new Date();
      return review.save();
    });
};
