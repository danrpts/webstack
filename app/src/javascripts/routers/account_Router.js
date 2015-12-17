var _ = require('underscore');
var Backbone = require('backbone');
var Router = require('../classes/Router.js');

module.exports = Router.extend({

  routes: {
    '': 'api.card'
  }

});
