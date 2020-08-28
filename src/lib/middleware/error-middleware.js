
'use strict';

exports.notFound = (res, message) => {
  console.log(`__ERROR: ${message || 'Resource not found'}`);
  return res.status(404).send(message || 'Resource Not Found');
};
exports.badRequest = (res, message) => {
  console.log(`__ERROR: ${message || 'Bad Request'}`);
  return res.status(400).send(message || 'Bad Request');
};
exports.serverError = (res, message) => {
  console.log(`__ERROR: ${message || 'Server error'}`);
  return res.status(500).send(message || 'Server Error');
};
exports.serverConflict = (res, message) => {
  console.log(`__ERROR: ${message || 'Resource Conflict'}`);
  return res.status(409).send(message || 'Resource Conflict');
};
exports.unauthorized = (res, message) => {
  console.log(`__ERROR: ${message || 'Unauthorized Access'}`);
  return res.status(401).send(message || 'Unauthorized Access');
};
exports.forbidden = (res, message) => {
  console.log(`__ERROR: ${message || 'Acess Forbidden'}`);
  return res.status(403).send(message || 'Access Forbidden');
};

exports.handler = (err, req, res) => {
  console.log('Error Captured:', err.message);
  if (err.message.toLowerCase().includes('validation failed')) {

    return this.badRequest(res, err.message);
  }

  if (err.message.toLowerCase().includes('duplicate key')) {
    return this.serverConflict(res, err.message);
  }

  if (err.message.toLowerCase().includes('objectid failed')) {
    return this.notFound(res, err.message);
  }

  if (err.message.toLowerCase().includes('unauthorized')) {
    return this.unauthorized(res, err.message);
  }

  if (err.message.toLowerCase().includes('forbidden')) {
    return this.forbidden(res, err.message);
  }

  return this.serverError(res, err.message);
};

module.exports = (type) => {
  return this[type] ? this[type] : this.handler;
};
