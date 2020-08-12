'use strict';

const Review = require('./schema.js');

exports.fetch = (page) => {
  let options = {
    limit: 15,
  };
  if (page) {
    options['skip'] = options.limit * parseInt(page - 1);
  }
  return Review.find({}, null, options);
};

exports.create = (data) => {
  let creationDate = data.created_on ? new Date(data.created_on) : new Date();

  return new Review({
    movieId: data.movieId,
    user: data.user,
    title: data.title,
    html: data.html,
    created_on: creationDate,
    updated_on: new Date(),
  }).save();
};

exports.fetchById = (id) => {
  return Review.findOne({ _id: id });
};

exports.fetchByMovieId = (id) => {
  return Review.find({ movieId: id });
};

exports.fetchByUser = (user) => {
  return Review.find({ user });
};

exports.updateById = (id, data) => {
  return Review.findOne({ _id: id })
    .then(review => {
      Object.keys(data).forEach(key => {
        review[key] = data[key];
      });
      review.updated_on = new Date();
      return review.save();
    });
};
