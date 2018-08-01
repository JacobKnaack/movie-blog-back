'use strict';

const User = require('../../src/model/User.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
  ]);
};
