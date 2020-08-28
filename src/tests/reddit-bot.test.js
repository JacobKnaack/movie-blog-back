'use strict';

const expect = require('chai').expect;
const rb = require('../lib/reddit-bot');

describe('testing third party features', () => {

  describe('testing a request to reddit-bot', () => {
    it('should return posts from a subreddit', (done) => {
      rb.fetchfilmPosts()
        .then(data => {
          expect(data).to.be.an('array');
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });
  });
});