require('dotenv').config();
'use strict';

// npm modules
const { Router } = require('express');

// app modules
const basicAuth = require('../lib/middleware/basic-auth-middleware.js');
const bearerAuth = require('../lib/middleware/bearer-auth-middleware.js');
const User = require('../model/user/schema.js');

// module logic
const authRouter = module.exports = new Router();

authRouter.post('/signup', (req, res, next) => {

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

authRouter.post('/login', basicAuth, (req, res, next) => {

  req.user.tokenCreate()
    .then(token => {
      res.send({
        accessToken: token,
      });
    })
    .catch(next);
});

authRouter.patch('/reset', bearerAuth, (req, res, next) => {

  return req.user.passwordReset(req.body.password)
    .then(() => {
      res.status(204).send({
        message: `Successfully update user: ${req.user.username}`,
      });
    })
    .catch(next);
});
