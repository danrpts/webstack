var _ = require('underscore');
var Backbone = require('backbone');
var Router = require('../classes/Router.js');
var config = require('../config/tasks_config.json');

module.exports = Router.extend({

  routes: {
    '': 'list',
    'tasks/:id': 'card'
  },

  initialize: function () {
    this.listenTo(Backbone, config.name + ':goto', this.goto);
  }

});
