'use strict';

var _ = require('underscore');
var View = require('../classes/View.js');
var codes = require('../config/keycodes_config.json');

var Task_Item_View = require('./Task_Item_View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'mouseup #toggleAllCompletion': 'toggleAllCompletion',
    'keyup #inputTitle': 'onEnter'
  },

  defaultViews: {
    '[data-region="list"]': 'buildList'
  },

  initialize: function () {

    this.listenTo(this.collection, 'change', this.render);
    
    window.remove = _.bind(this.remove, this);
    
    window.views = _.bind(function () {
      console.log(this.views);
    }, this);
  
  },

  buildList: function () {
    return this.collection.map(function (task) {
      return new Task_Item_View({ model: task });
    });
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

      // Notice how a handler is not needed because the model is available
      var task_item_view = new Task_Item_View({ model: task });

      // Use the compositing functionality to append
      this.appendViews(task_item_view, '[data-region="list"]');

    }

  },

  postrender: function () {
    componentHandler.upgradeElements(this.el);  
  }

});
