'use strict';

const expect = require('chai').expect;
const supertest = require('supertest');

const Review = require('../model/review/schema.js');
const reviewRouter = require('../route/review-router.js');
const mockUser = require('./lib/mock-user.js');
const createReviews = require('./lib/create-reviews.js');

const server = require('../server.js');
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
      request.post('/api/review')
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          movieId: '127635876325',
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
          expect(res.body.created_on).to.exist;
          done();
        })
        .catch(done);
    });
  });

  describe('testing GET for api/review', () => {
    let tempReviewData;
    let testReviews = createReviews.byNumber(30);
    let movieMatch1 = createReviews.byParams({ movieId: '00000001' });
    let movieMatch2 = createReviews.byParams({ movieId: '00000001' });
    let userMatch1 = createReviews.byParams({ user: 'someone' });
    let userMatch2 = createReviews.byParams({ user: 'someone' });
    testReviews = [...testReviews, movieMatch1, movieMatch2, userMatch1, userMatch2];

    before((done) => {

      let promises = testReviews.map(review => new Review(review).save());
      Promise.all([
        ...promises,
        mockUser.createOne()
      ])
        .then(promiseData => {
          tempReviewData = promiseData[0];
          done();
        })
        .catch(done);
    });

    after((done) => {
      Promise.all([
        reviewRouter.removeAllReviews()
      ])
        .then(() => done())
        .catch(done);
    });

    it('should return first 15 reviews, no auth required', (done) => {
      request.get('/api/reviews')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(15);
          done();
        })
        .catch(done);
    });

    it('should return the next page of reviews', (done) => {
      request.get('/api/reviews?page=2')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(15);
          done();
        })
        .catch(err => {
          console.error(err);
          done();
        });
    });

    it('shoulde return the final page of reviews', (done) => {
      request.get('/api/reviews?page=3')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(4);
          done();
        })
        .catch(err => {
          console.error(err);
          done();
        });
    });

    it('should return all reviews by movieId, no auth required', (done) => {
      request.get(`/api/reviews/${movieMatch1.movieId}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          done();
        })
        .catch(done);
    });

    it('should return all review by user name, no auth required', (done) => {
      request.get(`/api/reviews/by/${userMatch1.user}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          expect(res.body[0].user).to.equal('someone');
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
    let tempUserData, tempReviewData;
    let testReview = {
      movieId: 12731298736,
      title: 'test review',
      user: 'test user',
      html: 'text content',
      created_on: new Date(),
      updated_on: new Date(),
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
    let tempUserData, tempReviewData;
    let testReview = {
      movieId: 12731298736,
      title: 'anothrer',
      user: 'different user',
      html: 'test content',
      created_on: new Date(),
      updated_on: new Date(),
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
