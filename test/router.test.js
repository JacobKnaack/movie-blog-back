'use strict';

process.env.MONGO_URI = process.env.mongoURI || 'mongodb://localhost/db';

const expect = require('chai').expect;
const request = require('superagent-use')(require('superagent'));
const superPromise = require('superagent-promise-plugin');
const fs = require('fs');

const Review = require('../src/model/Review.js');
const reviewRouter = require('../src/route/review-router.js');

const PORT = process.env.PORT || 3000;

const baseURL = `localhost:${PORT}/api`;
const server = require('../server.js');
request.use(superPromise);

describe('testing the review rouer', () => {
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
    let imageData = {
      data: './test/testAsset/abstract.jpeg',
      fileType: 'jpeg'
    };

    afterEach((done) => {
      Promise.all([
        reviewRouter.removeAllReviews()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a review with title and release date', (done) => {
      request.post(`${baseURL}/review`)
      .send({
        title: 'testReview',
        release: 2000
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('testReview');
        expect(res.body.release).to.equal(2000);
        done();
      })
      .catch(done);
    });

    it('should return a review with an added image', (done) => {
      request.post(`${baseURL}/review`)
      .send({
        title: 'testReview4',
        release: 2001,
        image: imageData
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.image.contentType).to.equal('image/jpeg');
        done();
      })
      .catch(done);
    });
  });

  describe('testing GET for api/review', () => {
    let testReview1 = {
      title: 'Test Movie',
      release: 1989
    };
    let testReview2 = {
      title: 'another movie',
      release: 1990
    };
    let testReview5 = {
      title: 'image movie',
      release: 2005,
      image: {
        data: fs.readFileSync('./test/testAsset/abstract.jpeg'),
        contentType: 'image/jpeg'
      }
    };

    before((done) => {
      Promise.all([
        new Review(testReview1).save(),
        new Review(testReview2).save(),
        new Review(testReview5).save()
      ])
      .then(() => done())
      .catch(done);
    });

    after((done) => {
      Promise.all([
        reviewRouter.removeAllReviews()
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return all reviews', (done) => {
      request.get(`${baseURL}/review`)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        done();
      })
      .catch(done);
    });
  });

  describe('testing PUT for api/review', () => {
    let testReview = {
      title: 'No Content yet',
      release: 1991
    };

    before((done) => {
      Promise.all([
        new Review(testReview).save()
      ])
      .then(review => {
        this.tempReview = review[0];
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

    it('should return a review with content added', (done) => {
      request.put(`${baseURL}/review/${this.tempReview._id}`)
      .send({
        jacob: {
          title: 'jacob\'s review',
          content: 'test review content'
        }
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.jacob.title).to.equal('jacob\'s review');
        done();
      })
      .catch(done);
    });
  });

  describe('testing DELETE for api/review', () => {
    let testReview = {
      title: 'Delete me',
      release: 2018
    };

    before((done) => {
      Promise.all([
        new Review(testReview).save()
      ])
      .then(review => {
        this.tempReview = review[0];
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

    it('should delete a review from the database', (done) => {
      request.delete(`${baseURL}/review/${this.tempReview._id}`)
        .then(res => {
          expect(res.status).to.equal(204);
          done();
        })
        .catch(done);
    });
  });
});
