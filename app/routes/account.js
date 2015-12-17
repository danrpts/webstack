var express = require('express');
var passport = require('passport');
var router = express.Router();
var _ = require('underscore');
var helpers = require('../helpers/error_helpers.js');

var google = function (options) {
  return passport.authenticate('google', options);
}

var authenticate = function (req, res, next) {
  if (!req.isAuthenticated()) {
    next(helpers.httpError(401));
  } next();
}

// Account REST endpoint
module.exports = function (app) {

  router.get('/api/account(.json)?', function (req, res, next) {
    res.json({ user: req.user });
  });

  router.get('/auth/google', google({ scope: 'https://www.googleapis.com/auth/plus.login' }));

  router.get('/auth/google/callback', google({ failureRedirect: '/' }),
    function (req, res, next) {
      // Successful authentication, redirect home.
      res.redirect('/');
  });

  app.use(router);
  
}
