'use strict';

require('dotenv').config('../../.env');
const expect = require('chai').expect;
const supertest = require('supertest');

const Movie = require('../model/Movie.js');
const mockUser = require('./lib/mock-user.js');

const server = require('../server.js');
const request = supertest(server.app);

describe('testing the movie router', () => {
  describe('testing POST for api/movies', () => {
    let testMovie = {
      name: 'test movie1',
      release: new Date(),
      image_path: 'an/image/path',
    };
    let tempUserData;

    it('should return a movie', () => {
      return mockUser.createNP()
        .then(userData => {
          tempUserData = userData;
          return request.post('/api/movies')
            .set('Authorization', `Bearer ${tempUserData.token}`)
            .send(testMovie)
            .then(res => {
              expect(res.status).to.equal(200);
              expect(res.body.name).to.equal('test movie1');
              expect(res.body.image_path).to.equal('an/image/path');
            });
        })
        .catch(error => {
          console.log(error);
        });
    });
  });

  describe('testing GET for api/movies, no auth required', () => {
    let testMovie = {
      name: 'test movie2',
      release: new Date(),
      image_path: 'another/path',
      created_on: new Date(),
    };
    let tempUserData, tempMovieData;

    before((done) => {
      Promise.all([
        new Movie(testMovie).save(),
        mockUser.createOne()
      ])
        .then(promiseData => {
          tempMovieData = promiseData[0];
          tempUserData = promiseData[1];
          done();
        })
        .catch(done);
    });

    it('should return all movies', (done) => {
      request.get('/api/movies')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          expect(res.body[1].name).to.equal('test movie2');
          done();
        })
        .catch(done);
    });

    it('should return a movie by id', (done) => {
      request.get(`/api/movie/${tempMovieData._id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(tempMovieData._id.toString());
          done();
        })
        .catch(done);
    });

    it('should return a movie by title', (done) => {
      const movieName = encodeURIComponent(tempMovieData.name);
      request.get(`/api/movie_title/${movieName}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(tempMovieData.name);
          done();
        })
        .catch(done);
    })
  });
});
