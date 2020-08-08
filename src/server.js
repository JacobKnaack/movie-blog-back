'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const httpErrors = require('http-errors');

const authRouter = require('./route/auth-router');
const reviewRouter = require('./route/review-router');
const movieRouter = require('./route/movie-router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRouter);
app.use('/api', reviewRouter);
app.use('/api', movieRouter);

app.all('*', (req, res, next) => {
  next(httpErrors(404, 'this route is not registered'));
});

app.use(require('./lib/error-middleware.js'));

const server = module.exports = {};
server.app = app;
server.isOn = false;
server.start = () => {
  return new Promise((resolve, reject) => {
    if (!server.isOn) {
      server.http = app.listen(PORT, () => {
        server.isOn = true;
        console.log('server up', PORT);
        resolve();
      });
      return;
    }
    reject(new Error('server already running'));
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if (server.http && server.isOn) {
      return server.http.close(() => {
        server.isOn = false;
        console.log('server down');
        resolve();
      });
    }
    reject(new Error('ther server is not running'));
  });
};
