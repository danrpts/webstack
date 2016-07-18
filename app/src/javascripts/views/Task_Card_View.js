'use strict';

var View = require('../classes/View.js');

var codes = require('../config/keycodes_config.json');

module.exports = View.extend({

  template: require('../../templates/tasks_card_template.html'),

  events: {
    'keyup #inputTitle': 'updateTitle',
    'keyup #inputDetails': 'updateDetails',
    'mouseup #delete': 'delete',
    'mouseup #toggleCompletion': 'toggleCompletion'
  },
  
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
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
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  }
  
});
