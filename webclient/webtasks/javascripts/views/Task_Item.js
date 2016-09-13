'use strict';

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

module.exports = View.extend({

  template: require('../../templates/task_item.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'click .task-toggle': 'onToggleClick',
    'click .task-delete': 'onDeleteClick'
  },

  onToggleClick: function () {
    this.model.toggleCompletion();
  },

  onDeleteClick: function () {
    this.model.destroy();
    this.remove();
  }
  
});
