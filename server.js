'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
mongoose.Promise = require('bluebird');

const reviewRouter = require('./src/route/review-router.js');
const movieRouter = require('./src/route/movie-router.js');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/db';

mongoose.connect(mongoURI, {
  useMongoClient: true
});

app.use(morgan('dev'));
app.use(cors());

app.use('/api', reviewRouter);
app.use('/api', movieRouter);

app.all('*', (req, res, next) => {
  next(httpErrors(404, 'this route is not registered'));
});

const server = app.listen(port, function () {
  console.log('movie-blog node server up and running on port: ', port);
});

server.isRunnning = true;
module.exports = server;
