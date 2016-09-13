var _ = require('underscore');
var express = require('express');
var router = express.Router();
var server = require('../../singletons/express_singleton.js');
var meta = require('../../helpers/meta_helpers.js');

// Populate local object with meta data
_.extend(server.locals.meta = {}, meta.data());

/**
  * router.get('/api/meta.json')
  *
  * @response <JSON Object>
  */
router.get('/meta(.json)?', function (req, res, next) {
  // TODO: handle errors
  res.json(server.locals.meta);
});

module.exports = router;
