'use strict';

const jwt = require('jsonwebtoken');
const User = require('../../model/user/schema.js');
const universalify = require('universalify');

module.exports = (req, res, next) => {
  // if any of the following fail we will next an unauthorized error
  // check for the auth header
  let { authorization } = req.headers;
  if (!authorization)
    return next(new Error('unauthorized no auth header'));

  // check for a bearer token
  let [type, token] = authorization.split(' ');
  if (!token || type.toLowerCase() !== 'bearer') {
    return next(new Error('unauthorized no token found'));
  }

  // decrypt the token
  universalify.fromCallback(jwt.verify)(token, process.env.APP_SECRET)
    // find the user by the tokenSeed
    .then(decoded => {
      return User.findOne({ tokenSeed: decoded.tokenSeed });
    })
    .then(user => {
      if (!user) {
        throw new Error('unauthorized no user found');
      }
      req.user = user;
      next();
    })
    .catch(next);
};
