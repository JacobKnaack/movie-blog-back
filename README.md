
<span style="text-align: center">

# Movie Blog Backend

![badge](https://action-badges.now.sh/JacobKnaack/movie-blog-back)
![Heroku](https://heroku-badge.herokuapp.com/?app=movie-blog-backend)

</span>

A server for a movie review blog

* built with nodejs / express / mongodb

## Installation

This library requires Node JS and MongoDB in order to function.

* [Node JS](https://nodejs.org/) - A Javascript runtime.
* [MongoDB](https://www.mongodb.com/) - A NoSQL database.

## Authorization

Authorization is handled using basic string based authentication and bearer token based resource requests authentication.

In order to make resource generating requests (POST / PUT / PATCH / DELETE), you must attach have a token.

see /login and /signup if you would like to obtain a token.

### Token Generation

Tokens are created using string based authentication.

1) There is no public signup process,  this mus be handled by server admin
2) Login follows standard basic Auth process
   1) header should include `{Authorization: 'Basic <BASE_64_ENCRYPTED_CREDENTIALS>'}`
3) Serve will respons with `Bearer` token for use in authenticated requests 

## Endpoints

### /api

These routes interface directly with the applications resources:

#### /login

#### /signup

#### /movies

Fetches movies resources that are associated by user and a parent of `reviews`

#### /reviews

## Reddit Bot

- Includes a library that can interface with the reddit API for automated events.
  - POSTing reviews should be able to create an approriate post on a subreddit of users choice.
  - Credentials should be available for community engagement on the reddit platform.