'use strict';

process.env.MONGO_URI = process.env.mongoURI || 'mongodb://localhost/db';

const expect = require('chai').expect;
const request = require('superagent-use')(require('superagent'));
const superPromise = require('superagent-promise-plugin');

const Movie = require('../src/model/Movie.js');
const movieRouter = require('../src/route/movie-router.js');

const PORT = process.env.PORT || 3000;

const baseURL = `localhost:${PORT}/api`;
const server = require('../src/server.js');
request.use(superPromise);

describe('testing the movie router', () => {
  before(server.start);
  after(server.stop);

  describe('testing POST for api/movie', () => {
    let testMovie = {
      'name': 'test movie',
      'release': new Date()
    };

    afterEach((done) => {
      Promise.all([
        movieRouter.removeAllMovies()
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return a movie', (done) => {
      request.post(`${baseURL}/movie`)
        .send(testMovie)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test movie');
          done();
        })
        .catch(done);
    });
  });

  describe('testing GET for api/movie', () => {
    let testMovie={name: 'test movie', release: new Date()};

    before((done) => {
      Promise.all([
        new Movie(testMovie).save()
      ])
        .then(() => done())
        .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        movieRouter.removeAllMovies()
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return a movie', (done) => {
      request.get(`${baseURL}/movies`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          expect(res.body[0].name).to.equal('test movie');
          done();
        })
        .catch(done);
    });


  });
});
