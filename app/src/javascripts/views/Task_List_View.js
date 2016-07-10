'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');
var codes = require('../config/keycodes_config.json');

var task_item_controller = require('../controllers/task_item_controller.js');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'mouseup #toggleAllCompletion': 'toggleAllCompletion',
    'keyup #inputTitle': 'onEnter'
  },

  initialize: function () {
    this.listenTo(this.collection, 'change', this.render);
  },

  toggleAllCompletion: function () {

    // Coax into boolean flag
    var flag = !!this.collection.find(function (model) {
      return !model.get('completed');
    });

    // Set all true if any flag otherwise set all false
    this.collection.each(function (model) {
      model.complete(flag);
    });
  },

  onEnter: function (event) {
    if (event.which === codes['ENTER']) {
      this.appendItem();
    }
  },

  appendItem: function () {
    var $input = this.$('#inputTitle');
    var task = this.collection.create({
      'created': Date.now(),
      'title': $input.val().trim()
    }, {
      validate: true,
      wait: true,
      silent: true
    });
    if (!!task) {
      
      $input.val('').blur();

      this.$('.mdl-js-textfield')[0].MaterialTextfield.checkDirty();

      var task_item_view = task_item_controller(task.id);

      this.append(task_item_view, '[data-region="list"]');

    }
  },

  postrender: function (options) {

    this.collection.each(function (task) {

      var task_item_view = task_item_controller(task.id);

      this.append(task_item_view, '[data-region="list"]');

    }, this);

    options.animate && this.$('[data-region="list"]').hide().fadeIn();

    componentHandler.upgradeElements(this.el);
  
  }

});
