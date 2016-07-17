'use strict';

var View = require('../classes/View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_card_template.html'),

  events: {
    'blur #inputTitle': 'updateTitle',
    'blur #inputDetails': 'updateDetails',
    'mouseup #delete': 'delete',
    'mouseup #toggleCompletion': 'toggleCompletion'
  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  updateTitle: function () {
    this.model.save({
      'title': this.$('#inputTitle').val().trim()
    });
  },

  updateDetails: function () {
    this.model.save({
      'details': this.$('#inputDetails').val().trim()
    });
  },

  toggleCompletion: function () {
    this.model.toggleCompletion();
  },

  delete: function () {
    this.model.destroy();
    this.remove();
    window.transition.back();
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  }
  
});
