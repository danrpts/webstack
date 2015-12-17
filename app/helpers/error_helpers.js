var _ = require('underscore');
var codes = require('../config/codes.json');

// The HTTPError Class
var HTTPError = function (number) {
  this.code = number || 520;
  this.message = codes[this.code];
  this.stack = (new Error()).stack;
  Error.apply(this);
}; HTTPError.prototype = Object.create(Error.prototype);

_.extend(HTTPError.prototype, {
  name: 'HTTPError',
  toJSON: function () {
    return {
      code: this.code,
      message: this.message
    }
  }
});

var format = function (err) {
  return { "error": err.toJSON() }
}

module.exports = {

  // Log the error stack trace
  logger: function (err, req, res, next) {
    console.error(err.stack);
    next(err);
  },

  client: function (err, req, res, next) {
    if (req.xhr) {
      res.status(err.code).json(format(err));
    } else next(err);
  },

  basic: function (err, req, res, next) {
    res.status(err.code).render('error', format(err));
  },

  // Return a new HTTPError
  httpError: function (code) {
    return new HTTPError(code);
  }

}
