'use strict';

const MovieModel = require('./schema.js;');

exports.create = (data) => {
  const movie = new MovieModel(data);
};