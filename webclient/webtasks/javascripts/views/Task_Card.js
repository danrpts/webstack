'use strict';

var $ = require('jquery');

var View = require('../../../architecture/classes/View.js');

var keycodes = require('../config/keycodes.json');

module.exports = View.extend({

  template: require('../../templates/task_card.html'),

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  postrender: function (options) {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'keyup .task-input':  'onInputKeyup',
    'click #task-toggle': 'onToggleClick',
    'click #task-delete': 'onDeleteClick'
  },

  onInputKeyup: function (event) {
    switch (event.which) {
      case keycodes['ENTER'] : this.onInputEnter($(event.currentTarget)); break;
    }
  },

  // Notice this enter key handler for all inputs
  onInputEnter: function ($input) {
    var key = $input.attr('id');
    var value = $input.val().trim();
    if (!! value) {
      this.model.save(key, $input.val().trim());
      $input.val('').blur();
      this.$('.mdl-js-textfield')[0].MaterialTextfield.checkDirty();
    }
  },

  onToggleClick: function () {
    this.model.toggleCompletion();
  },

  onDeleteClick: function () {
    this.model.destroy();
    this.remove();
    window.transition.back();
  }
  
});
