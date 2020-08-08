'use strict';

require('dotenv').config();

const server = require('./src/server.js');
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/db';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

server.start(PORT);
