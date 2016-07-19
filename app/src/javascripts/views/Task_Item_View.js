'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_item_template.html'),

  events: {
    'mouseup #toggleCompletion': 'toggleCompletion',
    'mouseup #delete': 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  }
  
});
