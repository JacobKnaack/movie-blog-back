'use strict';

require('dotenv').config();

const server = require('./src/lib/server.js');
const seed = require('./src/lib/_db-seed.js');
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
const db = mongoose.connection;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/db';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

db.on('open', () => {
  if (process.env.NODE_ENV === 'development') {
    seed.user({ username: 'testUser' })
      .then(results => {
        console.log(
          '**************************\n User created via development server: \n',
          `USERNAME: ${results.user.username} \n`,
          `PASSWORD: ${results.password}\n`,
          'These credentials will expire\n **************************'
        );
        return results.user;
      })
      .then(seed.reviews);
  }

  server.start(PORT);
});

