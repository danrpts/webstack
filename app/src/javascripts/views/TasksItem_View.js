'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_item_template.html'),

  events: {
    'mouseup #toggleCompletion' : 'toggleCompletion',
    'mouseup #transitionToTask' : 'transitionToTask',
    'mouseup #delete' : 'delete'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  transitionToTask: function () {
     window.transition.to('tasks/' + this.model.id);
  },

  delete: function () {
    var remove = _.bind(this.remove, this);
    this.model.destroy();
    this.$el.fadeOut(remove);
  },

  render: function () {
    return View.prototype.render.call(this, function () {
      this.$el.fadeIn();
    });
  }
  
});
