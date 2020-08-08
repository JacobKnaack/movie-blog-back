# Movie Blog Backend

![badge](https://action-badges.now.sh/JacobKnaack/movie-blog-back)

A server for a movie review blog

* built with nodejs / express / mongodb

## Installation

This library requires Node JS and MongoDB in order to function.

* [Node JS](https://nodejs.org/) - A Javascript runtime.
* [MongoDB](https://www.mongodb.com/) - A NoSQL database.

## Authorization

In order to make resource generating requests (POST / PUT / PATCH / DELETE), you must attach have a token.

### Token Generation

Tokens are created using string based authentication.

## Endpoints

### /api

These routes interface directly with the applications resources:

#### /login

#### /signup

#### /movies

Fetches movies resources that are associated by user and a parent of `reviews`

#### /reviews
