var express = require('express');
var router = express.Router();
var _ = require('underscore');
var helpers = require('../helpers/meta_helpers.js');

// Meta data REST endpoint
module.exports = function (app) {

  app.locals.meta = {};
  _.extend(app.locals.meta, helpers.data());

  router.get('/api/meta(.json)?', function (req, res, next) {
    res.json(app.locals.meta);
  });

  app.use(router);
  
}
