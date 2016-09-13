'use strict';

var View = require('../../../architecture/classes/View.js');

var codes = require('../config/keycodes.json');

module.exports = View.extend({

  template: require('../../templates/task_card.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'keyup #inputTitle': 'updateTitle',
    'keyup #inputDetails': 'updateDetails',
    'mouseup #delete': 'delete',
    'mouseup #toggleCompletion': 'toggleCompletion'
  },

  isEnter: function (event) {
    return (event.which === codes['ENTER']) ? true : false;
  },

  updateTitle: function (event) {
    this.isEnter(event) &&
    this.model.save({
      'title': this.$('#inputTitle').val().trim()
    });
  },

  updateDetails: function (event) {
    this.isEnter(event) &&
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
  }
  
});
