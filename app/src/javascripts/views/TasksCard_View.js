'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_card_template.html'),

  events: {
    'blur #inputTitle': 'updateTitle',
    'blur #inputDetails': 'updateDetails',
    'mouseup #transitionBack': 'transitionBack',
    'mouseup #transitionHome': 'transitionHome',
    'mouseup #delete': 'delete',
    'mouseup #toggleCompletion': 'toggleCompletion'
  },
  
  initialize: function () {
    // May need to _.debounce render
    this.listenTo(this.model, 'change', this.render);
  },

  updateTitle: function () {
    this.model.save({
      'title': this.$('#inputTitle').val().trim()
    },
    { wait: true });
  },

  updateDetails: function () {
    this.model.save({
      'details': this.$('#inputDetails').val().trim()
    },
    { wait: true });
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  transitionBack: function () {
     window.transition.back();
  },

  transitionHome: function () {
     window.transition.to('');
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.transitionBack();
  },
  
});
