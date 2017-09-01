'use strict';

process.env.MONGO_URI = process.env.mongoURI || 'mongodb://localhost/db';

const expect = require('chai').expect;
const request = require('superagent-use')(require('superagent'));
const superPromise = require('superagent-promise-plugin');

const Review = require('../src/model/Review.js');
const reviewRouter = require('../src/route/review-router.js');

const PORT = process.env.PORT || 3000;

const baseURL = `localhost:${PORT}/api`;
const server = require('../server.js');
request.use(superPromise);

describe('testing the review router', () => {
  before((done) => {
    if (!server.isRunning) {
      server.listen(PORT, () => {
        server.isRunning = true;
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST for api/review', () => {
    afterEach((done) => {
      Promise.all([
        reviewRouter.removeAllReviews(),
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a review with a title and author', (done) => {
      request.post(`${baseURL}/review`)
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
        new Review(testReview2).save()
      ])
      .then(() => done())
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
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.submissions.length).to.equal(2);
        done();
      })
      .catch(done);
    });
  });
});
