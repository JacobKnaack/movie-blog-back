const faker = require('faker');

/**
 * Factory for creating 'num' movies
 */
exports.byNumber = (num = 0) => {
  let movies = [];
  for (let i = num; i > 0; i--) {
    movies.push({
      name: faker.random.words(),
      release: faker.date.past(),
      image_path: faker.internet.url(),
      created_on: new Date(),
    });
  }
  return movies;
};

/**
 * Factory for creating a single movie from parameters
 * @param {*} user 
 */

exports.byParams = (args) => {
  return {
    name: args.name || faker.random.words(),
    release: args.release || faker.date.past(),
    image_path: args.image_path || faker.internet.url(),
    created_on: new Date(),
  };
};