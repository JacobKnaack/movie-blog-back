'use strict';

const User = require('../model/User.js');
const httpErrors = require('http-errors')

// basic auth middleware for login route
// find a user in db and compare the password
// add the user to the req object for use in thre route
// if anything fails next an unauthorized error

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return next(new Error('no authorization header provided'));

  let [type, encoded] = authorization.split(' ');
  if (!encoded || type.toLowerCase() !== 'basic') {
    return next(new Error('unauthorized no basic auth provided'));
  }

  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':');

  if (!username || !password)
    return next(new Error('unauthorized username or password was missing'));

  User.findOne({ username })
    .then(user => {
      return user.passwordHashCompare(password);
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      return next(httpErrors(401, 'this username is not registered'));
    });

};
