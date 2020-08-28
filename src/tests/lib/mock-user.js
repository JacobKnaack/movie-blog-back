'use strict';

const faker = require('faker');
const User = require('../../model/user/schema.js');

const mockUser = module.exports = {};

mockUser.createNP = (args = {}) => {
  let result = {};
  result.password = faker.internet.password();
  return new User({
    username: args.username || faker.internet.userName(),
    email: args.email || faker.internet.email(),
    isNitPicker: true,
  })
    .passwordHashCreate(result.password)
    .then(user => {
      result.user = user;
      return user.tokenCreate();
    })
    .then(token => {
      result.token = token;
      return result;
    });
};

mockUser.createOne = (args = {}) => {
  let result = {};
  result.password = faker.internet.password();
  return new User({
    username: args.username || faker.internet.userName(),
    email: args.email || faker.internet.email(),
  })
    .passwordHashCreate(result.password)
    .then(user => {
      result.user = user;
      return user.tokenCreate();
    })
    .then(token => {
      result.token = token;
      return result;
    });
};
