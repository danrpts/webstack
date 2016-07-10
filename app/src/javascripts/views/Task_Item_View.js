'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_item_template.html'),

  events: {
    'mouseup #toggleCompletion': 'toggleCompletion',
    'mouseup #transitionToTask': 'transitionToTask',
    'mouseup #delete': 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  transitionToTask: function () {
    window.application.transition('task/' + this.model.id); // no-op if on same route
    //window.transition.routes['tasks/:id'](this.model.id);
  },

  delete: function () {
    this.model.destroy();
    this.remove();
  },

  postrender: function (options) {
    options.animate && this.$el.hide().fadeIn();
    componentHandler.upgradeElements(this.el);
  }
  
});
