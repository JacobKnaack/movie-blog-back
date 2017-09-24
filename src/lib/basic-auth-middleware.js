'use strict';

const Author = require('../model/Author.js');

// basic auth middleware for login route
// find a user in db and compare the password
// add the user to the req object for use in thre route
// if anything fails next an unauthorized error

module.exports = (req, res, next) => {
  const {authorization} = req.headers;

  if(!authorization)
    return next(new Error('unauthorized no authorization provieded'));

  let encoded = authorization.split('Basic ')[1];
  if(!encoded)
    return next(new Error('unauthorized no basic auth provieded'));

  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':');

  if(!username || !password)
    return next(new Error('unauthorized username or password was missing'));

  console.log('decoded', decoded);
  console.log('username', username);
  console.log('password', password);

  Author.findOne({username})
    .then(user => {
      if(!user)
        return next(new Error('unauthorized user does not exist'));
      return user.passwordHashCompare(password);
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log('errrrrrrr', err);
      next(new Error('unauthorized find one failed in basic auth middleware'));
    });

};
