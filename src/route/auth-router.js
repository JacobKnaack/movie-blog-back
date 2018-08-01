require('dotenv').config();
'use strict';

// npm modules
const { Router } = require('express');
const jsonParser = require('body-parser').json();

// app modules
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/User.js');

// module logic
const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  console.log('hit /api/signup');

  if (req.body.np_as && req.body.np_as === process.env.NIT_PICKER_ACCESS_SECRET) {
    User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      isNitPicker: true,
    })
    .then(token => res.send(token))
    .catch(next);
  } else {
    User.create(req.body)
      .then(token => res.send(token))
      .catch(next);
  }

});

authRouter.get('/login', basicAuth, (req, res, next) => {
  console.log('hit /api/login');

  req.user.tokenCreate()
    .then(token => {
      res.send({
        user: req.user,
        accessToken: token,
      })
    })
    .catch(next);
});
