var express = require('express');
var router = express.Router();

/**
  * router.get('/')
  *
  * @response <HTML template>
  */
router.get('/*', function(req, res, next) {
  res.render('index');
});

module.exports = router;