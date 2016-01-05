var _ = require('underscore');
var Backbone = require('backbone');
var Router = require('../classes/Router.js');
var config = require('../config/account_config.json');

module.exports = Router.extend({

  routes: {
    'account/:id': 'showCard'
  },

  initialize: function () {
    this.listenTo(Backbone, 'goto:' + config.name, this.goto);
  }

});
