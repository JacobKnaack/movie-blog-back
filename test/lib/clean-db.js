'use strict';

const Author = require('../../src/model/Author.js');

module.exports = () => {
  return Promise.all([
    Author.remove({}),
  ]);
};
