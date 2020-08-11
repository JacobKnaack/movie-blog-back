'use strict';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

module.exports = {
  start: () => {
    mongod.getConnectionString()
      .then((uri) => {
        try {
          mongoose.connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
          });
        } catch (e) {
          console.log(e);
        }
      });
  },
  stop: () => {
    mongoose.disconnect();
    mongod.stop();
  }
}