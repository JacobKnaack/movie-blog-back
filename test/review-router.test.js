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
          submissions: [{
            title: 'test review',
            author: 'test author',
            content: 'test content'
          }]
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.submissions[0].title).to.equal('test review');
          expect(res.body.submissions[0].author).to.equal('test author');
          done();
        })
        .catch(done);
    });
  });

  describe('testing GET for api/review', () => {
    let tempUserData;
    let testReview1 = {
      movieId: 72837379,
      submissions: [{
        title: 'something',
        author: 'someone',
        content: 'stuffs'
      }]
    };

    let testReview2 = {
      movieId: 36478293,
      submissions: [
        {
          title: 'more stuff',
          author: 'a dude',
          content: 'asdjfhasdjhf'
        },
        {
          title: 'stuff',
          author: 'another dude',
          content: 'aasdkfjhsdjhf'
        }
      ]
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

    it('should return all reviews', (done) => {
      request.get(`${baseURL}/review/36478293`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.submissions.length).to.equal(2);
          done();
        })
        .catch(done);
    });
  });

  describe('testing PUT for api/review', () => {
    let tempUserData;
    let testReview = {
      movieId: 12731298736,
      submissions: [{
        title: 'test review',
        author: 'test author',
        content: 'text content'
      }]
    };

    before(done => {
      Promise.all([
        new Review(testReview).save(),
        mockUser.createOne()
      ])
        .then(promiseData => {
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

    it('should return a review with added content', (done) => {
      request.put(`${baseURL}/review/${testReview.movieId}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          title: 'different things',
          author: 'new author',
          content: 'more reviews!'
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.submissions.length).to.equal(2);
          done();
        })
        .catch(done);
    });
  });

  describe('testing DELETE for api/review', () => {
    let tempUserData;
    let testReview = {
      movieId: 12731298736,
      submissions: [{
        title: 'test review',
        author: 'test author',
        content: 'text content'
      }, {
        title: 'anothrer',
        author: 'different author',
        content: 'test content'
      }]
    };

    before((done) => {
      Promise.all([
        new Review(testReview).save(),
        mockUser.createOne()
      ])
        .then(promiseData => {
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
      request.delete(`${baseURL}/review/${testReview.movieId}/${testReview.submissions[1].author}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
    });
  });
});
