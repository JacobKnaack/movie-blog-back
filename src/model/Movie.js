'use strict';

const  mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: {type: String, required: true, unique: true},
  release: {type: Date, required: true},
  image_path: {type: String, required: true },
  created_on: {type: Date, required: true},
});

module.exports = mongoose.model('Movie', movieSchema);
