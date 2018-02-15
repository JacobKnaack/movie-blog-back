'use strict';

const  mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const reviewSchema = new Schema({
  movieId: {type: Number, required: true},
  author: {type: String, required: true},
  title: {type: String, required: true},
  markdown: {type: String, require: true}
});

module.exports = mongoose.model('Review', reviewSchema);
