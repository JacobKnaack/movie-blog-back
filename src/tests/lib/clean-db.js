'use strict';

const User = require('../../model/user/schema.js');

module.exports = () => {
  return Promise.all([
    User.deleteMany({}),
  ]);
};
