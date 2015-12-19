var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var View = require('../classes/View.js');
var config = require('../config/tasks_config.js');

var EmptyView = View.extend({

  template: require('../../templates/tasks_EmptyTemplate.html'),

  render: function () {

    this.compile();
    return this.$el;

  }

});

module.exports = EmptyView;
