const errorHandler = require('../lib/error-middleware.js')();
const { expect } = require('chai');

describe('Testing error middleware', () => {

  function spy(arg) {
    return arg;
  }
  const req = {};
  const res = {
    sendStatus: spy,
    send: spy,
    status: (code) => ({
      send: (data) => {
        return {
          status: code,
          body: spy(data)
        };
      }
    })
  };

  it('should return a 400', () => {

    const err = { message: 'Validation failed' };
    const output = errorHandler(err, req, res);
    expect(output.status).to.equal(400);
    expect(output.body).to.equal(err.message);
  });

  it('should return a 404', () => {
    const err = { message: 'Objectid failed' };
    const output = errorHandler(err, req, res);
    expect(output.status).to.equal(404);
    expect(output.body).to.equal(err.message);
  });

  it('should return a 409', () => {
    const err = { message: 'Duplicate key' };
    const output = errorHandler(err, req, res);
    expect(output.status).to.equal(409);
    expect(output.body).to.equal(err.message);
  });

  it('should return a 500', () => {
    const err = { message: 'miscellaneous error' };
    const output = errorHandler(err, req, res);
    expect(output.status).to.equal(500);
    expect(output.body).to.equal(err.message);
  });

  it('should return a 401', () => {
    const err = { message: 'Unauthorized Access' };
    const output = errorHandler(err, req, res);
    expect(output.status).to.equal(401);
    expect(output.body).to.equal(err.message);
  });

  it('should return a 403', () => {
    const err = { message: 'Forbidden resource update' };
    const output = errorHandler(err, req, res);
    expect(output.status).to.equal(403);
    expect(output.body).to.equal(err.message);
  });
});