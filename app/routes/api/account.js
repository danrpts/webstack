var express = require('express');
var router = express.Router();
var _ = require('underscore');
var google = require('../../helpers/google_helpers.js');

router.use(function (req, res, next) {

  if (req.accepts('json')) next();
  
  else {

    var err = new Error();
    err.code = 406;
    next(err);
  }

});

/**
  * router.get('/api/account.json')
  *
  * @response <JSON Object>
  */
router.get('/account(.json)?', function (req, res, next) {
  // TODO: handle errors
  // TODO: call controller
  // TODO: form response
  res.json({ "email": undefined });
});

  /**
  * router.post('/api/account')
  * Endpoint for posting a Google one-time access code to be exchanged for an OAuth2 access/refresh token.
  * This implementation is based on the hybrid server side flow for Google+ logins:
  * https://developers.google.com/+/web/signin/server-side-flow
  *
  * @response <JSON Object>
  */
router.post('/account', function (req, res, next) {

  // TODO: handle errors
  if (!req.body['code']) console.log('problem');

  // TODO: call controller
  google.getAccessToken(req.body['code'], function (tokens) {

    console.log(tokens);

    // TODO: form response
    res.json({ "hello": "world" });

  });


});

module.exports = router;
