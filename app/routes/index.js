var express = require('express');
var router = express.Router();

// Static index.html endpoint
module.exports = function (app) {

  router.get('/', function(req, res, next) {
    res.render('index');
  });

  app.use(router);

}
