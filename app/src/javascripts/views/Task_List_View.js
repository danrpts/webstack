'use strict';

var _ = require('underscore');

var View = require('../classes/View.js');

var codes = require('../config/keycodes_config.json');

var Task_Item_View = require('./Task_Item_View.js');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'keyup #inputTitle': 'appendItem',
    'mouseup #toggleAllCompletion': 'toggleAllCompletion'
  },

  defaultViews: {
    '[data-region="list"]': 'buildList'
  },

  initialize: function () {
    this.listenTo(this.collection, 'change', this.render);
  },

  buildList: function () {
    return this.collection.map(function (task) {
      return new Task_Item_View({ model: task });
    });
  },

  isEnter: function (event) {
    return (event.which === codes['ENTER']) ? true : false;
  },

  appendItem: function () {
    
    if (this.isEnter(event)) {

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

    }

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

  postrender: function () {
    componentHandler.upgradeElements(this.el);  
  }

});
