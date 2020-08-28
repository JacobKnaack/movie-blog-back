'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  movieId: { type: String, required: true, },
  user: { type: String, required: true, },
  title: { type: String, required: true, },
  html: { type: String, required: true, },
  created_on: { type: Date, required: true, },
  updated_on: { type: Date, required: true, },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

reviewSchema.virtual('movieData', {
  ref: 'Movie',
  localField: 'movieId',
  foreignField: '_id',
  justOne: true,
});

reviewSchema.pre('findOne', function () {
  this.populate('movieData');
});

reviewSchema.pre('find', function () {
  this.populate('movieData');
});

module.exports = mongoose.model('Review', reviewSchema);