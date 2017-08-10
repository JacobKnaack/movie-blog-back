'use strict';

const  mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const reviewSchema = new Schema({
  title:   { type: String, required: true, unique: true },
  release: { type: Number, required: true },
  image:   { data: Buffer, contentType: String},
  jacob:   {
    title:   { type: String},
    content: { type: String}
  },
  ivan:    {
    title:   { type: String},
    content: { type: String}
  },
  megan:   {
    title:   { type: String},
    content: { tpye: String}
  }
});

module.exports = mongoose.model('Review', reviewSchema);
