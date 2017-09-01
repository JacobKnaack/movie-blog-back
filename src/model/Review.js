'use strict';

const  mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const reviewSchema = new Schema({
  movieId: {type: Number, required: true, unique: true},
  submissions: {type: Array, required: true}
});

module.exports = mongoose.model('Review', reviewSchema);
