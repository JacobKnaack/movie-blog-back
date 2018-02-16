'use strict';

process.env.MONGO_URI = process.env.mongoURI || 'mongodb://localhost/db';

const expect = require('chai').expect;
const request = require('superagent-use')(require('superagent'));
const superPromise = require('superagent-promise-plugin');

const Review = require('../src/model/Review.js');
const reviewRouter = require('../src/route/review-router.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

const PORT = process.env.PORT || 3000;
const baseURL = `localhost:${PORT}/api`;
const server = require('../src/server.js');
request.use(superPromise);

describe('testing the review router', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

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

    it('should return a review with a title and author', (done) => {
      request.post(`${baseURL}/review`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          movieId: 127635876325,
          title: 'test review',
          author: 'test author',
          markdown: 'test content'
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('test review');
          expect(res.body.author).to.equal('test author');
          done();
        })
        .catch(done);
    });
  });

  describe('testing GET for api/review', () => {
    let tempUserData;
    let testReview1 = {
      movieId: 4567382736,
      title: 'something',
      author: 'someone',
      makrdown: 'stuffs'
    };

    let testReview2 = {
      movieId: 4567382736,
      title: 'stuff',
      author: 'another dude',
      markdown: 'aasdkfjhsdjhf'
    };

    before((done) => {
      Promise.all([
        new Review(testReview1).save(),
        new Review(testReview2).save(),
        mockUser.createOne()
      ])
        .then(promiseData => {
          tempUserData = promiseData[2];
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        reviewRouter.removeAllReviews()
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return all reviews by movieId', (done) => {
      request.get(`${baseURL}/reviews/4567382736`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          done();
        })
        .catch(done);
    });
  });

  describe('testing PUT for api/review', () => {
    let tempUserData, tempReviewData;
    let testReview = {
      movieId: 12731298736,
      title: 'test review',
      author: 'test author',
      markdown: 'text content'
    };

    before(done => {
      Promise.all([
        new Review(testReview).save(),
        mockUser.createOne()
      ])
        .then(promiseData => {
          tempReviewData = promiseData[0];
          tempUserData = promiseData[1];
          done();
        })
        .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        reviewRouter.removeAllReviews()
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return a review with updated content', (done) => {
      request.put(`${baseURL}/review/${tempReviewData._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          title: 'different things',
          author: 'Perhaps a name change',
          markdown: 'I\'ve changed things!'
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('different things');
          done();
        })
        .catch(done);
    });
  });

  describe('testing DELETE for api/review', () => {
    let tempUserData, tempReviewData;
    let testReview = {
      movieId: 12731298736,
      title: 'anothrer',
      author: 'different author',
      content: 'test content'
    };

    before((done) => {
      Promise.all([
        new Review(testReview).save(),
        mockUser.createOne()
      ])
        .then(promiseData => {
          tempReviewData = promiseData[0];
          tempUserData = promiseData[1];
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
      request.delete(`${baseURL}/review/${tempReviewData._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
    });
  });
});
