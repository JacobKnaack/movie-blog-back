'use strict';

// npm modules
const {Router} = require('express');
const jsonParser = require('body-parser').json();

// app modules
const basicAuth = require('../lib/basic-auth-middleware.js');
const Author = require('../model/Author.js');

// module logic
const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  console.log('hit /api/signup');

  Author.create(req.body)
    .then(token => res.send(token))
    .catch(next);
});

authRouter.get('/login', basicAuth, (req, res, next) => {
  console.log('hit /api/login');

  req.user.tokenCreate()
    .then(token => res.send(token))
    .catch(next);
});
