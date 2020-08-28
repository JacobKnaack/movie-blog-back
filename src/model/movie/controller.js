'use strict';

const MovieModel = require('./schema.js');

exports.create = (data) => {
  let createdOn = data.created_on ? new Date(data.created_on) : new Date();

  return new MovieModel({
    name: data.name,
    release: data.release,
    image_path: data.image_path,
    created_on: createdOn,
  }).save();
};

exports.fetch = (page, limit) => {
  let options = {
    limit: limit || 15,
  };
  if (page) options['skip'] = options.limit * (page - 1);

  return MovieModel.find({}, null, options)
    .then(reviews => ({
      count: reviews.length,
      results: reviews,
      next: page + 1 || 2,
    }));
};
