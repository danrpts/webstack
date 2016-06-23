'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_card_template.html'),

  events: {
    'mouseup .toggle': 'toggle',
    'mouseup .back': 'back',
    'mouseup .home': 'home',
    'mouseup .forward': 'forward',
    'mouseup .delete': 'delete',
    'blur #title-input': 'updateTitle',
    'blur #details-input': 'updateDetails'
  },
  
  initialize: function () {
    // May need to _.debounce render
    this.listenTo(this.model, 'change', this.render);
  },

  toggle: function () {
    this.model.toggle();
  },

  back: function () {
     window.transition.back();
  },

  home: function () {
     window.transition.to('');
  },

  forward: function () {
     window.transition.forward();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    this.back();
  },

  updateTitle: function () {
    this.model.save({
      'title': this.$('#title-input').val().trim()
    },
    { wait: true });
  },

  updateDetails: function () {
    this.model.save({
      'details': this.$('#details-input').val().trim()
    },
    { wait: true });
  }
  
});
