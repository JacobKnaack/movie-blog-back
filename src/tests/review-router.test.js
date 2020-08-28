'use strict';

const expect = require('chai').expect;
const faker = require('faker');
const supertest = require('supertest');

const Review = require('../model/review/schema.js');
const Movie = require('../model/movie/schema.js');
const reviewRouter = require('../route/review-router.js');
const mockUser = require('./lib/mock-user.js');
const createReviews = require('./lib/create-reviews.js');
const createMovies = require('./lib/create-movies.js');

const server = require('../lib/server.js');
const movieRouter = require('../route/movie-router.js');
const request = supertest(server.app);

describe('testing the review router', () => {
  describe('testing POST for api/review', () => {
    let tempUserData;

    before(() => {
      return mockUser.createOne()
        .then(userData => {
          tempUserData = userData;
        });
    });

    afterEach((done) => {
      Promise.all([
        reviewRouter.removeAllReviews(),
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return a review with a title, user and html', (done) => {
      new Movie({
        name: faker.random.word(),
        release: faker.date.past(),
        image_path: faker.internet.url(),
        created_on: new Date(),
      })
        .save()
        .then(movie => {
          request.post('/api/review')
            .set('Authorization', `Bearer ${tempUserData.token}`)
            .send({
              movieId: movie._id,
              title: 'test review',
              user: 'test user',
              html: 'What a great experience, I loved this movie so much!!',
              created_on: 'January 1, 2018 00:00:00',
            })
            .then(res => {
              expect(res.status).to.equal(200);
              expect(res.body.title).to.equal('test review');
              expect(res.body.user).to.equal('test user');
              expect(res.body.html).to.equal('What a great experience, I loved this movie so much!!');
              expect(res.body.created_on).to.be.a('string');
              done();
            })
            .catch(done);
        });
    });

  });

  describe('testing GET for api/reviews', () => {
    let tempReviewData = [], tempMovieData = [], userMatch1 = null;

    before((done) => {
      Promise.all([
        ...createMovies.byNumber(2).map(data => new Movie(data).save()),
      ])
        .then(promiseData => {
          tempMovieData = [...promiseData];
          tempMovieData.forEach(movie => {
            tempReviewData = [
              ...tempReviewData,
              ...createReviews.byNumber(movie._id, 15),
              createReviews.byParams(movie._id, { user: 'someone' })
            ];
          });
          tempReviewData = tempReviewData.map(data => new Review(data).save());
          return Promise.all([...tempReviewData]);
        })
        .then(reviewData => {
          tempReviewData = reviewData[0];
          userMatch1 = reviewData[15];
          done();
        })
        .catch(done);
    });

    after((done) => {
      Promise.all([
        reviewRouter.removeAllReviews(),
        movieRouter.removeAllMovies(),
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return first 15 reviews, no auth required', (done) => {
      request.get('/api/reviews')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.count).to.equal(15);
          expect(res.body.next).to.equal(2);
          expect(res.body.results[0].movieData).to.be.a('object');
          done();
        })
        .catch(done);
    });

    it('should return a number of reviews specified in a url query', (done) => {

      let limit = 10;
      request.get(`/api/reviews?limit=${limit}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.count).to.equal(limit);
          expect(res.body.results).to.be.a('array');
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });

    it('should return the next page of reviews', (done) => {
      request.get('/api/reviews?page=2')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.count).to.equal(15);
          expect(res.body.next).to.equal(3);
          expect(res.body.results).to.be.a('array');
          done();
        })
        .catch(err => {
          console.error(err);
          done();
        });
    });

    it('should return the final page of reviews', (done) => {
      request.get('/api/reviews?page=3')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.count).to.equal(2);
          expect(res.body.results).to.be.a('array');
          done();
        })
        .catch(err => {
          console.error(err);
          done();
        });
    });

    it('should return all reviews by movieId, no auth required', (done) => {
      request.get(`/api/reviews/${tempReviewData.movieId}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(16);
          done();
        })
        .catch(done);
    });

    it('should return all review by user name, no auth required', (done) => {
      request.get(`/api/reviews/by/${userMatch1.user}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.count).to.equal(2);
          expect(res.body.results[0].user).to.equal('someone');
          done();
        })
        .catch(done);
    });

    it('should return a single review', (done) => {
      request.get(`/api/review/${tempReviewData._id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(tempReviewData._id.toString());
          done();
        })
        .catch(done);
    });
  });

  describe('testing PUT for api/review', () => {
    let tempUserData, tempMovieData, tempReviewData;

    before(done => {
      Promise.all([
        new Movie(createMovies.byNumber(1)[0]).save(),
        mockUser.createOne(),
      ])
        .then(promiseData => {
          tempMovieData = promiseData[0];
          tempUserData = promiseData[1];
          return new Review(createReviews.byParams(tempMovieData._id, { user: 'test user' })).save();
        })
        .then(reviewData => {
          tempReviewData = reviewData;
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        reviewRouter.removeAllReviews(),
        movieRouter.removeAllMovies(),
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return a review with updated content', (done) => {
      request.patch(`/api/review/${tempReviewData._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          title: 'different things',
          user: 'Perhaps a name change',
          html: 'I\'ve changed things!'
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('different things');
          expect(res.body.user).to.equal('Perhaps a name change');
          expect(res.body.html).to.equal('I\'ve changed things!');
          done();
        })
        .catch(done);
    });
  });

  describe('testing DELETE for api/review', () => {
    let tempUserData, tempMovieData, tempReviewData;

    before((done) => {
      Promise.all([
        new Movie(createMovies.byNumber(1)[0]).save(),
        mockUser.createOne()
      ])
        .then(promiseData => {
          tempMovieData = promiseData[0];
          tempUserData = promiseData[1];
          return new Review(createReviews.byParams(tempMovieData._id, { title: 'Remove me' })).save();
        })
        .then(reviewData => {
          tempReviewData = reviewData;
          done();
        })
        .catch(done);
    });

    afterEach(done => {
      Promise.all([
        reviewRouter.removeAllReviews()
      ])
        .then(() => done())
        .catch(done);
    });

    it('should remove a review', (done) => {
      request.delete(`/api/review/${tempReviewData._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
    });
  });
});
