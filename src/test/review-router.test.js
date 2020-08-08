'use strict';

const expect = require('chai').expect;
const supertest = require('supertest')

const Review = require('../model/Review.js');
const reviewRouter = require('../route/review-router.js');
const mockUser = require('./lib/mock-user.js');

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
      request.post(`/api/review`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          movieId: '127635876325',
          title: 'test review',
          user: 'test user',
          html: 'What a great experience, I loved this movie so much!!',
          created_on: "January 1, 2018 00:00:00",
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
    let tempUserData, tempReviewData;
    let testReview1 = {
      movieId: '123456789',
      title: 'something',
      user: 'someone',
      html: 'stuffs',
      created_on: new Date(),
      updated_on: new Date,
    };

    let testReview2 = {
      movieId: '123456789',
      title: 'stuff',
      user: 'another dude',
      html: 'aasdkfjhsdjhf',
      created_on: new Date(),
      updated_on: new Date(),
    };

    let testReview3 = {
      movieId: '81723969871',
      title: 'second',
      user: 'someone',
      html: '<p>this movie is also great great</p>',
      created_on: new Date(),
      updated_on: new Date,
    }

    before((done) => {
      Promise.all([
        new Review(testReview1).save(),
        new Review(testReview2).save(),
        new Review(testReview3).save(),
        mockUser.createOne()
      ])
        .then(promiseData => {
          tempReviewData = promiseData[0];
          tempUserData = promiseData[3];
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

    it('should return all reviews, no auth requred', (done) => {
      request.get(`/api/reviews`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(3);
          done();
        })
        .catch(done);
    });

    it('should return all reviews by movieId, no auth required', (done) => {
      request.get(`/api/reviews/123456789`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          done();
        })
        .catch(done);
    });

    it('should return all review by user name, no auth required', (done) => {
      request.get(`/api/reviews/by/someone`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          expect(res.body[0].user).to.equal('someone');
          done();
        })
        .catch(done);
    })

    it('should return a single review', (done) => {
      request.get(`/api/review/${tempReviewData._id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(tempReviewData._id.toString());
          done();
        })
        .catch(done);
    })
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
      request.put(`/api/review/${tempReviewData._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          title: 'different things',
          user: 'Perhaps a name change',
          html: 'I\'ve changed things!'
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
