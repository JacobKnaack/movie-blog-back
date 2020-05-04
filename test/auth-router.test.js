require('dotenv').config();
'use strict';

const API_URL = process.env.API_URL || 'http://localhost:3000';
require('dotenv').config();

// load npm modules
const expect = require('expect');
const superagent = require('superagent');

// load app modules
const server = require('../src/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

describe('Testing the Auth', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);
  let tempToken = null;

  describe('testing POST /api/signup', () => {
    it('should respond with a token', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          username: 'test_user',
          password: 'top secret',
          email: 'test_user@example.lulwat',
          np_as: process.env.NIT_PICKER_ACCESS_SECRET,
        })
        .then(res => {
          console.log('token we go back ', res.text);
          expect(res.status).toEqual(200);
          expect(res.text.length > 1).toBeTruthy();
        });
    });
  });

  describe('testing GET /api/login', () => {
    it('should respond with an np user and a token', () => {
      let tempUser = null;

      return mockUser.createNP()
        .then(userData => {
          tempUser = userData.user;
          tempToken = userData.token;
          let encoded = new Buffer(`${tempUser.username}:${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.user.username).toEqual(tempUser.username);
        });
    });
  });

  describe('testing PATCH /api/reset/', () => {
    it('should respond with a new token', () => {


      return mockUser.createNP()
        .then(userData => {
          tempUser = userData.user;
          tempToken = userData.token;
          return superagent.patch(`${API_URL}/api/reset`)
            .set('Authorization', `Bearer ${tempToken}`)
            .send({ password: 'newpassword' })
        })
        .then(res => {
          console.log(res.body);
          expect(res.status).toEqual(204);
          // expect(res.body.message.includes(tempUser.username)).toBeTruthy();
        })
        .catch(err => {
          expect(err).toBe(null);
        });
    });
  });
});
