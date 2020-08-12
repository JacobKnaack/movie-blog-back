'use strict';
require('dotenv').config();

// load npm modules
const expect = require('expect');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

// load app modules
const server = require('../server.js');
const mockUser = require('./lib/mock-user.js');
const request = supertest(server.app);

describe('Testing the Auth', () => {
  let tempToken = null;
  let tempUser = null;


  describe('testing POST /api/signup', () => {
    it('should respond with a token', () => {
      return request.post('/api/signup')
        .send({
          username: 'test_user',
          password: 'top secret',
          email: 'test_user@example.lulwat',
          np_as: process.env.NIT_PICKER_ACCESS_SECRET,
        })
        .then(res => {
          const userData = jwt.decode(res.text);
          expect(res.status).toEqual(200);
          expect(userData.username).toEqual('test_user');
        });
    });
  });

  describe('testing GET /api/login', () => {
    it('should respond with an np user and a token', () => {

      return mockUser.createNP()
        .then(userData => {
          tempUser = userData.user;
          tempToken = userData.token;
          let encoded = Buffer.from(`${tempUser.username}:${userData.password}`).toString('base64');
          return request.post('/api/login')
            .set('Authorization', `Basic ${encoded}`);
        })
        .then(res => {
          const userData = jwt.decode(res.body.accessToken);
          expect(res.status).toEqual(200);
          expect(userData.username).toEqual(tempUser.username);
        });
    });
  });

  describe('testing PATCH /api/reset/', () => {
    it('should respond with a new token', () => {

      let PASS = 'newpassword';
      return mockUser.createNP()
        .then(userData => {
          tempUser = userData.user;
          tempToken = userData.token;

          return request.patch('/api/reset')
            .set('Authorization', `Bearer ${tempToken}`)
            .send({ password: PASS });
        })
        .then(res => {
          expect(res.status).toEqual(204);
          let encoded = Buffer.from(`${tempUser.username}:${PASS}`).toString('base64');
          return request.post('/api/login')
            .set('Authorization', `Basic ${encoded}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
        })
        .catch(err => {
          expect(err).toBe(null);
        });
    });
  });

  describe('testing non-existent route', () => {
    it('should respond with a 404', () => {
      request.get('/no-route')
        .then(res => {
          expect(res.status).toBe(404);
        });
    });
  });
});
