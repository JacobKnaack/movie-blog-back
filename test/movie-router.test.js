'use strict';

process.env.MONGO_URI = process.env.mongoURI || 'mongodb://localhost/db';

const expect = require('chai').expect;
const request = require('superagent-use')(require('superagent'));
const superPromise = require('superagent-promise-plugin');

const Movie = require('../src/model/Movie.js');
const mockUser = require('./lib/mock-user.js');
const cleanDB = require('./lib/clean-db.js');
const movieRouter = require('../src/route/movie-router.js');

const PORT = process.env.PORT || 3000;
const baseURL = `localhost:${PORT}/api`;
const server = require('../src/server.js');
request.use(superPromise);

describe('testing the movie router', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('testing POST for api/movies', () => {
    let testMovie = {
      name: 'test movie1',
      release: new Date(),
      image_path: 'an/image/path',
    };
    let tempUserData;

    before(() => {
      return mockUser.createOne()
        .then(userData => {
          tempUserData = userData;
        });
    });

    afterEach((done) => {
      Promise.all([
        movieRouter.removeAllMovies()
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return a movie', (done) => {
      request.post(`${baseURL}/movies`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send(testMovie)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test movie1');
          expect(res.body.image_path).to.equal('an/image/path');
          done();
        })
        .catch(done);
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

    after((done) => {
      Promise.all([
        movieRouter.removeAllMovies()
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return all movies', (done) => {
      request.get(`${baseURL}/movies`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          expect(res.body[0].name).to.equal('test movie2');
          done();
        })
        .catch(done);
    });

    it('should return a movie by id', (done) => {
      request.get(`${baseURL}/movie/${tempMovieData._id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(tempMovieData._id.toString());
          done();
        })
        .catch(done);
    });

    it('should return a movie by title', (done) => {
      const movieName = encodeURIComponent(tempMovieData.name);
      request.get(`${baseURL}/movie_title/${movieName}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(tempMovieData.name);
          done();
        })
        .catch(done);
    })
  });
});
