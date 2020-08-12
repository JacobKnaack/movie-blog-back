'use strict';

const faker = require('faker');

/**
 * Factory for creating 'num' reviews
 */
exports.byNumber = (num) => {
  let reviews = [];
  for (let i = num; i > 0; i--) {
    reviews.push({
      movieId: faker.random.uuid(),
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

exports.byParams = (args) => {
  return {
    movieId: args.movieId || faker.random.uuid(),
    title: faker.random.words(),
    user: args.user || faker.name.firstName(),
    html: faker.lorem.paragraphs(),
    created_on: new Date(),
    updated_on: new Date(),
  };
};
