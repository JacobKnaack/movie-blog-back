'use strict';
require('dotenv').config();
const snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: "Providing a unique perspective about movies, including discussion and reviews",
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
  acessToken: process.env.REDDIT_ACCESS_TOKEN,
});

module.exports = {
  fetchfilmPosts: () => {
    return new Promise((resolve, reject) => {
      r.getSubreddit('flicks').getTop()
        .then(posts => {
          resolve(posts);
        })
        .catch(err => reject(err));
    });
  },
};

