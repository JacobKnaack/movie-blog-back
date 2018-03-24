'use strict';

const API_URL = process.env.API_URL || 'localhost:3000';
require('dotenv').config();

// load npm modules
const expect = require('expect');
const superagent = require('superagent');

// load app modules
const server = require('../src/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

describe('testing auth router', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('testing POST /api/signup', () => {
    it('should respond with a token', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          username: 'test_user',
          password: 'top secret',
          email: 'test_user@example.lulwat',
        })
        .then(res => {
          console.log('token we go back ', res.text);
          expect(res.status).toEqual(200);
          expect(res.text.length > 1).toBeTruthy();
        });
    });
  });

  describe('testing GET /api/login', () => {
    it('should respond with a user and a token token', () => {
      let tempUser;
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData.user;
          console.log('tempUser', tempUser);
          let encoded = new Buffer(`${tempUser.username}:${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .then(res => {
          console.log('response body ', res.body);
          expect(res.status).toEqual(200);
          expect(res.body.author.username).toEqual(tempUser.username);
        });
    });
  });
});
