'use strict';

var $ = require('jquery');

var _ = require('underscore');

var View = require('../../../architecture/classes/View.js');

var keycodes = require('../config/keycodes.json');

module.exports = View.extend({

  template: require('../../templates/tasks_input.html'),

  initialize: function () {

  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);
  },

  events: {
    'keydown #tasks-input':  'onInputKeyup',
    'click   #tasks-toggle': 'onToggleClick'
  },

  onInputKeyup: function (event) {
    switch (event.which) {
      case keycodes['ENTER'] : this.onInputEnter($(event.currentTarget)); break;
    }
  },

  onInputEnter: function ($input) {
    
    var task = this.collection.create({
      'created': Date.now(),
      'title': $input.val().trim()
    }, {
      validate: true,
      wait: true
    });

    if (!! task) {
      $input.val('').blur();
      this.$('.mdl-js-textfield')[0].MaterialTextfield.checkDirty();
    }

  },

  onToggleClick: function () {

    // Coax into boolean flag
    var flag = !!this.collection.find(function (model) {
      return !model.get('completed');
    });

    // Set all true if any flag otherwise set all false
    this.collection.each(function (model) {
      model.complete(flag);
    });
  }

});
