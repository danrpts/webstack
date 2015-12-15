var _ = require('underscore');
var Backbone = require('backbone');
var Router = require('../classes/Router.js');
var controller = require('../controllers/tasks_controller.js');
var config = require('../config/tasks_config.js');

module.exports = Router.extend({

  routes: {
    '': controller.list,
    'tasks/:id': controller.card
  },

  initialize: function () {
    this.listenTo(Backbone, config.name + ':goto', this.goto);
  }

});
