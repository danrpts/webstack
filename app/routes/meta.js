var express = require('express');
var router = express.Router();
var _ = require('underscore');

// Meta data REST endpoint
module.exports = function (app) {

  app.locals.meta = {};
  _.extend(app.locals.meta, _.pick(require('../../package.json'), 'version', 'name', 'author'));

  router.get('/api/meta(.json)?', function(req, res, next) {
    res.json(app.locals.meta);
  });

  app.use(router);
}
