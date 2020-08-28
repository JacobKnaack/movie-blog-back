'use strict';

const faker = require('faker');

/**
 * Factory for creating 'num' reviews, requires a movieId for movie foreign key.
 */
exports.byNumber = (movieId = null, num = 0) => {
  let reviews = [];
  for (let i = num; i > 0; i--) {
    reviews.push({
      movieId,
      title: faker.random.words(),
      user: faker.name.firstName(),
      html: faker.lorem.paragraphs(),
      created_on: new Date(),
      updated_on: new Date(),
    });
  }
  return reviews;
};

/**
 * Factory for creating a single review from parameters
 * @param {*} user 
 */

exports.byParams = (movieId = null, args = {}) => {
  return {
    movieId: movieId || args.movieId,
    title: args.title || faker.random.words(),
    user: args.user || faker.name.firstName(),
    html: args.html || faker.lorem.paragraphs(),
    created_on: new Date(),
    updated_on: new Date(),
  };
};
