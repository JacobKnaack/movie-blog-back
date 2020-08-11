'use strict';

const User = require('../../model/User.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
  ]);
};
