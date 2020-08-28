'use strict';

const User = require('../model/user/schema.js');
const Movie = require('../model/movie/schema.js');
const Review = require('../model/review/schema.js');
const createMovies = require('../tests/lib/create-movies.js');
const createReviews = require('../tests/lib/create-reviews.js');
const mockUser = require('../tests/lib/mock-user.js');

// module for seeding a mongo db for development

exports.user = (userData) => {
  return User.find(userData)
    .then(results => {
      if (results.length) {
        return User.findByIdAndRemove(results[0]._id)
          .then(() => {
            return mockUser.createNP(userData);
          });
      }
      return mockUser.createNP(userData);
    });
};

exports.reviews = (user) => {
  return Movie.find({})
    .then(results => {
      if (results.length) {
        return results[0];
      }
      return new Movie(createMovies.byParams({ name: 'Test Movie' })).save();
    })
    .then(movie => {
      return Review.find({ movieId: movie._id })
        .then(results => {
          if (results.length) {
            return results[0];
          }
          return new Review(createReviews.byParams(movie._id, { user: user.username })).save();
        });
    });
};
