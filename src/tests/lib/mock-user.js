'use strict';

const faker = require('faker');
const User = require('../../model/User.js');

const mockUser = module.exports = {};

mockUser.createNP = () => {
  let result = {};
  result.password = faker.internet.password();
  return new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
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

mockUser.createOne = () => {
  let result = {};
  result.password = faker.internet.password();
  return new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
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