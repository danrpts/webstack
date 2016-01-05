var _ = require('underscore');
var Backbone = require('backbone');
var Router = require('../classes/Router.js');
var config = require('../config/tasks_config.json');

module.exports = Router.extend({

  routes: {
    '': 'showList',
    'tasks/:id': 'showCard'
  },

  initialize: function () {
    this.listenTo(Backbone, 'goto:' + config.name, this.goto);
  }

});
