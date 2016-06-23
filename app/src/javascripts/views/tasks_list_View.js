'use strict';

var $ = require('jquery');
var View = require('../classes/View.js');
var ItemView = require('./tasks_item_View.js');
var codes = require('../config/keycodes_config.json');

module.exports = View.extend({

  template: require('../../templates/tasks_list_template.html'),

  events: {
    'mouseup .all' : 'check',
    'mouseup .clear' : 'remove',
    'keyup #input-title': 'enter'
  },

  check: function () {

    // Coax into boolean flag
    var flag = !!this.collection.find(function (model) {
      return !model.get('completed');
    });

    // Set all true if any flag otherwise set all false
    this.collection.each(function (model) {
      model.check(flag);
    });
  },

  enter: function (event) {
    if (event.which === codes['ENTER']) {
      var input = this.$('#input-title');
      this.collection.create({
        'created': Date.now(),
        'title': input.val().trim()
      },
      { wait: true });
      input.val('').blur();
      this.render();
    }
  },

  render: function () {
    
    return View.prototype.render.call(this, function () {
     
      var $fragment = $(document.createDocumentFragment());
      
      this.collection.each(function (item) {
        (new ItemView({ model: item })).insert($fragment);
      });

      $fragment.appendTo(this.$('ul#task-items'));

      this.$el.hide().fadeIn();
    
    });
  
  }

});
