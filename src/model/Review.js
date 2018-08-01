'use strict';

const  mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const reviewSchema = new Schema({
  movieId: {type: String, required: true},
  user: {type: String, required: true},
  title: {type: String, required: true},
  html: {type: String, require: true},
  created_on: { type: Date, required: true },
  updated_on: { type: Date, required: true },
});

module.exports = mongoose.model('Review', reviewSchema);
